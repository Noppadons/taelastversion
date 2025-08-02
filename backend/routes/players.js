// backend/routes/players.js (ฉบับแก้ไข)

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/authMiddleware');

// PUBLIC
router.get('/', async (req, res) => {
  try {
    const players = await prisma.player.findMany({
      include: {
        team: { //  <-- แก้ไขส่วนนี้
          include: {
            game: true //  <-- ให้ดึงข้อมูล game ที่อยู่ใน team มาด้วย
          }
        }
      },
    });
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while fetching players' });
  }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const player = await prisma.player.findUnique({
            where: { id: parseInt(id) },
            include: { 
              team: {
                include: {
                  game: true
                }
              }
            },
        });
        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }
        res.json(player);
    } catch (error) {
        res.status(500).json({ error: `Something went wrong while fetching player ${id}` });
    }
});

// PROTECTED (ส่วนที่เหลือเหมือนเดิม)
router.post('/', authMiddleware, async (req, res) => {
  const { nickname, realName, imageUrl, role, teamId } = req.body;
  if (!nickname || !teamId) {
    return res.status(400).json({ error: 'Nickname and teamId are required' });
  }
  try {
    const newPlayer = await prisma.player.create({
      data: {
        nickname,
        realName,
        imageUrl,
        role,
        teamId: parseInt(teamId),
      },
    });
    res.status(201).json(newPlayer);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong, maybe the teamId does not exist?' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { nickname, realName, imageUrl, role, teamId } = req.body;
  try {
    const updatedPlayer = await prisma.player.update({
      where: { id: parseInt(id) },
      data: {
        nickname,
        realName,
        imageUrl,
        role,
        teamId: teamId ? parseInt(teamId) : undefined,
      },
    });
    res.json(updatedPlayer);
  } catch (error) {
    res.status(404).json({ error: `Player with ID ${id} not found` });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.player.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: `Player with ID ${id} not found` });
  }
});

module.exports = router;