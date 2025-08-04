const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/authMiddleware');

// PUBLIC: Get all news articles (with pagination for admin)
router.get('/', async (req, res) => {
  // Check if it's an admin request with pagination
  if (req.query.page && req.query.limit) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
      const [articles, totalArticles] = await prisma.$transaction([
        prisma.newsArticle.findMany({
          skip: skip,
          take: limit,
          orderBy: { publishedAt: 'desc' },
        }),
        prisma.newsArticle.count(),
      ]);
      res.json({
        data: articles,
        pagination: {
          totalItems: totalArticles,
          totalPages: Math.ceil(totalArticles / limit),
          currentPage: page,
          pageSize: limit,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong while fetching paginated news' });
    }
  } else {
    // Original request for public pages (fetch all)
    try {
      const articles = await prisma.newsArticle.findMany({
        orderBy: { publishedAt: 'desc' },
      });
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong while fetching news articles' });
    }
  }
});

// ... (GET by ID, POST, PUT, DELETE routes remain the same) ...
router.get('/:id', async (req, res) => { /* ... โค้ดเดิม ... */ });
router.post('/', authMiddleware, async (req, res) => { /* ... โค้ดเดิม ... */ });
router.put('/:id', authMiddleware, async (req, res) => { /* ... โค้ดเดิม ... */ });
router.delete('/:id', authMiddleware, async (req, res) => { /* ... โค้ดเดิม ... */ });

module.exports = router;
