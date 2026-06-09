import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

// Ensure local uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Local Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File validation
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|webp|mp4|webm|pdf/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only images, videos, and PDFs are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max limit
});

// Cloudinary Configuration helper
const isCloudinaryConfigured = () => {
  return (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Helper to handle upload to Cloudinary or fallback to Local path
export const handleFileUpload = async (file) => {
  if (!file) return null;

  if (isCloudinaryConfigured()) {
    try {
      const resourceType = file.mimetype.startsWith('video')
        ? 'video'
        : file.mimetype === 'application/pdf'
        ? 'raw'
        : 'image';

      const response = await cloudinary.uploader.upload(file.path, {
        folder: 'digital_biodata',
        resource_type: resourceType,
      });

      // Remove local temp file
      fs.unlinkSync(file.path);
      return response.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error, falling back to local file path:', error.message);
      // Fallback: use local server URL
      return `/uploads/${path.basename(file.path)}`;
    }
  }

  // Fallback to local server path
  return `/uploads/${path.basename(file.path)}`;
};

export default upload;
