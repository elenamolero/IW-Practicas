import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export const authRequired = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "No token, autorización denegada" });
  }

  jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido" });
    }

    req.user = decoded;

    // Renovar la cookie para extender la sesión por inactividad
    const newToken = jwt.sign({ id: decoded.id, role: decoded.role }, TOKEN_SECRET, { expiresIn: '5m' });
    res.cookie('token', newToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge:  5* 60 * 1000 
    });

    next();
  });
};
