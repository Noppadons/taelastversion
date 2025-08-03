const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const isLoggedInMiddleware = require('../middleware/isLoggedInMiddleware');

// GET comments for a news article
router.get('/news/:articleId', async (req, res) => {
    const { articleId } = req.params;
    try {
        const comments = await prisma.comment.findMany({
            where: { newsArticleId: parseInt(articleId) },
            include: { author: { select: { username: true, role: true } } },
            orderBy: { createdAt: 'asc' },
        });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch comments." });
    }
});

// GET comments for a meta guide
router.get('/metas/:guideId', async (req, res) => {
    const { guideId } = req.params;
    try {
        const comments = await prisma.comment.findMany({
            where: { metaGuideId: parseInt(guideId) },
            include: { author: { select: { username: true, role: true } } },
            orderBy: { createdAt: 'asc' },
        });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch comments." });
    }
});

// POST a new comment
router.post('/', isLoggedInMiddleware, async (req, res) => {
    const { text, newsArticleId, metaGuideId } = req.body;
    const { userId } = req.user;

    if (!text) {
        return res.status(400).json({ error: "Comment text cannot be empty." });
    }
    if (!newsArticleId && !metaGuideId) {
        return res.status(400).json({ error: "Comment must be linked to an article or guide." });
    }

    try {
        const newComment = await prisma.comment.create({
            data: {
                text,
                authorId: userId,
                newsArticleId: newsArticleId ? parseInt(newsArticleId) : undefined,
                metaGuideId: metaGuideId ? parseInt(metaGuideId) : undefined,
            },
            include: { author: { select: { username: true, role: true } } },
        });
        res.status(201).json(newComment);
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ error: "Failed to create comment." });
    }
});

module.exports = router;