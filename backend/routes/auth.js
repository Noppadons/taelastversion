// backend/routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. หา user จาก username
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' }); // ไม่ควรบอกว่า username ไม่มีอยู่
    }

    // 2. เปรียบเทียบรหัสผ่านที่ส่งมากับรหัสผ่านที่เข้ารหัสไว้ใน DB
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 3. ถ้าทุกอย่างถูกต้อง สร้าง JWT Token
    const token = jwt.sign(
      { adminId: admin.id, username: admin.username }, // ข้อมูลที่จะเก็บใน token
      process.env.JWT_SECRET, // กุญแจลับ
      { expiresIn: '1d' } // Token มีอายุ 1 วัน
    );

    // 4. ส่ง Token กลับไปให้ Frontend
    res.json({ token });

  } catch (error) {
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

module.exports = router;