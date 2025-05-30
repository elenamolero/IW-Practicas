import GroupClass from "../models/groupClass.model.js";
import User from "../models/user.model.js";

export const createGroupClass = async (req, res) => {
  try {
    const {
      name,
      description,
      schedule,
      maxCapacity,
      assignedTrainer,
      difficultyLevel,
      attendees
    } = req.body;

    if (!name || !schedule) {
      return res.status(400).json({
        message: "Name and scheadule are a must."
      });
    }

    // Ajuste: tratar el string de schedule como local y convertirlo a UTC
    // Esto asegura que la hora guardada sea la que el usuario seleccionó en su zona local
    const [datePart, timePart] = schedule.split("T");
    const [year, month, day] = datePart.split("-");
    const [hour, minute] = timePart.split(":");
    const classSchedule = new Date(
      Date.UTC(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute)
      )
    );

    if (isNaN(classSchedule.getTime())) {
      return res.status(400).json({
        message: "Scheadule not valid. Format: YYYY-MM-DDTHH:mm."
      });
    }
    if (maxCapacity && isNaN(maxCapacity)) {
      return res.status(400).json({
        message: "Capacity must be a valid number."
      });
    }

    const validDifficultyLevels = ['beginner', 'intermediate', 'advanced'];
    if (!validDifficultyLevels.includes(difficultyLevel)) {
      return res.status(400).json({
        message: "The level must be one of these ones: 'beginner', 'intermediate', 'advanced'."
      });
    }

    const trainer = await User.findById(assignedTrainer);
    if (!trainer) {
      return res.status(404).json({ message: "trainer asigned not found." });
    }

    if (trainer.role !== 'trainer') {
      return res.status(400).json({ message: "User asigned is not a trainer." });
    }
    const classEndTime = new Date(classSchedule.getTime() + 60 * 60 * 1000); // 1 hora
    const existingClasses = await GroupClass.find({});
    const overlappingClass = existingClasses.find(existingClass => {
      const existingClassEndTime = new Date(existingClass.schedule.getTime() + 60 * 60 * 1000);

      return (
        (classSchedule < existingClassEndTime && classEndTime > existingClass.schedule) ||
        (classSchedule >= existingClass.schedule && classSchedule < existingClassEndTime)
      );
    });

    if (overlappingClass) {
      return res.status(400).json({
        message: "already exit a class with the same schedule.",
      });
    }

    const newClass = new GroupClass({
      name,
      description,
      schedule: classSchedule,  // Guardamos la fecha ya convertida
      maxCapacity,
      assignedTrainer,
      difficultyLevel,
      attendees: attendees || []
    });
    const savedClass = await newClass.save();
    res.status(201).json({
      message: "Class created successfully.",
      class: savedClass
    });
  } catch (error) {
    console.error("Error in the class creation: ", error);
    res.status(500).json({ message: error.message });
  }
};
export const cancelGroupClass = async (req, res) => {
  try {
    const { classId } = req.params;

    // Verificar si la clase existe
    const groupClass = await GroupClass.findById(classId);
    if (!groupClass) {
      return res.status(404).json({
        message: "Clase grupal no encontrada"
      });
    }

    // Verificar si el usuario que intenta cancelar es el entrenador asignado
    if (groupClass.assignedTrainer.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Solo el entrenador asignado puede cancelar la clase"
      });
    }

    // Verificar si la clase ya ha pasado
    const now = new Date();
    if (groupClass.schedule < now) {
      return res.status(400).json({
        message: "No se puede cancelar una clase que ya ha pasado"
      });
    }

    // Eliminar la clase
    await GroupClass.findByIdAndDelete(classId);

    res.json({
      message: "Clase grupal cancelada exitosamente"
    });

  } catch (error) {
    console.error("Error al cancelar la clase: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateGroupClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const {
      name,
      description,
      schedule,
      maxCapacity,
      difficultyLevel,
      attendees
    } = req.body;

    // Verificar si la clase existe
    const groupClass = await GroupClass.findById(classId);
    if (!groupClass) {
      return res.status(404).json({
        message: "Clase grupal no encontrada"
      });
    }

    // Verificar si el usuario que intenta modificar es el entrenador asignado
    if (groupClass.assignedTrainer.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Solo el entrenador asignado puede modificar la clase"
      });
    }

    // Verificar si la clase ya ha pasado
    const now = new Date();
    if (groupClass.schedule < now) {
      return res.status(400).json({
        message: "No se puede modificar una clase que ya ha pasado"
      });
    }

    // Validar la fecha si se proporciona
    if (schedule) {
      const classSchedule = new Date(schedule);
      if (isNaN(classSchedule.getTime())) {
        return res.status(400).json({
          message: "El horario no es válido. Formato esperado: YYYY-MM-DDTHH:mm:ss"
        });
      }

      // Verificar solapamiento con otras clases
      const classEndTime = new Date(classSchedule.getTime() + 60 * 60 * 1000);
      const existingClasses = await GroupClass.find({
        _id: { $ne: classId } // Excluir la clase actual
      });

      const overlappingClass = existingClasses.find(existingClass => {
        const existingClassEndTime = new Date(existingClass.schedule.getTime() + 60 * 60 * 1000);
        return (
          (classSchedule < existingClassEndTime && classEndTime > existingClass.schedule) ||
          (classSchedule >= existingClass.schedule && classSchedule < existingClassEndTime)
        );
      });

      if (overlappingClass) {
        return res.status(400).json({
          message: "Ya existe una clase en esa franja horaria"
        });
      }
    }

    // Validar el nivel de dificultad si se proporciona
    if (difficultyLevel) {
      const validDifficultyLevels = ['beginner', 'intermediate', 'advanced'];
      if (!validDifficultyLevels.includes(difficultyLevel)) {
        return res.status(400).json({
          message: "El nivel de dificultad debe ser uno de los siguientes: 'beginner', 'intermediate', 'advanced'"
        });
      }
    }

    // Validar la capacidad máxima si se proporciona
    if (maxCapacity && isNaN(maxCapacity)) {
      return res.status(400).json({
        message: "La capacidad máxima debe ser un número válido"
      });
    }

    // Actualizar la clase
    const updatedClass = await GroupClass.findByIdAndUpdate(
      classId,
      {
        name: name || groupClass.name,
        description: description || groupClass.description,
        schedule: schedule ? new Date(schedule) : groupClass.schedule,
        maxCapacity: maxCapacity || groupClass.maxCapacity,
        difficultyLevel: difficultyLevel || groupClass.difficultyLevel,
        attendees: attendees || groupClass.attendees
      },
      { new: true }
    );

    res.json({
      message: "Clase grupal actualizada exitosamente",
      class: updatedClass
    });

  } catch (error) {
    console.error("Error al modificar la clase: ", error);
    res.status(500).json({ message: error.message });
  }
};


