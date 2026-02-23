import express from 'express';
import session from 'express-session';
import { upload_form } from '../controllers/commonControllers.js';
import { home } from '../controllers/authControllers.js';
import path from 'path';
import { upload } from '../lib/fileUpload.js';
import flash from 'connect-flash';

const __dirname = import.meta.dirname

var router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json()); 

router.use(session({
  secret: 'yourSecretKey', // Replace with a real secret key
  resave: false,
  saveUninitialized: true
}));


/*
router.post('/upload', (req, res) => {
  //delete req.session.flash;
  upload(req, res, (err) => {
  console.log(`****************************upload done`)
    if (err) {
        req.flash('error_msg', err);
        res.redirect('/');
    } else {
      if (req.file == undefined) {
        req.flash('error', 'Upload failed.');
        console.log(`****************************post upload, file undefined`)
        res.redirect('/');
      } else {
        console.log(`****************************post upload, success`)
        req.flash('success', 'File uploaded successfully!')
        res.redirect( '/' );
      }
    }
  });
});
*/
export default router;