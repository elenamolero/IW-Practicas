import Workout from "../models/workout.model.js";
import WorkoutType from "../models/workoutType.model.js";
import User from "../models/user.model.js";

export const createWorkout = async (req, res) => {
  try {
    const {
      workoutTypeId,
      date,
      series,
      repetitions,
      rest,
      order,
      intensity,
      weight
      
    } = req.body;


    
    const userId = req.user.id;
    
    if (!workoutTypeId || !date || !series || !repetitions || !rest || !order || !intensity) {
      return res.status(400).json({
        message: "Todos los campos obligatorios deben estar completos."
      });
    }

    
    const workoutDate = new Date(date);
    console.log("Fecha recibida (date):", date);
    console.log("Fecha de workout convertida:", workoutDate);

    if (isNaN(workoutDate.getTime())) {
      return res.status(400).json({
        message: "La fecha del workout no es válida. Formato esperado: YYYY-MM-DDTHH:mm:ss."
      });
    }
    
    // Verificar si el usuario existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    
    // Verificar si el tipo de workout existe
    const workoutType = await WorkoutType.findById(workoutTypeId);
    if (!workoutType) {
      return res.status(404).json({ message: "Tipo de workout no encontrado." });
    }
    
    // Verificar que el tipo de workout pertenezca al usuario
  if (user.role !== "trainer" && workoutType.user_id.toString() !== userId) {
  return res.status(403).json({ 
    message: "No tienes permiso para crear un workout con este tipo de workout." 
  });
}
    
    const intensityScale = { min: 1, max: 10 };
    if (intensity < intensityScale.min || intensity > intensityScale.max) {
      return res.status(400).json({
        message: `La intensidad debe estar entre ${intensityScale.min} y ${intensityScale.max}.`
      });
    }
    
    // Verificar si ya existe un workout con la misma fecha y orden
    const existingWorkout = await Workout.findOne({ 
      date: workoutDate, 
      order,
      user_id: userId
    });
    
    if (existingWorkout) {
      return res.status(400).json({
        message: "Ya existe un workout con la misma fecha y orden para este usuario."
      });
    }
    
    if (user.role !== "member" && user.role !== "trainer") {
  return res.status(400).json({
    message: "Solo los usuarios con rol 'member' o 'trainer' pueden crear workouts."
  });
}
    
    // Crear el nuevo workout
    const newWorkout = new Workout({
      workoutType_id: workoutTypeId,
      user_id: userId,
      date: workoutDate, // Guardar la fecha ya convertida
      series,
      repetitions,
      rest,
      order,
      intensity,
      weight
    });
    
    // Guardar el workout
    const savedWorkout = await newWorkout.save();
    
    res.status(201).json({
      message: "Workout creado exitosamente.",
      workout: savedWorkout
    });

  } catch (error) {
    console.error("Error al crear el workout: ", error);
    res.status(500).json({ 
      message: "Error al crear el workout",
      error: error.message 
    });
  }
};

//Obtener todos los workout de una fecha especifica
export const getUserWorkoutsByDate = async (req, res) => {
  try {
    const userId = req.query.userId || req.user.id;
    const { date } = req.params; // Fecha proporcionada en la URL (YYYY-MM-DD)

    if (!date) {
      return res.status(400).json({
        message: "La fecha es requerida en el formato YYYY-MM-DD.",
      });
    }

    // Convertir la fecha proporcionada a un rango de inicio y fin del día
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Obtener los workouts del usuario en el rango de la fecha especificada
    const workouts = await Workout.find({
      user_id: userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate("workoutType_id", "title description")
      .sort({ date: -1, order: 1 });

    res.json({
      message: "Workouts obtenidos exitosamente.",
      workouts,
    });
  } catch (error) {
    console.error("Error al obtener los workouts: ", error);
    res.status(500).json({
      message: "Error al obtener los workouts",
      error: error.message,
    });
  }
};

// Obtener todos los workouts de un usuario
export const getUserWorkouts = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Obtener todos los workouts del usuario
    const workouts = await Workout.find({ user_id: userId })
    .populate('workoutType_id', 'title description')
    .sort({ date: -1, order: 1 });

    
    res.json({
      message: "Workouts obtenidos exitosamente.",
      workouts
    });
    
  } catch (error) {
    console.error("Error al obtener los workouts: ", error);
    res.status(500).json({ 
      message: "Error al obtener los workouts",
      error: error.message 
    });
  }
};

