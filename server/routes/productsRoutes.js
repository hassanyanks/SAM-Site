import express from 'express';
import Product from '../models/product.js';
import path from 'path';
import dotenv from 'dotenv';
import { products } from '../controllers/productsController.js';
import { product_details } from '../controllers/productDetailController.js';
 
var router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json()); 

router.get('/products', products );
router.get('/products/:_id', product_details );

export default router;
