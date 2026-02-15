/*
import express from 'express';
import { v4 as uuid } from 'uuid';
import User from '../models/user.js';
import {SALT_ROUNDS} from '../config/config.js';
import bcrypt from 'bcrypt';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
import { login, signup } from '../controllers/userControllers.js';
import passport from 'passport';

const { Strategy: LocalStrategy } = await import('passport-local');
const FileStore = sessionFileStore(session);
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json()); 
router.use(session({
  genid: (req) => {
    console.log('userRouter.use():  Inside the session middleware')
    console.log(req.sessionID)
    return uuid() // use UUIDs for session IDs
  },
  store: new FileStore(),
    secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
*/
/*
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

router.use(passport.initialize());
router.use(passport.session());
*/
/*
router.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
})

router.use((req, res, next) => {
    console.log(`********************************Incoming request method: ${req.method}, URL: ${req.url}*********************************************`)
});
*/

/*
router.post('/logout', function(req, res, next) {
    console.log('*******************************inside /logout POST now****************************************');
  req.logout(function(err) {
    req.user = null;
    console.log('*******************************inside req.logout() now***************************************');
    if (err) { return next(err); }
    console.log(`user is ${req.user}`)
    res.redirect('/');
  });
});
*/

// A simple middleware to check if the user is authenticated (optional, but good practice)
/*
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
};
*/
/*
// The DELETE logout route
router.delete('/logout', isAuthenticated, (req, res) => {
    req.logout(function(err) {
        req.user = null;
        console.log('*******************************inside req.logout() now***************************************');
        if (err) { return next(err); }
        console.log(`user is ${req.user}`)
    });
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).send('Could not log out, please try again.');
        }

        // Successfully destroyed the session
        console.log('*******************************session destroyed, redirecting now***************************************');
        res.redirect(307, '/');
        // Or if you need to send a message:
        // res.status(200).send('Logged out successfully.');
    });
});

//router.get('/logout', (req, res) => {
//    console.log('GET handler called');
//} );
*/

/*
router.get('/signup', signup );

router.post('/signup', async (req, res, next) => {
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
        
        req.logIn(newUser, function(err) {
            if (err) { return next(err); }
            console.log("Authentication successful, redirecting to /products");
            return res.redirect('/products', { user: newUser });
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

router.get('/login', login );

router.post('/login', (req, res, next) => {
    console.log(`email ${req.body.email}, pswd ${req.body.password}`)
    console.log('Inside POST /login callback');
    passport.authenticate('local', function(err, user, info) {
        console.log("Inside authenticate callback");
        if (err) { return next(err); }
        if (!user) { 
            console.log("Authentication failed:", info.message); 
            return res.redirect('/'); 
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            console.log("Authentication successful, redirecting to /products");
            return res.redirect('/products');
        });
    })(req, res, next); // Crucial: You must call the returned function
});
*/
export default router;
