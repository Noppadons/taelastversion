// backend/routes/admin_comments.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/authMiddleware');

// ใช้ authMiddleware เพื่อให้แน่ใจว่าเฉพาะ Admin เท่านั้นที่เข้าถึงได้
router.use(authMiddleware);

// GET: ดึง Comment ทั้งหมดพร้อมระบบแบ่งหน้า
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    try {
        const [comments, totalComments] = await prisma.$transaction([
            prisma.comment.findMany({
                skip: skip,
                take: limit,
                include: {
                    author: { select: { username: true } },
                    newsArticle: { select: { id: true, title: true } },
                    metaGuide: { select: { id: true, title: true } },
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.comment.count(),
        ]);

        res.json({
            data: comments,
            pagination: {
                totalItems: totalComments,
                totalPages: Math.ceil(totalComments / limit),
                currentPage: page,
                pageSize: limit,
            },
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch comments." });
    }
});

// DELETE: ลบ Comment ตาม ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.comment.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: `Comment with ID ${id} not found.` });
    }
});

module.exports = router;