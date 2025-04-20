import GroupClass from "../models/groupClass.model.js";
import User from "../models/user.model.js";

export const createGroupClass = async (req, res) => {
  try {
    // Desestructurar los parámetros del cuerpo de la solicitud
    const {
      name,
      schedule,
      maxCapacity,
      assignedTrainer,
      difficultyLevel,
      attendees
    } = req.body;

    // Verificar que se haya enviado un nombre y un horario para la clase
    if (!name || !schedule) {
      return res.status(400).json({
        message: "El nombre y el horario de la clase son obligatorios."
      });
    }

    // Asegurarnos de que 'schedule' es una fecha válida
    const classSchedule = new Date(schedule);
    console.log("Fecha recibida (schedule):", schedule);
    console.log("Fecha de clase convertida:", classSchedule);

    // Comprobamos si la conversión fue exitosa
    if (isNaN(classSchedule.getTime())) {
      return res.status(400).json({
        message: "El horario de la clase no es válido. Formato esperado: YYYY-MM-DDTHH:mm:ss."
      });
    }

    // Verificar si el máximo de capacidad es un número válido
    if (maxCapacity && isNaN(maxCapacity)) {
      return res.status(400).json({
        message: "La capacidad máxima debe ser un número válido."
      });
    }

    // Verificar si el nivel de dificultad es válido
    const validDifficultyLevels = ['beginner', 'intermediate', 'advanced'];
    if (!validDifficultyLevels.includes(difficultyLevel)) {
      return res.status(400).json({
        message: "El nivel de dificultad debe ser uno de los siguientes: 'beginner', 'intermediate', 'advanced'."
      });
    }

    // Verificar si el entrenador asignado existe y es de tipo 'entrenador'
    const trainer = await User.findById(assignedTrainer);
    if (!trainer) {
      return res.status(404).json({ message: "Entrenador asignado no encontrado." });
    }

    if (trainer.role !== 'entrenador') {
      return res.status(400).json({ message: "El usuario asignado no es un entrenador." });
    }

    // Calcular la hora de finalización (una hora después del horario de la clase)
    const classEndTime = new Date(classSchedule.getTime() + 60 * 60 * 1000); // 1 hora
    console.log("Hora de finalización de la clase:", classEndTime);

    // Consultar todas las clases que ya están almacenadas
    const existingClasses = await GroupClass.find({});

    // Verificar si alguna de las clases existentes se solapa con la nueva
    const overlappingClass = existingClasses.find(existingClass => {
      const existingClassEndTime = new Date(existingClass.schedule.getTime() + 60 * 60 * 1000);

      // Verificamos si las clases se solapan
      return (
        (classSchedule < existingClassEndTime && classEndTime > existingClass.schedule) ||  // La nueva clase empieza antes de que termine la clase existente
        (classSchedule >= existingClass.schedule && classSchedule < existingClassEndTime)   // La nueva clase empieza dentro de la clase existente
      );
    });

    if (overlappingClass) {
      console.log("Clase solapada encontrada:", overlappingClass);
      return res.status(400).json({
        message: "Ya existe una clase en esa franja horaria. Las clases no pueden solaparse."
      });
    } else {
      console.log("No hay clase solapada, se puede crear la clase.");
    }

    // Crear la nueva clase grupal
    const newClass = new GroupClass({
      name,
      schedule: classSchedule,  // Guardamos la fecha ya convertida
      maxCapacity,
      assignedTrainer,
      difficultyLevel,
      attendees: attendees || []  // Si no hay asistentes, se asigna un arreglo vacío
    });

    // Guardar la clase en la base de datos
    const savedClass = await newClass.save();

    // Responder con éxito
    res.status(201).json({
      message: "Clase grupal creada con éxito.",
      class: savedClass
    });
  } catch (error) {
    // Manejo de errores
    console.error("Error en la creación de clase: ", error);
    res.status(500).json({ message: error.message });
  }
};
