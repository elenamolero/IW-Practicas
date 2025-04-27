import GroupClass from "../models/groupClass.model.js";
import User from "../models/user.model.js";

export const createGroupClass = async (req, res) => {
  try {

    const {
      name,
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


    const classSchedule = new Date(schedule);


    if (isNaN(classSchedule.getTime())) {
      return res.status(400).json({
        message: "Scheadule not valid. Format: YYYY-MM-DDTHH:mm:ss."
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
    console.log("end date:", classEndTime);
    const existingClasses = await GroupClass.find({});
    const overlappingClass = existingClasses.find(existingClass => {
      const existingClassEndTime = new Date(existingClass.schedule.getTime() + 60 * 60 * 1000);

      return (
        (classSchedule < existingClassEndTime && classEndTime > existingClass.schedule) ||  
        (classSchedule >= existingClass.schedule && classSchedule < existingClassEndTime)  
      );
    });

    if (overlappingClass) {
      console.log("solapated class found:", overlappingClass);
      return res.status(400).json({
        message: "already exit a class with the same schedule.",
      });
    } else {
      console.log("class can be created.");
    }
    const newClass = new GroupClass({
      name,
      schedule: classSchedule,  // Guardamos la fecha ya convertida
      maxCapacity,
      assignedTrainer,
      difficultyLevel,
      attendees: attendees || []  // Si no hay asistentes, se asigna un arreglo vacío
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
