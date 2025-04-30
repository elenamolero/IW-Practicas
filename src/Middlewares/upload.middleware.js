import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../../cloudinary.js';

// Configuración de almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    allowed_formats: ['jpg', 'png', 'jpeg'], // Formatos permitidos
  },
});

const upload = multer({ storage });

export default upload;