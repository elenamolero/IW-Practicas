import WorkoutType from '../models/workoutType.model.js';
import User from "../models/user.model.js";

// Crear un nuevo tipo de workout
export const createWorkoutType = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    console.log("Título recibido:", title);
    console.log("Título normalizado:", title.trim());
    console.log("User ID:", userId);
    
    // const existingWorkoutType = await WorkoutType.findOne({
    //     title,
    //     user_id: userId
    //   });
      
    //   if (existingWorkoutType) {
    //     return res.status(400).json({
    //       message: "Ya existe un tipo de entrenamiento con este título"
    //     });
    //   }
    const existingWorkoutType = await WorkoutType.findOne({
      title: title.trim(), // opcionalmente normaliza el título
      user_id: userId
    });
    
    if (existingWorkoutType) {
      return res.status(200).json({
        message: "El tipo de entrenamiento ya existe",
        workoutType: existingWorkoutType
      });
    }
  
      const newWorkoutType = await WorkoutType.create({
        title,
        description,
        user_id: userId
      });
  
      res.status(201).json({
        message: "Tipo de entrenamiento creado exitosamente",
        workoutType: newWorkoutType
      });

  } catch (error) {
    res.status(500).json({
      message: "Error al crear el tipo de entrenamiento",
      error: error.message
    });
  }
};

// Obtener todos los tipos de workout de un usuario
export const getUserWorkoutTypes = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Verificar si el usuario existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    
    // Obtener todos los tipos de workout del usuario
    const workoutTypes = await WorkoutType.find({ user_id: userId })
      .sort({ title: 1 }); // Ordenar por título
    
    res.json({
      message: "Tipos de workout obtenidos exitosamente.",
      workoutTypes
    });
    
  } catch (error) {
    console.error("Error al obtener los tipos de workout: ", error);
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los tipos de workout
export const getAllWorkoutTypes = async (req, res) => {
  try {
    const userId = req.user.id;
    const workoutTypes = await WorkoutType.find({ user_id: userId });

    res.json(workoutTypes);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los tipos de entrenamiento",
      error: error.message
    });
  }
};

// Obtener un tipo de workout específico
export const getWorkoutTypeById = async (req, res) => {
  try {
    const { workoutTypeId } = req.params;
    const userId = req.user.id;

    const workoutType = await WorkoutType.findOne({
        _id: workoutTypeId,
        user_id: userId
      });
  
      if (!workoutType) {
        return res.status(404).json({
          message: "Tipo de entrenamiento no encontrado"
        });
      }
  
      res.json(workoutType);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el tipo de entrenamiento",
      error: error.message
    });
  }
};

// Actualizar un tipo de workout
export const updateWorkoutType = async (req, res) => {
  try {
    const { workoutTypeId } = req.params;
    const { title, description } = req.body;
    const userId = req.user.id;

    // Verificar si existe el tipo de workout
    const workoutType = await WorkoutType.findOne({
        _id: workoutTypeId,
        user_id: userId
      });
  
      if (!workoutType) {
        return res.status(404).json({
          message: "Tipo de entrenamiento no encontrado"
        });
      }
  
      // Comprobar si hay otro título igual
      if (title && title !== workoutType.title) {
        const existingWorkoutType = await WorkoutType.findOne({
          title,
          user_id: userId
        });
  
        if (existingWorkoutType) {
          return res.status(400).json({
            message: "Ya existe un tipo de entrenamiento con este título"
          });
        }
      }
  
      // Actualizar
      workoutType.title = title || workoutType.title;
      workoutType.description = description || workoutType.description;
      await workoutType.save();
  
      res.json({
        message: "Tipo de entrenamiento actualizado exitosamente",
        workoutType
      });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el tipo de entrenamiento",
      error: error.message
    });
  }
};

// Eliminar un tipo de workout
export const deleteWorkoutType = async (req, res) => {
  try {
    const { workoutTypeId } = req.params;
    const userId = req.user.id;

    const workoutType = await WorkoutType.findOneAndDelete({
        _id: workoutTypeId,
        user_id: userId
      });
  
      if (!workoutType) {
        return res.status(404).json({
          message: "Tipo de entrenamiento no encontrado"
        });
      }
  
      res.json({
        message: "Tipo de entrenamiento eliminado exitosamente"
      });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el tipo de entrenamiento",
      error: error.message
    });
  }
}; 