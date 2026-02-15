import bcrypt from 'bcrypt';
import crypto from 'crypto';
import User from '../models/user.js';
import {SALT_ROUNDS} from '../config/config.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { MailtrapClient } from 'mailtrap';

dotenv.config({ path: '../.env' }); // Optionally, set a custom path

// Looking to send emails in production? Check out our Email API/SMTP product!
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.ESP_USER,
    pass: process.env.ESP_PSWD
  }
});

export async function sendPasswordResetToken(email, res) {

    console.log(`user email passed in:  ${email}`)
    const user = await User.findOne({ email: email });
    console.log(`*********************user ${process.env.ESP_USER}, pswd ${process.env.ESP_PSWD}**************************`)
    if (!user) return 404;

    // 1. Generate a raw random token for the email link
    const rawToken = crypto.randomBytes(32).toString('hex');

    // 2. Hash that token before saving it to the database
    const saltRounds = SALT_ROUNDS;
    const hashedToken = await bcrypt.hash(rawToken, saltRounds);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 1800000; // .5 hour
    await user.save();
    const resetUrl = `https://localhost:3000/password-reset2/?token=${hashedToken}`;
    console.log(`pswd reset token created:  ${hashedToken}`);

    const TOKEN = process.env.MAILTRAP_TOKEN;
    const TEST_INBOX_ID = process.env.MAILTRAP_INBOX_ID;
    const SENDER_EMAIL = "support@gmail.com";
    const RECIPIENT_EMAIL = user.email;

    const client = new MailtrapClient({ token: TOKEN, sandbox: true, testInboxId: TEST_INBOX_ID });

    client.send({
    from: { name: "Mailtrap Test", email: SENDER_EMAIL },
    to: [{ email: RECIPIENT_EMAIL }],
    subject: "Password Reset Request",
    text: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`,
    })
    .then(console.log)
    .catch(console.error);
   
  } 
