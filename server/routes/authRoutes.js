import express from 'express';
import User from '../models/user.js';
import path from 'path';
import passport from 'passport';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { signup } from '../controllers/authControllers.js';
import { generateHashedToken, sendEmailWithToken, updateUserWithToken } from '../lib/credentials.js';
import { home } from '../controllers/authControllers.js';
import { ShoppingCart } from '../lib/redisShoppingCart.js';
import { redisClient } from '../app.js';
//import { appPassport } from '../app.js';

const __dirname = import.meta.dirname
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('starting auth routes init...');
//const { Strategy: LocalStrategy } = await import('passport-local');

var router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json()); 
router.use(passport.initialize());
router.use(passport.session()); // This uses the express-session middleware

const { Strategy: LocalStrategy } = await import('passport-local');

    // configure passport.js to use the local strategy
    passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        //console.log(`Inside local strategy callback, user pswd is ${email}`)
        const user = await User.findOne({ email: email }).exec()
            .then((user) => { 
                //console.log(`found user is ${user.email}, pswd is ${user.passwordHash}`);
                if(!user) { console.log('User not found'); return done(null, false, { message: 'User not found\n' });}
                bcrypt.compare(password, user.password, (err, result) => {
                    if(err || !result ) {
                        return done(null, false, { message:  'password mismatch!'} );
                    } else {
                        console.log('**************************Local strategy returned true');
                        return done(null, user);
                    }
                });
            }
        );
    }
    ));

    // tell passport how to serialize the user
    passport.serializeUser((user, done) => {
    console.log(`*********************Inside serializeUser callback. User id ${user.id} is saved to the session file store here`)
    done(null, user.id);
    });

    passport.deserializeUser(async function(id, done) {
    //console.log('Inside deserializeUser callback')
    //console.log(`The user id passport saved in the session file store is: ${id}`)
        const user = await User.findById(id).exec()
        .then((user, err) => {
            console.log(`**************************user found is ${user.id}`);
            if(err) { return done(err); }
            if(!user) { return done(null, false); }
            done(null, user);
        });
    });

router.use((req, res, next) => {
    if( req.isAuthenticated() ) {
        res.locals.user, req.user = req.session.passport.user; 
        console.log(`*************************************req.isAuthenticated():  res.locals.user now is ${JSON.stringify(req.session.passport.user)}*********************************************`)
    } else {
        res.locals.user = null;
    }
  next();
});

router.get('/uploaded', (req, res) => {
    const error_msg = req.flash('error');
    const success_msg = req.flash('success');
    res.render('index', { user: req.user, success_msg: success_msg.toString().trim(), error_msg: error_msg.toString().trim()});
} );

router.get('/signup', signup );

router.post('/signup', async (req, res, next) => {
    const guestCart = req.session.cart;
    console.log(`***********************************************in /signup POST, saved req session cart is ${JSON.stringify(guestCart)}...authenticating...`);
    try {
        if(!req.body.email.includes('@')) {
            return res.send('<h2>Seems you did not enter a valid email address.  Hit the back button and please try again.</h2>')
        }
        console.log(`signing up with email ${req.body.email} and pswd ${req.body.password}`);
        const userPassword = req.body.password;

        // Ensure SALT_ROUNDS is defined globally or imported
        const hash = await bcrypt.hash(userPassword, Number(process.env.SALT_ROUNDS));

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
            res.locals.userid, req.user = newUser;
            req.session.userid = req.user._id;
            req.session.cart = guestCart;
            console.log(`***********************************************/signup Authentication successful, user is ${req.session.userid}, cart is now ${JSON.stringify(req.session.cart)}...redirecting`);
            console.log(`Authentication successful, current user is ${newUser}, redirecting to /`);
            return res.redirect(303, '/index', { user: req.user });
            //return res.redirect('/products');
        });

    } catch (err) {
        //console.error(`Error registering user: ${err}`);
        // If the error is a duplicate key (e.g., email already exists), send a specific error
        if (err.code === 11000) {
            return res.status(400).send( '<h2>Email already in use--try \'Forgot password?\' on login page.</h2>' );
        }
        // Pass other errors to the general error handler
        next(err);
    }
});

