// backend/routes/users.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET: ดึงข้อมูลโปรไฟล์สาธารณะด้วย username
router.get('/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { username: username },
            select: { // เลือกเฉพาะข้อมูลที่ต้องการแสดงเป็นสาธารณะ
                username: true,
                profileImageUrl: true,
                bio: true,
                socialLinks: true,
                createdAt: true,
                role: true,
                // ไม่ส่งข้อมูลสำคัญอย่าง email หรือ password กลับไป
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user profile.' });
    }
});

module.exports = router;