export const getGroupClassDetails = async (req, res) => {
  try {
    const { classId } = req.params;

    // Buscar la clase por su ID
    const groupClass = await GroupClass.findById(classId)
      .populate('assignedTrainer', 'name email') // opcional: incluir nombre y email del entrenador
      .populate('attendees', 'name email'); // opcional: incluir nombre y email de los asistentes

    if (!groupClass) {
      return res.status(404).json({
        message: "Clase grupal no encontrada"
      });
    }

    res.json({
      message: "Detalles de la clase grupal",
      class: groupClass
    });

  } catch (error) {
    console.error("Error al obtener detalles de la clase: ", error);
    res.status(500).json({ message: error.message });
  }
};


export const reserveGroupClass = async (req, res) => {
  try {
    const { classId } = req.params; // ID de la clase grupal

    // Buscar la clase
    const groupClass = await GroupClass.findById(classId);
    if (!groupClass) {
      return res.status(404).json({ message: "Clase grupal no encontrada" });
    }

    // Verificar si la clase ya pasó
    const now = new Date();
    if (groupClass.schedule < now) {
      return res.status(400).json({ message: "No se puede reservar una clase que ya ha pasado" });
    }

    // Verificar si ya está inscrito
    if (groupClass.attendees.includes(req.user.id)) {
      return res.status(400).json({ message: "Ya estás inscrito en esta clase" });
    }

    // Verificar si hay espacio disponible
    if (groupClass.attendees.length >= groupClass.maxCapacity) {
      return res.status(400).json({ message: "La clase ya está completa" });
    }

    // Añadir al usuario a la lista de asistentes
    groupClass.attendees.push(req.user.id);
    await groupClass.save();

    res.status(200).json({ message: "Reserva realizada con éxito", class: groupClass });
  } catch (error) {
    console.error("Error al reservar clase grupal: ", error);
    res.status(500).json({ message: error.message });
  }
};


