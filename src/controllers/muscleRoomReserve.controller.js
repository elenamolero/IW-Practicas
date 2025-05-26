import MuscleRoomReserve from "../models/muscleRoomReserve.model.js";
import MuscleRoom from "../models/muscleRoom.model.js";


export const countCurrentReservationsByRoom = async (req, res) => {
  try {
    const { muscleRoomId } = req.params; // ID de la sala de musculación
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;

    // Buscar reservas activas (que no estén canceladas) en la hora actual para la sala específica
    const count = await MuscleRoomReserve.countDocuments({
      muscleRoom: muscleRoomId,
      date: { $eq: currentDate.toISOString().split('T')[0] }, // Fecha actual
      startTime: { $lte: currentTime }, // Hora de inicio menor o igual a la hora actual
      endTime: { $gt: currentTime }, // Hora de fin mayor a la hora actual
      status: { $ne: 'cancelled' }, // Excluir reservas canceladas
    });

    res.json({
      muscleRoomId,
      currentTime,
      count,
    });
  } catch (error) {
    console.error("Error al contar las reservas actuales: ", error);
    res.status(500).json({ message: error.message });
  }
};

// Crear una nueva reserva de sala de musculación
export const createMuscleRoomReserve = async (req, res) => {
  try {
    const { muscleRoom, date, startTime, endTime, notes } = req.body;
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

    // Validar que la reserva no sea en el pasado y solo se pueda reservar con máximo 48h de antelación
    const now = new Date();
    const reserveDateTime = new Date(`${date}T${startTime}`);
    const diffMs = reserveDateTime - now;
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 0) {
      return res.status(400).json({
        message: "No se puede reservar en el pasado"
      });
    }
    if (diffHours > 48) {
      return res.status(400).json({
        message: "Solo se puede reservar con un máximo de 48 horas de antelación"
      });
    }

    // Verificar si ya hay una reserva activa en ese horario para esa sala
    const maxReservations = 200; 
    const currentReservations = await MuscleRoomReserve.countDocuments({
      muscleRoom,
      date,
      startTime: { $lte: endTime },
      endTime: { $gt: startTime },
      status: { $ne: 'cancelled' }
    });

    if (currentReservations >= maxReservations) {
      return res.status(400).json({
        message: "No hay plazas disponibles para esta sala y horario"
      });
    }

    // Verificar si el usuario ya tiene una reserva en el mismo horario
    const existingReserve = await MuscleRoomReserve.findOne({
      user: userId,
      date,
      startTime,
      endTime,
      status: { $ne: 'cancelled' }
    });

    if (existingReserve) {
      return res.status(400).json({
        message: "Ya tienes una reserva en este horario"
      });
    }

    // Crear la nueva reserva
    const newReserve = new MuscleRoomReserve({
      user: userId,
      muscleRoom,
      date,
      startTime,
      endTime,
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
    const { date, startTime, endTime, notes, status } = req.body;
    
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
    
    // Si se están actualizando fecha u hora, verificar disponibilidad
    if (date || startTime || endTime) {
      const existingReserve = await MuscleRoomReserve.findOne({
        user: userId,
        date: date || reserve.date,
        startTime: startTime || reserve.startTime,
        endTime: endTime || reserve.endTime,
        _id: { $ne: reserveId },
        status: { $ne: 'cancelled' }
      });
      
      if (existingReserve) {
        return res.status(400).json({
          message: "Ya tienes una reserva en este horario"
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

export const countCurrentGymReservations = async (req, res) => {
  try {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // Formato "HH:MM"
    const today = now.toISOString().split("T")[0];

    const count = await MuscleRoomReserve.countDocuments({
      date: today,
      startTime: { $lte: currentTime },
      endTime: { $gt: currentTime },
      status: { $ne: "cancelled" }
    });

    res.json({ count });
  } catch (error) {
    console.error("Error al contar el aforo actual del gimnasio:", error);
    res.status(500).json({ message: error.message });
  }
};
