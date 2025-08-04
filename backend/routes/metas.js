const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/authMiddleware');

// PUBLIC: Get all meta guides (with pagination for admin)
router.get('/', async (req, res) => {
  if (req.query.page && req.query.limit) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
      const [guides, totalGuides] = await prisma.$transaction([
        prisma.metaGuide.findMany({
          skip: skip,
          take: limit,
          include: { game: true },
          orderBy: { publishedAt: 'desc' },
        }),
        prisma.metaGuide.count(),
      ]);
      res.json({
        data: guides,
        pagination: {
          totalItems: totalGuides,
          totalPages: Math.ceil(totalGuides / limit),
          currentPage: page,
          pageSize: limit,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong while fetching paginated metas' });
    }
  } else {
    // Original request for public pages (fetch all)
    try {
      const guides = await prisma.metaGuide.findMany({
        orderBy: { publishedAt: 'desc' },
        include: { game: true },
      });
      res.json(guides);
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong while fetching meta guides' });
    }
  }
});

// ... (GET by ID, POST, PUT, DELETE routes remain the same) ...
router.get('/:id', async (req, res) => { /* ... โค้ดเดิม ... */ });
router.post('/', authMiddleware, async (req, res) => { /* ... โค้ดเดิม ... */ });
router.put('/:id', authMiddleware, async (req, res) => { /* ... โค้ดเดิม ... */ });
router.delete('/:id', authMiddleware, async (req, res) => { /* ... โค้ดเดิม ... */ });

module.exports = router;
