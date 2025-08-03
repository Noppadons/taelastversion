// backend/routes/teams.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  try {
    const [teams, totalTeams] = await prisma.$transaction([
      prisma.team.findMany({
        skip: skip,
        take: limit,
        include: { game: true },
        orderBy: { id: 'asc' },
      }),
      prisma.team.count(),
    ]);
    res.json({
      data: teams,
      pagination: { totalItems: totalTeams, totalPages: Math.ceil(totalTeams / limit), currentPage: page, pageSize: limit },
    });
  } catch (error) { res.status(500).json({ error: 'Something went wrong while fetching teams' }); }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const team = await prisma.team.findUnique({
      where: { id: parseInt(id) },
      include: { game: true, players: { include: { stats: { include: { game: true } } } } },
    });
    if (!team) { return res.status(404).json({ error: 'Team not found' }); }
    res.json(team);
  } catch (error) { res.status(500).json({ error: `Something went wrong while fetching team ${id}` }); }
});

router.post('/', authMiddleware, async (req, res) => {
  const { name, logoUrl, description, gameId } = req.body;
  if (!name || !gameId) { return res.status(400).json({ error: 'Name and gameId are required' }); }
  try {
    const newTeam = await prisma.team.create({
      data: { name, logoUrl, description, gameId: parseInt(gameId) },
    });
    res.status(201).json(newTeam);
  } catch (error) { res.status(500).json({ error: 'Something went wrong, maybe the gameId or team name already exist?' }); }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, logoUrl, description, gameId } = req.body;
  try {
    const updatedTeam = await prisma.team.update({
      where: { id: parseInt(id) },
      data: { name, logoUrl, description, gameId: gameId ? parseInt(gameId) : undefined },
    });
    res.json(updatedTeam);
  } catch (error) { res.status(404).json({ error: `Team with ID ${id} not found` }); }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.team.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) { res.status(404).json({ error: `Team with ID ${id} not found` }); }
});

module.exports = router;