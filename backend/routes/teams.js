const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/authMiddleware'); // Import Middleware

// --- PUBLIC ROUTES (GET) ---
// ดึงข้อมูลทีมทั้งหมด (ทุกคนดูได้)
router.get('/', async (req, res) => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        game: true,
        players: true,
      },
    });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while fetching teams' });
  }
});

// ดึงข้อมูลทีมเดียวตาม ID (ทุกคนดูได้)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const team = await prisma.team.findUnique({
      where: { id: parseInt(id) },
      include: {
        game: true,
        players: true,
      },
    });
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: `Something went wrong while fetching team ${id}` });
  }
});


// --- PROTECTED ROUTES (POST, PUT, DELETE) ---
// ต้องเป็น Admin ที่ Login แล้วเท่านั้นถึงจะทำได้

// สร้างทีมใหม่
router.post('/', authMiddleware, async (req, res) => {
  const { name, logoUrl, description, gameId } = req.body;

  if (!name || !gameId) {
    return res.status(400).json({ error: 'Name and gameId are required' });
  }

  try {
    const newTeam = await prisma.team.create({
      data: {
        name,
        logoUrl,
        description,
        gameId: parseInt(gameId),
      },
    });
    res.status(201).json(newTeam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong, maybe the gameId does not exist?' });
  }
});

// อัปเดตข้อมูลทีม
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, logoUrl, description, gameId } = req.body;
  try {
    const updatedTeam = await prisma.team.update({
      where: { id: parseInt(id) },
      data: {
        name,
        logoUrl,
        description,
        gameId: gameId ? parseInt(gameId) : undefined,
      },
    });
    res.json(updatedTeam);
  } catch (error) {
    res.status(404).json({ error: `Team with ID ${id} not found` });
  }
});

// ลบทีม
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.team.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: `Team with ID ${id} not found` });
  }
});

module.exports = router;