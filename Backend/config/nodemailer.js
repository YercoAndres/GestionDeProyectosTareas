const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const EMAIL_ENABLED = process.env.EMAIL_ENABLED !== 'false';

let transporter;

if (EMAIL_ENABLED) {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER?.trim(),
            pass: process.env.EMAIL_PASS?.replace(/\s+/g, '').trim()
        }
    });
} else {
    transporter = {
        sendMail: async () => ({
            response: 'Email sending disabled by EMAIL_ENABLED flag'
        })
    };
    console.warn('Email delivery disabled (EMAIL_ENABLED=false). All email sends will be skipped.');
}

module.exports = { transporter, EMAIL_ENABLED };
