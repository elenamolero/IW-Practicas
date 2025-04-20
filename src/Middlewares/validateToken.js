import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export const authRequired = (req, res, next) => {
  const { token } = req.cookies;

  if (!token)
    return res.status(401).json({
      message: "No token, autorización denegada"
    });

  jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "Token inválido" });

    // decoded = { id, role } si lo hiciste bien al generar el token
    req.user = decoded;

    next();
  });
};
