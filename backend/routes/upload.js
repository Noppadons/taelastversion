// backend/routes/upload.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/isLoggedInMiddleware'); // ใช้ isLoggedIn เพราะ user ทั่วไปก็อาจอัปโหลดรูปโปรไฟล์ได้
const upload = require('../config/cloudinary');

// Endpoint นี้จะใช้ middleware 'upload.single('image')'
// 'image' คือชื่อ field ที่เราจะส่งมาจาก frontend
router.post('/', authMiddleware, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    // เมื่ออัปโหลดสำเร็จ, Cloudinary จะส่งข้อมูลไฟล์กลับมาใน req.file
    // เราจะส่ง URL ของไฟล์กลับไปให้ Frontend
    res.status(200).json({ imageUrl: req.file.path });
});

module.exports = router;