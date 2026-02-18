import express from 'express';
//import userRouter from './routes/userRoutes.js'
//import productsRouter from './routes/productsRoutes.js';
import User from './models/user.js';
import { v4 as uuid } from 'uuid';
import session from 'express-session';
import FileStoreFactory from 'session-file-store';
import path from 'path';
import fs from 'fs';
import passport from 'passport';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { product_samples } from './controllers/productsController.js';
import { product_details } from './controllers/productDetailController.js';
import  UserRouter from './routes/authRoutes.js'
import { login, signup } from './controllers/authControllers.js';
import ProductSample from "./models/productsample.js";

dotenv.config({ path: './.env' }); 

const __dirname = import.meta.dirname
const sessionDir = path.join(__dirname, 'sessions');

const FileStore = FileStoreFactory(session);
const fileStoreOptions = {
    path: sessionDir,
    ttl: 3600,
    fileExtension: '.json',
    reapInterval: 300,
    lifetime: 2400
};
const file_store = new FileStore(fileStoreOptions);

const app = express();
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

app.set('views', path.join(__dirname, 'views'));
//app.set('images', path.join(__dirname, 'images'));
//app.set('public', path.join(__dirname, 'public'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'lib')));

app.use(session({
  genid: (req) => {
    return uuid() // use UUIDs for session IDs
  },
    store: file_store,
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true, // Prevents client-side JS from reading the cookie
        maxAge: 1000 * 60 * 60 * 24 // Cookie expiration time (e.g., 1 day)
    }
},
    console.log('exiting router.use(session())')
));

app.get('/', (req, res) => {
    const user = req.query.user || null;
    console.log('trying to serve up home');
    res.render('index', { user: user });
} );

app.get('/login', (req, res) => {
    res.render('login');
} );

app.use(UserRouter);
//app.use(productsRouter);

export default app;