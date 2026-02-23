import multer from 'multer';
import path from 'path';

const __dirname = import.meta.dirname
const uploadsDir = path.join(__dirname, '../uploads');

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: function(req, file, cb) {
    // Generate a unique filename with the original extension
    cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload middleware
export const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Optional: Limit file size (e.g., 1MB)
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('document'); // 'document' is the name of the input field in the HTML form

// Check file type function (optional but recommended for security)
function checkFileType(file, cb) {
  // Allowed file extensions
  const filetypes = /jpeg|jpg|png|pdf/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    return cb(new Error('Error: Only images are allowed!'), true);
  }
}
