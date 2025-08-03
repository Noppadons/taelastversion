// backend/routes/players.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  try {
    const players = await prisma.player.findMany({
      include: { team: { include: { game: true } }, stats: { include: { game: true } } },
    });
    res.json(players);
  } catch (error) { res.status(500).json({ error: 'Something went wrong while fetching players' }); }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const player = await prisma.player.findUnique({
            where: { id: parseInt(id) },
            include: { team: { include: { game: true } }, stats: { include: { game: true } } },
        });
        if (!player) { return res.status(404).json({ error: 'Player not found' }); }
        res.json(player);
    } catch (error) { res.status(500).json({ error: `Something went wrong while fetching player ${id}` }); }
});

router.put('/:playerId/stats', authMiddleware, async (req, res) => {
    const { playerId } = req.params;
    const { gameId, stats } = req.body;
    if (!gameId || !stats) { return res.status(400).json({ error: 'gameId and stats object are required.' }); }
    try {
        const playerStat = await prisma.playerStat.upsert({
            where: { playerId_gameId: { playerId: parseInt(playerId), gameId: parseInt(gameId) } },
            update: { stats },
            create: { playerId: parseInt(playerId), gameId: parseInt(gameId), stats },
        });
        res.json(playerStat);
    } catch (error) { res.status(500).json({ error: 'Failed to update player stats.' }); }
});

router.post('/', authMiddleware, async (req, res) => {
  const { nickname, realName, imageUrl, role, teamId } = req.body;
  if (!nickname || !teamId) { return res.status(400).json({ error: 'Nickname and teamId are required' }); }
  try {
    const newPlayer = await prisma.player.create({
      data: { nickname, realName, imageUrl, role, teamId: parseInt(teamId) },
    });
    res.status(201).json(newPlayer);
  } catch (error) { res.status(500).json({ error: 'Something went wrong, maybe the teamId does not exist?' }); }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { nickname, realName, imageUrl, role, teamId } = req.body;
  try {
    const updatedPlayer = await prisma.player.update({
      where: { id: parseInt(id) },
      data: { nickname, realName, imageUrl, role, teamId: teamId ? parseInt(teamId) : undefined },
    });
    res.json(updatedPlayer);
  } catch (error) { res.status(404).json({ error: `Player with ID ${id} not found` }); }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.player.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) { res.status(404).json({ error: `Player with ID ${id} not found` }); }
});

module.exports = router;