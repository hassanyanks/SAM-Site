import express from 'express';
import { v4 as uuid } from 'uuid';
import session from 'express-session';
//import FileStoreFactory from 'session-file-store';
import path from 'path';
import url from 'url';
import passport from 'passport';
import dotenv from 'dotenv';
import flash from 'connect-flash';
import helmet from 'helmet';
import { RedisStore } from 'connect-redis';
import authRouter from './routes/authRoutes.js';
import productsRouter from './routes/productsRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import passportConfig from './init/passport.js';
import bcrypt from 'bcrypt';
///import { upload_form } from './controllers/commonControllers.js';
import Cart from './models/cart.js';
import User from './models/user.js';
import { initMongoDB } from './init/mongodb.js';
import { RedisClient } from './init/redis.js';
import { startHttpsServer } from './init/httpsServer.js';

dotenv.config({ path: './.env' }); 

const __dirname = import.meta.dirname
const sessionDir = path.join(__dirname, 'sessions');

const app = express();
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'lib')));
app.use(express.static(path.join(__dirname, 'scripts')));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      connectSrc: ["'self'", "https://localhost"], // Add necessary APIs here
    },
  },
}));

export const redisClient = new RedisClient();

try {
    const [mongoDbInstance, redisStatus] = await Promise.all([initMongoDB(), redisClient.startRedis()]);
    console.log(`promise all result:  ${mongoDbInstance}, ${redisStatus}`)
    if( mongoDbInstance === 'sams-db' && redisStatus === 'connected') {
      startHttpsServer();
    } else {
      console.error(`Not starting HTTPS server: mongodb connection: ${mongoDbInstance}, Redis status: ${redisStatus}`);
    }
} catch (error) {
    console.error('Failed to start HTTPS server:', error);
}

app.use(session({
  genid: (req) => {
    return uuid() // use UUIDs for session IDs
  },
    store: new RedisStore({ client: redisClient.client }),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: true, //process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true, // Prevents client-side JS from reading the cookie
        maxAge: 1000 * 60 * 60 * 24 // Cookie expiration time (e.g., 1 day)
    },
},));

//app.set('view cache', false);
console.log('initializing routers...');
app.use(uploadRouter);
app.use(authRouter);
app.use(productsRouter);
app.use(cartRouter);

/*
app.use((req, res, next) => {
    if( req.isAuthenticated() ) {
        res.locals.user, req.user = req.session.passport.user; 
        console.log(`*************************************req.isAuthenticated():  res.locals.user now is ${JSON.stringify(req.session.passport.user)}*********************************************`)
    } else {
        res.locals.user = null;
    }
  next();
});
*/

app.get('/', (req, res) => {
    res.render('index', { user: req.user });
});

app.get('/index', (req, res ) => {
    res.render('index', { user: req.user });
});

export default app;