// Obtener un workout específico
export const getWorkoutById = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const requesterRole = req.user.role;

    let workout;

    if (requesterRole === 'trainer') {
      // El entrenador puede ver cualquier workout
      workout = await Workout.findById(workoutId).populate('workoutType_id', 'title description');
    } else {
      // El miembro solo puede ver sus propios workouts
      workout = await Workout.findOne({
        _id: workoutId,
        user_id: req.user.id,
      }).populate('workoutType_id', 'title description');
    }

    if (!workout) {
      return res.status(404).json({
        message: "Workout no encontrado o no tienes permiso para verlo.",
      });
    }

    res.json({
      message: "Workout obtenido exitosamente.",
      workout,
    });

  } catch (error) {
    console.error("Error al obtener el workout: ", error);
    res.status(500).json({
      message: "Error al obtener el workout",
      error: error.message,
    });
  }
};


// Actualizar un workout
export const updateWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const role = req.user.role;
    const userId = role === 'trainer' ? req.query.userId : req.user.id;

    const {
      workoutTypeId,
      date,
      series,
      repetitions,
      rest,
      order,
      intensity,
      weight
    } = req.body;

    // Verificar si el workout existe y pertenece al usuario
    const workout = await Workout.findOne({ 
      _id: workoutId,
      user_id: userId
    });

    if (!workout) {
      return res.status(404).json({
        message: "Workout no encontrado o no tienes permiso para actualizarlo."
      });
    }

    // Verificar si el tipo de workout es válido y pertenece al usuario
    if (workoutTypeId && workoutTypeId !== workout.workoutType_id.toString()) {
      const workoutType = await WorkoutType.findById(workoutTypeId);
      if (!workoutType) {
        return res.status(404).json({ message: "Tipo de workout no encontrado." });
      }

      if (workoutType.user_id.toString() !== userId) {
        return res.status(403).json({ 
          message: "No tienes permiso para usar este tipo de workout." 
        });
      }
    }

    // Validar fecha
    let workoutDate = workout.date;
    if (date) {
      workoutDate = new Date(date);
      if (isNaN(workoutDate.getTime())) {
        return res.status(400).json({
          message: "La fecha del workout no es válida. Formato esperado: YYYY-MM-DD."
        });
      }
    }

    // Validar intensidad
    if (intensity) {
      const intensityScale = { min: 1, max: 10 };
      if (intensity < intensityScale.min || intensity > intensityScale.max) {
        return res.status(400).json({
          message: `La intensidad debe estar entre ${intensityScale.min} y ${intensityScale.max}.`
        });
      }
    }

    // Validar conflicto de fecha y orden
    if ((date || order) && (date !== workout.date || order !== workout.order)) {
      const existingWorkout = await Workout.findOne({ 
        date: workoutDate, 
        order: order || workout.order,
        user_id: userId,
        _id: { $ne: workoutId }
      });

      if (existingWorkout) {
        return res.status(400).json({
          message: "Ya existe un workout con la misma fecha y orden para este usuario."
        });
      }
    }

    // Actualizar el workout
    workout.workoutType_id = workoutTypeId || workout.workoutType_id;
    workout.date = workoutDate;
    workout.series = series || workout.series;
    workout.repetitions = repetitions || workout.repetitions;
    workout.rest = rest || workout.rest;
    workout.order = order || workout.order;
    workout.intensity = intensity || workout.intensity;
    workout.weight = weight || workout.weight;

    await workout.save();

    res.json({
      message: "Workout actualizado exitosamente.",
      workout
    });

  } catch (error) {
    console.error("Error al actualizar el workout: ", error);
    res.status(500).json({ 
      message: "Error al actualizar el workout",
      error: error.message 
    });
  }
};


// Eliminar un workout
export const deleteWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const role = req.user.role;
    const userId = role === "trainer" ? req.query.userId : req.user.id;

    const workout = await Workout.findOne({
      _id: workoutId,
      user_id: userId
    });

    if (!workout) {
      return res.status(404).json({
        message: "Workout no encontrado o no tienes permiso para eliminarlo."
      });
    }

    await Workout.findByIdAndDelete(workoutId);

    res.json({
      message: "Workout eliminado exitosamente."
    });

  } catch (error) {
    console.error("Error al eliminar el workout: ", error);
    res.status(500).json({
      message: "Error al eliminar el workout",
      error: error.message
    });
  }
};