export const deleteGroupClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const groupClass = await GroupClass.findById(classId);
    if (!groupClass) {
      return res.status(404).json({ message: "Clase grupal no encontrada" });
    }

    // Opcional: Si quieres que solo Admins puedan eliminar directamente, aquí podrías meter un check extra de rol.

    await GroupClass.findByIdAndDelete(classId);

    res.status(200).json({ message: "Clase grupal eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la clase grupal: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const getGroupClassSchedule = async (req, res) => {
  try {
    const { date } = req.query; // opcional: filtrar por fecha específica YYYY-MM-DD

    let filter = {};
    if (date) {
      const dayStart = new Date(date);
      const dayEnd = new Date(date);
      dayEnd.setDate(dayEnd.getDate() + 1);

      filter.schedule = { $gte: dayStart, $lt: dayEnd };
    }

    const classes = await GroupClass.find(filter)
      .populate('assignedTrainer', 'name') // incluir nombre del entrenador
      .sort({ schedule: 1 });

    res.json({
      message: "Horario de clases encontrado",
      classes
    });
  } catch (error) {
    console.error("Error al obtener el horario:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getGroupClassesByDate = async (req, res) => {
  try {
    const { date } = req.params; 

    if (!date) {
      return res.status(400).json({
        message: "La fecha es requerida en el formato YYYY-MM-DD.",
      });
    }

    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const classes = await GroupClass.find({
      schedule: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate("assignedTrainer", "firstName")
      .populate("attendees", "firstName")
      .sort({ schedule: 1 });

    res.json({
      message: "Clases grupales obtenidas exitosamente.",
      classes,
    });
  } catch (error) {
    console.error("Error al obtener las clases grupales: ", error);
    res.status(500).json({
      message: "Error al obtener las clases grupales",
      error: error.message,
    });
  }
};

export const cancelGroupClassReservation = async (req, res) => {
  try {
    const { classId } = req.params;

    // Buscar la clase
    const groupClass = await GroupClass.findById(classId);
    if (!groupClass) {
      return res.status(404).json({ message: "Clase grupal no encontrada" });
    }

    // Verificar si el usuario está en la lista de asistentes
    const userIndex = groupClass.attendees.findIndex(
      attendee => attendee.toString() === req.user.id
    );
    if (userIndex === -1) {
      return res.status(400).json({ message: "No estás inscrito en esta clase" });
    }

    // Eliminar al usuario de la lista de asistentes
    groupClass.attendees.splice(userIndex, 1);
    await groupClass.save();

    res.status(200).json({ message: "Reserva cancelada con éxito", class: groupClass });
  } catch (error) {
    console.error("Error al cancelar la reserva: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyUpcomingGroupClasses = async (req, res) => {
  try {
    const now = new Date();

    const classes = await GroupClass.find({
      attendees: req.user.id,
      schedule: { $gte: now }
    })
    .populate("assignedTrainer", "firstName")
    .sort({ schedule: 1 });

    res.json({ classes });
  } catch (error) {
    console.error("Error al obtener las próximas clases del usuario:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyUpcomingTrainerClasses = async (req, res) => {
  try {
    const now = new Date();

    const classes = await GroupClass.find({
      assignedTrainer: req.user.id,
      schedule: { $gte: now }
    })
      .populate("attendees", "firstName email") // opcional, puedes quitarlo si no necesitas mostrar asistentes
      .sort({ schedule: 1 });

    res.json({
      message: "Próximas clases asignadas como entrenador obtenidas correctamente.",
      classes
    });
  } catch (error) {
    console.error("Error al obtener las clases como entrenador:", error);
    res.status(500).json({ message: error.message });
  }
};