router.get('/login', (req, res) => {
    res.render('login');
} );

router.post('/login', (req, res, next) => {
   if(!req.body.email.includes('@')) {
        return res.send('<h2>Seems you did not enter a valid email address.  Hit the back button and please try again.</h2>')
    }
    passport.authenticate('local', function(err, user, info) {
        console.log("Inside authenticate callback");
        if (err) { return next(err); }
        if (!user) { 
            console.log("Authentication failed:", info.message); 
            return res.status(401).send('<h2>Authentication seems to have failed:  <u>maybe you do not have an account yet?</u>  Please click the browser back button and try again.</h2>');
        }
        req.logIn(user, async function(err) {
            if (err) { return next(err); }
            console.log(`logging user ${JSON.stringify(req.session.passport.user)} in...`);
            //const cart = new ShoppingCart(req.user._id, redisClient.client);
            //await cart.mergeCarts(req.session.id, req.user._id);
            return res.redirect(303, '/' );
        });
    })(req, res, next); // Crucial: You must call the returned function
});

router.post('/forgot-password-email-send', async (req, res) => {
    //console.log(`in /forgot-password-email-send POST, user email is ${JSON.stringify(req.body)}`);
    try {
        if(!req.body.email.includes('@')) {
            return res.send('<h2>Seems you did not enter a valid email address.  Hit the back button and please try again.</h2>')
        }
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send('User not found.');
        }
        const token = await generateHashedToken(user);
        if(!token) {
            return res.status(400).send('Token generation error!!');
        }
        const modifedUser = updateUserWithToken(user, token);
        console.log(`modified user is ${modifedUser}`)
        if(!modifedUser) {
            return res.status(400).send('Token save error!!');
        }
        sendEmailWithToken(user);       
        return res.send('<h2>Reset your password by following the link just sent to your email.  The token in the link will expire in one hour</h2>');
    } catch (error) {
        console.error(`Encountered error ${error}`);
        return res.status(400).send('We encountered an error!!');
    }
});

router.get('/pswd-reset-usermatch', async (req, res) => {
    console.log(`inside /pswd-reset-usermatch, token is ${JSON.stringify(req.query)}`)
    const { token } = req.query;
    const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() } // Ensure token isn't expired
  });
  if (!user) return res.status(400).send('Token is invalid or has expired.');
  req.query.user = user;
  res.redirect(302,`/password-reset-form?email=${user.email}`); 
});

router.get('/password-reset-form', async (req, res) => {
    const email = req.query.email;
    console.log(`inside /password-reset-form GET, user email is ${email}`)
    res.render('reset_password', { email: email });
});

router.post('/reset-password', async (req, res) => {
    console.log(`inside /password-reset-form POST, user email is ${req.body.email}, updated pswd is ${req.body.password}`)
    const user = await User.findOne({
        email: req.body.email
    });
    if (!user) return res.status(404).send('Could not find user.');
    const hash = await bcrypt.hash(req.body.password, Number(process.env.SALT_ROUNDS));
    console.log(`new password hash is ${hash}`);
    user.resetPasswordToken = '';
    user.resetPasswordExpires = '';
    user.password = hash;
    await user.save();
    res.redirect(302, '/login');
});

// The POST logout route
router.post('/logout',  async (req, res, next) => {
    console.log('inside /logout POST now');
    try {
        await new Promise((resolve, reject) => {
            req.logout((err) => {
                console.log('inside req.logout() now');
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
            console.log(`session destroyed, user now is ${req.user}....redirecting now`);
            res.clearCookie('connect.sid');
            res.redirect(303, '/');
            // Or if you need to send a message:
            // res.status(200).send('Logged out successfully.');
        });
    } catch(err) {
        return next(err);
    }
});

export default router;