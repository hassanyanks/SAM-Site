import User from '../models/user.js';
import passport from 'passport';
import bcrypt from 'bcrypt';
//import session from 'express-session';

const { Strategy: LocalStrategy } = await import('passport-local');

export default function (passportConfig) {

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
                        //console.log('Local strategy returned true');
                        return done(null, user);
                    }
                });
            }
        );
    }
    ));

    // tell passport how to serialize the user
    passport.serializeUser((user, done) => {
    //console.log('Inside serializeUser callback. User id is save to the session file store here')
    done(null, user.id);
    });

    passport.deserializeUser(async function(id, done) {
    //console.log('Inside deserializeUser callback')
    //console.log(`The user id passport saved in the session file store is: ${id}`)
        const user = await User.findById(id).exec()
        .then((user, err) => {
            //console.log(`user found is ${user.id}`);
            if(err) { return done(err); }
            if(!user) { return done(null, false); }
            done(null, user);
        });
    });
}
