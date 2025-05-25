import WorkoutType from '../models/workoutType.model.js';
import User from "../models/user.model.js";
import mongoose from "mongoose";

// Crear un nuevo tipo de workout
export const createWorkoutType = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    console.log("Título recibido:", title);
    console.log("Título normalizado:", title.trim());
    console.log("User ID:", userId);
    
     const existingWorkoutType = await WorkoutType.findOne({
         title: title.trim(),
         user_id: new mongoose.Types.ObjectId(userId)
       });

       if (existingWorkoutType) {
         return res.status(200).json({
           message: "Ya existe un tipo de entrenamiento con este título",
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
    const requesterRole = req.user.role;
    const memberUserId = req.query.userId;

    let workoutType;

    if (requesterRole === 'trainer') {
      // El entrenador accede al workoutType del socio
      workoutType = await WorkoutType.findOne({
        _id: workoutTypeId,
        user_id: memberUserId, // <-- usamos el ID pasado
      });
    } else {
      // El socio accede solo a los suyos
      workoutType = await WorkoutType.findOne({
        _id: workoutTypeId,
        user_id: req.user.id,
      });
    }

    if (!workoutType) {
      return res.status(404).json({ message: "Tipo de entrenamiento no encontrado" });
    }

    res.json(workoutType);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el tipo de entrenamiento",
      error: error.message,
    });
  }
};



// Actualizar un tipo de workout
export const updateWorkoutType = async (req, res) => {
  try {
    const { workoutTypeId } = req.params;
    const { title, description } = req.body;
    const role = req.user.role;
    const userIdParam = req.query.userId;

    let workoutType;

    if (role === 'trainer') {
      workoutType = await WorkoutType.findOne({
        _id: workoutTypeId,
        user_id: userIdParam
      });
    } else {
      workoutType = await WorkoutType.findOne({
        _id: workoutTypeId,
        user_id: req.user.id
      });
    }

    if (!workoutType) {
      return res.status(404).json({
        message: "No tienes permiso para modificar este tipo de entrenamiento o no existe"
      });
    }

    workoutType.title = title;
    workoutType.description = description;
    await workoutType.save();

    res.json({ message: "Tipo de entrenamiento actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el tipo de workout:", error);
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
    const role = req.user.role;
    const userId = role === "trainer" ? req.query.userId : req.user.id;

    const workoutType = await WorkoutType.findOneAndDelete({
      _id: workoutTypeId,
      user_id: userId
    });

    if (!workoutType) {
      return res.status(404).json({
        message: "Tipo de entrenamiento no encontrado o no tienes permiso para eliminarlo"
      });
    }

    res.json({
      message: "Tipo de entrenamiento eliminado exitosamente"
    });
  } catch (error) {
    console.error("Error al eliminar el tipo de entrenamiento:", error);
    res.status(500).json({
      message: "Error al eliminar el tipo de entrenamiento",
      error: error.message
    });
  }
};
