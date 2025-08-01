// backend/routes/games.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/authMiddleware');

// PUBLIC
router.get('/', async (req, res) => {
  try {
    const games = await prisma.game.findMany();
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong while fetching games" });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const game = await prisma.game.findUnique({
      where: { id: parseInt(id) },
    });
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: `Something went wrong while fetching game ${id}` });
  }
});

// PROTECTED
router.post('/', authMiddleware, async (req, res) => {
  const { name, imageUrl } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  try {
    const newGame = await prisma.game.create({
      data: { name, imageUrl },
    });
    res.status(201).json(newGame);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong while creating the game" });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, imageUrl } = req.body;
  try {
    const updatedGame = await prisma.game.update({
      where: { id: parseInt(id) },
      data: { name, imageUrl },
    });
    res.json(updatedGame);
  } catch (error) {
    res.status(404).json({ error: `Game with ID ${id} not found` });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.game.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: `Game with ID ${id} not found` });
  }
});

module.exports = router;