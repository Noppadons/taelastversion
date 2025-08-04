const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/authMiddleware');

// PUBLIC: Get all players (with pagination for admin)
router.get('/', async (req, res) => {
  if (req.query.page && req.query.limit) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
      const [players, totalPlayers] = await prisma.$transaction([
        prisma.player.findMany({
          skip: skip,
          take: limit,
          include: { team: { include: { game: true } } },
          orderBy: { id: 'asc' },
        }),
        prisma.player.count(),
      ]);
      res.json({
        data: players,
        pagination: {
          totalItems: totalPlayers,
          totalPages: Math.ceil(totalPlayers / limit),
          currentPage: page,
          pageSize: limit,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong while fetching paginated players' });
    }
  } else {
    // Original request for public pages (fetch all)
    try {
      const players = await prisma.player.findMany({
        include: { team: { include: { game: true } }, stats: { include: { game: true } } },
      });
      res.json(players);
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong while fetching players' });
    }
  }
});

// ... (GET by ID, PUT stats, POST, PUT, DELETE routes remain the same) ...
router.get('/:id', async (req, res) => { /* ... โค้ดเดิม ... */ });
router.put('/:playerId/stats', authMiddleware, async (req, res) => { /* ... โค้ดเดิม ... */ });
router.post('/', authMiddleware, async (req, res) => { /* ... โค้ดเดิม ... */ });
router.put('/:id', authMiddleware, async (req, res) => { /* ... โค้ดเดิม ... */ });
router.delete('/:id', authMiddleware, async (req, res) => { /* ... โค้ดเดิม ... */ });

module.exports = router;
