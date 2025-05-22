import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

// delete user
export const deleteUser = async (req, res) => {
  try {
    const { email } = req.params;

    const userFound = await User.findOneAndDelete({ email });

    if (!userFound) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: `Usuario con email ${email} eliminado correctamente.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//getuser by email
export const getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phone: user.phone,
      photo: user.photo,
      bankAccount: user.bankAccount,
      weight: user.weight,
      height: user.height,
      classesCanTeach: user.classesCanTeach,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//modificar user
export const updateUser = async (req, res) => {
  try {
    const { email, _id, id, ...updateData } = req.body;

    if (!email) return res.status(400).json({ message: "Se requiere el email para identificar al usuario" });

    // Buscar al usuario por su email
    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(404).json({ message: "Usuario no encontrado" });

    // Actualizar datos (sin modificar email ni id)
    const userUpdated = await User.findByIdAndUpdate(userFound._id, updateData, {
      new: true,
      runValidators: true
    });

    res.json({
      id: userUpdated._id,
      email: userUpdated.email,
      firstName: userUpdated.firstName,
      lastName: userUpdated.lastName,
      role: userUpdated.role,
      phone: userUpdated.phone,
      photo: userUpdated.photo,
      bankAccount: userUpdated.bankAccount,
      weight: userUpdated.weight,
      height: userUpdated.height,
      classesCanTeach: userUpdated.classesCanTeach,
      createdAt: userUpdated.createdAt,
      updatedAt: userUpdated.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// REGISTRO


export const register = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      role,
      bankAccount,
      weight,
      height,
      classesCanTeach,
      photo, // Aceptar la URL de la foto desde el cuerpo
    } = req.body;

    const userFound = await User.findOne({ email });
    if (userFound) return res.status(400).json(['El email ya está en uso']);

    // Subir la foto si se envía como archivo
    let photoUrl = photo || null; // Usar la URL del cuerpo si no se sube un archivo
    if (req.file) {
      photoUrl = req.file.path; // URL de la foto subida a Cloudinary
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: passwordHash,
      firstName,
      lastName,
      phone,
      photo: photoUrl, // Guardar la URL de la foto
      role,
      bankAccount: role === 'member' ? bankAccount : undefined,
      weight: role === 'member' ? weight : undefined,
      height: role === 'member' ? height : undefined,
      classesCanTeach: role === 'trainer' ? classesCanTeach : undefined,
    });

    const userSaved = await newUser.save();
    const token = await createAccessToken({ id: userSaved._id, role: userSaved.role });

    res.cookie('token', token, { httpOnly: true });
    res.json({
      id: userSaved._id,
      email: userSaved.email,
      firstName: userSaved.firstName,
      lastName: userSaved.lastName,
      role: userSaved.role,
      photo: userSaved.photo, // URL de la foto
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

    const token = await createAccessToken({ id: userFound._id, role: userFound.role });


    res.cookie('token', token, { httpOnly: true });
    res.json({
      id: userFound._id,
      email: userFound.email,
      firstName: userFound.firstName,
      lastName: userFound.lastName,
      role: userFound.role,
        phone: userFound.phone,
        photo: userFound.photo,
        bankAccount: userFound.bankAccount,
        weight: userFound.weight,
        height: userFound.height,
        classesCanTeach: userFound.classesCanTeach,

      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,

    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGOUT
export const logout = (req, res) => {
  res.cookie('token', "", {
    expires: new Date(0)
  });
  return res.sendStatus(200);
};

// PROFILE
export const profile = async (req, res) => {
  try {
    const userFound = await User.findById(req.user.id);
    if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" });

    return res.json({
      id: userFound._id,
      email: userFound.email,
      firstName: userFound.firstName,
      lastName: userFound.lastName,
      role: userFound.role,
      phone: userFound.phone,
      photo: userFound.photo,
      bankAccount: userFound.bankAccount,
      weight: userFound.weight,
      height: userFound.height,
      classesCanTeach: userFound.classesCanTeach,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// VERIFY TOKEN
export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "Token inválido o expirado" });

    const userFound = await User.findById(user.id);
    if (!userFound) return res.status(401).json({ message: "Usuario no encontrado" });

    return res.json({
      id: userFound._id,
      email: userFound.email,
      firstName: userFound.firstName,
      lastName: userFound.lastName,
      role: userFound.role
    });
  });
};

// Obtener todos los usuarios con rol 'member'
export const getAllMembers = async (req, res) => {
  try {
    const members = await User.find({ role: 'member' }).select(
      'email firstName lastName photo'
    );

    res.json(members);
  } catch (error) {
    console.error("Error al obtener los usuarios con rol 'member':", error);
    res.status(500).json({ message: error.message });
  }
};
