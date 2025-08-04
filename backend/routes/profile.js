const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const isLoggedInMiddleware = require('../middleware/isLoggedInMiddleware');
const bcrypt = require('bcryptjs');
const upload = require('../config/cloudinary');

// GET: ดึงข้อมูลโปรไฟล์
router.get('/', isLoggedInMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true, username: true, email: true, profileImageUrl: true,
        createdAt: true, role: true, bio: true, socialLinks: true
      }
    });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

// PUT: อัปเดตโปรไฟล์
router.put('/', isLoggedInMiddleware, upload.single('profileImage'), async (req, res) => {
  const { userId } = req.user;
  const { currentPassword, newPassword, bio, socialLinks } = req.body;
  
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const updateData = {};

    if (bio !== undefined) updateData.bio = bio;
    if (socialLinks !== undefined) updateData.socialLinks = JSON.parse(socialLinks); // รับ socialLinks ที่เป็น JSON string

    if (currentPassword && newPassword) {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) return res.status(401).json({ error: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' });
      if (newPassword.length < 6) return res.status(400).json({ error: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร' });
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    if (req.file) {
      updateData.profileImageUrl = req.file.path;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(200).json({ message: 'No changes were made.' });
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { profileImageUrl: true, username: true, bio: true, socialLinks: true }
    });

    res.status(200).json({ message: 'โปรไฟล์อัปเดตสำเร็จ!', user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

module.exports = router;