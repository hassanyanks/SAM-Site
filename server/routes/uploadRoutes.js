import express from 'express';
//import { uploadFile } from '../lib/fileUpload.js';
import flash from 'connect-flash';
import multer from 'multer';
import path from 'path';

const __dirname = import.meta.dirname
const uploadsDir = path.join(__dirname, '../uploads');

console.log('initializing uploade router...');

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

var router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json()); 
router.use(flash());

router.get('/upload', (req, res, next) => {
    res.render('upload', { user: req.user });
});

router.post('/upload', (req, res) => {
    req.flash('success');
    req.flash('error');

    upload(req, res, function(err) {
        if(err) {
            req.flash('error', err.message);
        }
        else if (!req.file) {
            req.flash('error', 'Error: No File Selected!');
        } else {
            req.flash('success', 'File Uploaded Successfully!');
        }
        req.session.save(err => { // This to persist flash msgs
            if (err) {
            return next(err); // Handle errors
            }
            res.redirect(303, '/uploaded'); // this redirect is handled in authRoutes.js
        });
    });
});

console.log('exporting upload router...');

export default router;