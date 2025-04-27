import MuscleRoom from "../models/muscleRoom.model.js";

// Crear una nueva sala de musculación
export const createMuscleRoom = async (req, res) => {
  try {
    const { name, capacity, description, equipment, status } = req.body;

    // Verificar si ya existe una sala con el mismo nombre
    const existingRoom = await MuscleRoom.findOne({ name });
    if (existingRoom) {
      return res.status(400).json({
        message: "Ya existe una sala con ese nombre"
      });
    }

    // Crear la nueva sala
    const newRoom = new MuscleRoom({
      name,
      capacity,
      description,
      equipment,
      status: status || 'available'
    });

    // Guardar la sala
    const savedRoom = await newRoom.save();

    res.status(201).json({
      message: "Sala de musculación creada exitosamente",
      room: savedRoom
    });

  } catch (error) {
    console.error("Error al crear la sala de musculación: ", error);
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las salas de musculación
export const getAllMuscleRooms = async (req, res) => {
  try {
    const rooms = await MuscleRoom.find();
    res.json(rooms);
  } catch (error) {
    console.error("Error al obtener las salas de musculación: ", error);
    res.status(500).json({ message: error.message });
  }
};

// Obtener una sala de musculación por ID
export const getMuscleRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;
    
    const room = await MuscleRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({
        message: "Sala de musculación no encontrada"
      });
    }
    
    res.json(room);
  } catch (error) {
    console.error("Error al obtener la sala de musculación: ", error);
    res.status(500).json({ message: error.message });
  }
};

// Actualizar una sala de musculación
export const updateMuscleRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { name, capacity, description, equipment, status } = req.body;
    
    // Verificar si la sala existe
    const room = await MuscleRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({
        message: "Sala de musculación no encontrada"
      });
    }
    
    // Verificar si el nuevo nombre ya existe en otra sala
    if (name && name !== room.name) {
      const existingRoom = await MuscleRoom.findOne({ name });
      if (existingRoom) {
        return res.status(400).json({
          message: "Ya existe una sala con ese nombre"
        });
      }
    }
    
    // Actualizar la sala
    const updatedRoom = await MuscleRoom.findByIdAndUpdate(
      roomId,
      {
        name: name || room.name,
        capacity: capacity || room.capacity,
        description: description || room.description,
        equipment: equipment || room.equipment,
        status: status || room.status
      },
      { new: true }
    );
    
    res.json({
      message: "Sala de musculación actualizada exitosamente",
      room: updatedRoom
    });
    
  } catch (error) {
    console.error("Error al actualizar la sala de musculación: ", error);
    res.status(500).json({ message: error.message });
  }
};

// Eliminar una sala de musculación
export const deleteMuscleRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    
    // Verificar si la sala existe
    const room = await MuscleRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({
        message: "Sala de musculación no encontrada"
      });
    }
    
    // Eliminar la sala
    await MuscleRoom.findByIdAndDelete(roomId);
    
    res.json({
      message: "Sala de musculación eliminada exitosamente"
    });
    
  } catch (error) {
    console.error("Error al eliminar la sala de musculación: ", error);
    res.status(500).json({ message: error.message });
  }
}; 