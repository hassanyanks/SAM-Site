import flash from 'connect-flash';
import express from 'express';

var router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json()); 

// Middleware to make flash messages available in all templates
/*
router.use(flash());
router.use((req, res, next) => {
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg = req.flash('error');
  next();
});
*/
export default router;
