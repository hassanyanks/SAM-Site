import express from 'express';
import Product from '../models/productsample.js';
import path from 'path';
import dotenv from 'dotenv';
import { product_samples } from '../controllers/productsController.js';
import { product_details } from '../controllers/productDetailController.js';
 
var router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json()); 

router.get('/products', product_samples );
router.get('/products/:id', product_details );

export default router;
