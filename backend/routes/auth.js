const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendVerificationEmail } = require('../utils/email');

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email and password are required.' });
    }
    try {
        const existingUserByEmail = await prisma.user.findUnique({ where: { email } });
        if (existingUserByEmail) {
            return res.status(400).json({ error: 'This email is already registered.' });
        }
        const existingUserByUsername = await prisma.user.findUnique({ where: { username } });
        if (existingUserByUsername) {
            return res.status(400).json({ error: 'This username is already taken.' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const user = await prisma.user.create({
            data: { username, email, password: hashedPassword, verificationToken },
        });

        await sendVerificationEmail(user.email, verificationToken);
        res.status(201).json({ message: 'Registration successful. Please check your email to verify your account.' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during registration.' });
    }
});

router.get('/verify', async (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).send('Verification token is required.');
    }
    try {
        const user = await prisma.user.findUnique({ where: { verificationToken: String(token) } });
        if (!user) {
            return res.status(400).send('Invalid or expired verification token.');
        }
        await prisma.user.update({
            where: { id: user.id },
            data: { isVerified: true, verificationToken: null },
        });
        res.send('<h1>Email verified successfully!</h1><p>You can now close this tab and log in.</p>');
    } catch (error) {
        res.status(500).send('An error occurred during email verification.');
    }
});

router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const user = await prisma.user.findFirst({
        where: { OR: [ { email: identifier }, { username: identifier } ] }
    });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (!user.isVerified) {
        return res.status(403).json({ error: 'Please verify your email address before logging in.' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({ token, role: user.role, username: user.username, profileImageUrl: user.profileImageUrl });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

module.exports = router;