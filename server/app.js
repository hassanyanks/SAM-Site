import express from 'express';
import bodyParser from 'body-parser';
//import userRouter from './routes/userRoutes.js'
//import productsRouter from './routes/productsRoutes.js';
import User from './models/user.js';
import { v4 as uuid } from 'uuid';
import session from 'express-session';
import FileStoreFactory from 'session-file-store';
import path from 'path';
import fs from 'fs';
import passport from 'passport';
import {SALT_ROUNDS} from './config/config.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { product_samples } from './controllers/productsController.js';
import { product_details } from './controllers/productDetailController.js';
import { login, signup } from './controllers/userControllers.js';
import { sendPasswordResetToken } from './lib/credentials.js';
import ProductSample from "./models/productsample.js";

dotenv.config({ path: './.env' }); 

const { Strategy: LocalStrategy } = await import('passport-local');

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

function clearSessions() {
    console.log('Deleting persistent sessions...');
    if (fs.existsSync(sessionDir)) {
        fs.rmSync(sessionDir, { recursive: true, force: true });
        console.log('Sessions deleted.');
    } else {
        console.log('Sessions directory not found, no cleanup needed.');
    }
    if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir, { recursive: true }); // recursive: true creates parent directories if they don't exist
    }
}

// Execute the cleanup function before initializing session middleware
//clearSessions();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//app.use(userRouter);
//app.use(productsRouter);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

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
    console.log('exiting app.use(session())')
));

app.use(function(req, res, next) {
    file_store.length(function(err, len) {
        if (err) {
            console.error("Error getting session length:", err);
            return next(err);
        }
        console.log("Total active session count is " + len);
        console.log("============");
    });
    return next();
});

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            console.log('User not found');
            return done(null, false, { message: 'User not found\n' });
        }

        const result = await bcrypt.compare(password, user.password);

        if (!result) {
            return done(null, false, { message: 'password mismatch!' });
        } else {
            console.log('Local strategy returned true');
            return done(null, user);
        }
    } catch (err) {
        // This catch block handles errors from Mongoose or Bcrypt
        return done(err);
    }
}));

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
console.log('Inside serializeUser callback. User id is save to the session file store here')
done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
console.log('Inside deserializeUser callback')
console.log(`The user id passport saved in the session file store is: ${id}`)
    const user = await User.findById(id).exec()
    .then((user, err) => {
        console.log(`user found is ${user.id}`);
        if(err) { return done(err); }
        if(!user) { return done(null, false); }
        done(null, user);
    });
});

app.use((req, res, next) => {
  // Assuming 'req.user' is set by an authentication middleware like Passport.js
  res.locals.user = req.user || null; 
  next();
});

app.get('/', (req, res) => {
    console.log('trying to serve up home');
    res.render('index');
} );

app.get('/login', (req, res) => {
    res.render('login');
} );

app.get('/signup', signup );

app.post('/signup', async (req, res, next) => {
    console.log('Inside POST /signup callback function');
    console.log(req.sessionID);
    try {
        console.log(`signing up with email ${req.body.email} and pswd ${req.body.password}`);
        const userPassword = req.body.password;

        // Ensure SALT_ROUNDS is defined globally or imported
        const hash = await bcrypt.hash(userPassword, SALT_ROUNDS);

        if (!hash) {
            // A hash should always be generated unless bcrypt fails in an unexpected way
            return res.status(500).json({ message: 'Unable to register you due to an error!!' });
        }

        // Ensure User model is defined globally or imported
        const newUser = new User({ email: req.body.email, password: hash });
        await newUser.save();

        console.log(`new user ${newUser} registered`);
        
        req.logIn(newUser, async function(err) {
            if (err) { return next(err); }
            console.log(`Authentication successful, current user is ${res.locals.user}, redirecting to /products`);
            return res.redirect('/products');
        });

    } catch (err) {
        console.error(`Error registering user: ${err}`);
        // If the error is a duplicate key (e.g., email already exists), send a specific error
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Email already in use.' });
        }
        // Pass other errors to the general error handler
        next(err);
    }
});

app.get('/login', login );

app.post('/login', (req, res, next) => {
    console.log(`email ${req.body.email}, pswd ${req.body.password}`)
    console.log('Inside POST /login callback');
    passport.authenticate('local', function(err, user, info) {
        console.log("Inside authenticate callback");
        if (err) { return next(err); }
        if (!user) { 
            console.log("Authentication failed:", info.message); 
            return res.status(401).send('<h2>Authentication seems to have failed.  Please click the browser back button and try again.</h2>');
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            req.user = user;
            console.log(`************************************************/login Authentication successful, user is ${res.locals.user}, redirecting to /products`);
            return res.redirect('/products');
        });
    })(req, res, next); // Crucial: You must call the returned function
});


app.post('/password-reset1', async (req, res) => {
    console.log(`in /password-reset1 POST, user email is ${JSON.stringify(req.body)}`)
    const result = sendPasswordResetToken(req.body.email);
    console.log(`returned from sendPasswordResetToken():  ${result}`);
      if (result === 404) { return res.status(404).send('User not found'); }
      res.send('<h2>Reset your password by following the link just sent to your email.  The token in the link will expire in one hour.</h2>')
});

app.get('/password-reset2', async (req, res) => {
    console.log(`inside /password-reset2, token is ${JSON.stringify(req.query)}`)
    const { token } = req.query;
    const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() } // Ensure token isn't expired
  });
  if (!user) return res.status(400).send('Token is invalid or has expired.');
  req.session.user = user;
  res.redirect(302,'/password-reset3'); 
 
});

app.get('/password-reset3', async (req, res) => {
    const user = req.session.user;
    console.log(`inside /update-password GET, user is ${user}`)
    res.render('reset_password', { user: user });
});


app.post('/update-password', async (req, res) => {
    console.log(`inside /update-password PUT, user email is ${req.body.email}, updated pswd is ${req.body.password}`)
    const user = await User.findOne({
        email: req.body.email
    });
    if (!user) return res.status(404).send('Could not find user.');
    const hash = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    console.log(`new password hash is ${hash}`);
    user.resetPasswordToken = '';
    user.resetPasswordExpires = '';
    user.password = hash;
    await user.save();
    res.redirect(302, '/login');
});

// The POST logout route
app.post('/logout',  async (req, res, next) => {
    console.log('inside /logout POST now');
    try {
        await new Promise((resolve, reject) => {
            req.logout((err) => {
                console.log('*******************************inside req.logout() now***************************************');
                if(err) { 
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        req.session.destroy(err => {
            if (err) {
                console.error('Logout error:', err);
                return res.status(500).send('Could not log out, please try again.');
            }
            // Successfully destroyed the session
            console.log(`*******************************session destroyed, user now is ${req.user}....redirecting now***************************************`);
            res.clearCookie('connect.sid');
            res.redirect(303, '/');
            // Or if you need to send a message:
            // res.status(200).send('Logged out successfully.');
        });
    } catch(err) {
        return next(err);
    }
});

app.get('/products', product_samples );
app.get('/products/:id', product_details );

export default app;