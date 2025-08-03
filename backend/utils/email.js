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
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    const mailOptions = {
        from: `"TAE-ESPORT" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: 'Verify Your Email Address for TAE-ESPORT',
        html: `
            <h2>Welcome to TAE-ESPORT!</h2>
            <p>Thank you for registering. Please click the link below to verify your email address:</p>
            <a href="${verificationUrl}" style="background-color: #22d3ee; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
            <p>If you did not register for this account, you can ignore this email.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent to:', to);
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
};

module.exports = { sendVerificationEmail };