const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendVerificationEmail = async (to, token) => {
    // ใช้ FRONTEND_URL ถ้าอยู่บน Production, ถ้าไม่ ให้ใช้ localhost
    const baseUrl = process.env.FRONTEND_URL || 'https://tae-esport.onrender.com';
    const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

    const mailOptions = {
        from: `"TAE-ESPORT" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: 'Verify Your Email Address for TAE-ESPORT',
        html: `<p>Please click the link below to verify your email address:</p><a href="${verificationUrl}">Verify Email</a>`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Could not send verification email.');
    }
};

module.exports = { sendVerificationEmail };