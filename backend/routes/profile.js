const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const isLoggedInMiddleware = require('../middleware/isLoggedInMiddleware');
const bcrypt = require('bcryptjs');
const upload = require('../config/cloudinary');

// GET: ดึงข้อมูลโปรไฟล์ของผู้ใช้ที่ Login อยู่
router.get('/', isLoggedInMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        username: true,
        email: true,
        profileImageUrl: true,
        createdAt: true,
        role: true
      }
    });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

// PUT: อัปเดตโปรไฟล์ (เปลี่ยนรหัสผ่าน และ/หรือ รูปภาพ)
router.put('/', isLoggedInMiddleware, upload.single('profileImage'), async (req, res) => {
  const { userId } = req.user;
  const { currentPassword, newPassword } = req.body;
  
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const updateData = {};

    // 1. จัดการเรื่องเปลี่ยนรหัสผ่าน (ถ้ามีการกรอกข้อมูลมา)
    if (currentPassword && newPassword) {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร' });
      }
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // 2. จัดการเรื่องอัปโหลดรูป (ถ้ามีไฟล์ส่งมา)
    if (req.file) {
      updateData.profileImageUrl = req.file.path;
    }

    // 3. ถ้าไม่มีอะไรให้อัปเดต ก็ไม่ต้องทำอะไร
    if (Object.keys(updateData).length === 0) {
      return res.status(200).json({ 
        message: 'No changes were made.',
        profileImageUrl: user.profileImageUrl
      });
    }
    
    // 4. อัปเดตข้อมูลลงฐานข้อมูล
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { profileImageUrl: true, username: true }
    });

    res.status(200).json({ 
      message: 'โปรไฟล์อัปเดตสำเร็จ!', 
      user: updatedUser
    });

  } catch (error) {
    console.error("Profile update error:", error)
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

module.exports = router;