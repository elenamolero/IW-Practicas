import MuscleRoomReserve from "../models/muscleRoomReserve.model.js";
import MuscleRoom from "../models/muscleRoom.model.js";

// Crear una nueva reserva de sala de musculación
export const createMuscleRoomReserve = async (req, res) => {
  try {
    const { muscleRoom, date, startTime, endTime, numberOfPeople, notes } = req.body;
    const userId = req.user.id;

    // Verificar si la sala existe y está disponible
    const room = await MuscleRoom.findById(muscleRoom);
    if (!room) {
      return res.status(404).json({
        message: "Sala de musculación no encontrada"
      });
    }

    if (room.status !== 'available') {
      return res.status(400).json({
        message: "La sala no está disponible para reservas"
      });
    }

    // Verificar si el número de personas excede la capacidad
    if (numberOfPeople > room.capacity) {
      return res.status(400).json({
        message: "El número de personas excede la capacidad de la sala"
      });
    }

    // Verificar si ya existe una reserva para la misma sala en el mismo horario
    const existingReserve = await MuscleRoomReserve.findOne({
      muscleRoom,
      date,
      startTime,
      endTime,
      status: { $ne: 'cancelled' }
    });

    if (existingReserve) {
      return res.status(400).json({
        message: "Ya existe una reserva para esta sala en el horario seleccionado"
      });
    }

    // Crear la nueva reserva
    const newReserve = new MuscleRoomReserve({
      user: userId,
      muscleRoom,
      date,
      startTime,
      endTime,
      numberOfPeople,
      notes,
      status: 'pending'
    });

    // Guardar la reserva
    const savedReserve = await newReserve.save();

    res.status(201).json({
      message: "Reserva creada exitosamente",
      reserve: savedReserve
    });

  } catch (error) {
    console.error("Error al crear la reserva: ", error);
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las reservas del usuario
export const getUserReserves = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const reserves = await MuscleRoomReserve.find({ user: userId })
      .populate('muscleRoom', 'name capacity')
      .sort({ date: 1, startTime: 1 });
    
    res.json(reserves);
  } catch (error) {
    console.error("Error al obtener las reservas: ", error);
    res.status(500).json({ message: error.message });
  }
};

// Obtener una reserva específica
export const getReserveById = async (req, res) => {
  try {
    const { reserveId } = req.params;
    const userId = req.user.id;
    
    const reserve = await MuscleRoomReserve.findOne({
      _id: reserveId,
      user: userId
    }).populate('muscleRoom', 'name capacity');
    
    if (!reserve) {
      return res.status(404).json({
        message: "Reserva no encontrada"
      });
    }
    
    res.json(reserve);
  } catch (error) {
    console.error("Error al obtener la reserva: ", error);
    res.status(500).json({ message: error.message });
  }
};

// Actualizar una reserva
export const updateReserve = async (req, res) => {
  try {
    const { reserveId } = req.params;
    const userId = req.user.id;
    const { date, startTime, endTime, numberOfPeople, notes, status } = req.body;
    
    // Verificar si la reserva existe y pertenece al usuario
    const reserve = await MuscleRoomReserve.findOne({
      _id: reserveId,
      user: userId
    });
    
    if (!reserve) {
      return res.status(404).json({
        message: "Reserva no encontrada"
      });
    }
    
    // Si se está actualizando el número de personas, verificar la capacidad
    if (numberOfPeople) {
      const room = await MuscleRoom.findById(reserve.muscleRoom);
      if (numberOfPeople > room.capacity) {
        return res.status(400).json({
          message: "El número de personas excede la capacidad de la sala"
        });
      }
    }
    
    // Si se están actualizando fecha u hora, verificar disponibilidad
    if (date || startTime || endTime) {
      const existingReserve = await MuscleRoomReserve.findOne({
        muscleRoom: reserve.muscleRoom,
        date: date || reserve.date,
        startTime: startTime || reserve.startTime,
        endTime: endTime || reserve.endTime,
        _id: { $ne: reserveId },
        status: { $ne: 'cancelled' }
      });
      
      if (existingReserve) {
        return res.status(400).json({
          message: "Ya existe una reserva para esta sala en el horario seleccionado"
        });
      }
    }
    
    // Actualizar la reserva
    const updatedReserve = await MuscleRoomReserve.findByIdAndUpdate(
      reserveId,
      {
        date: date || reserve.date,
        startTime: startTime || reserve.startTime,
        endTime: endTime || reserve.endTime,
        numberOfPeople: numberOfPeople || reserve.numberOfPeople,
        notes: notes || reserve.notes,
        status: status || reserve.status
      },
      { new: true }
    ).populate('muscleRoom', 'name capacity');
    
    res.json({
      message: "Reserva actualizada exitosamente",
      reserve: updatedReserve
    });
    
  } catch (error) {
    console.error("Error al actualizar la reserva: ", error);
    res.status(500).json({ message: error.message });
  }
};

// Cancelar una reserva
export const cancelReserve = async (req, res) => {
  try {
    const { reserveId } = req.params;
    const userId = req.user.id;
    
    // Verificar si la reserva existe y pertenece al usuario
    const reserve = await MuscleRoomReserve.findOne({
      _id: reserveId,
      user: userId
    });
    
    if (!reserve) {
      return res.status(404).json({
        message: "Reserva no encontrada"
      });
    }
    
    // Actualizar el estado de la reserva a cancelada
    const updatedReserve = await MuscleRoomReserve.findByIdAndUpdate(
      reserveId,
      { status: 'cancelled' },
      { new: true }
    ).populate('muscleRoom', 'name capacity');
    
    res.json({
      message: "Reserva cancelada exitosamente",
      reserve: updatedReserve
    });
    
  } catch (error) {
    console.error("Error al cancelar la reserva: ", error);
    res.status(500).json({ message: error.message });
  }
}; 