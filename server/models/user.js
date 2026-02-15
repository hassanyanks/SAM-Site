import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import bcrypt from 'bcrypt';
import {SALT_ROUNDS} from '../config/config.js';

const UserSchema = new mongoose.Schema({
    // For passport-local
    email: { type: String, unique: true, required: true },
    password: String,
    salt: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    // For OAuth2
    provider: String,
    providerId: String,
    // ... other profile info (name, etc)
}).pre('save', async function(err) {
    //const saltRounds = 10;
    if(!this.isModified('password')) return err;
    try {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        this.password = bcrypt.hash(this.password, salt);
    } catch(err) {
        console.error(err);
    }
}).plugin(passportLocalMongoose.default, {
    usernameField: 'email',
    passwordField: 'password'
});

const User = mongoose.model("User", UserSchema);
export default User;
