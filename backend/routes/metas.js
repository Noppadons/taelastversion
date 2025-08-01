// backend/routes/metas.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/authMiddleware');

// PUBLIC
router.get('/', async (req, res) => {
  try {
    const guides = await prisma.metaGuide.findMany({
      orderBy: { publishedAt: 'desc' },
      include: { game: true },
    });
    res.json(guides);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while fetching meta guides' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const guide = await prisma.metaGuide.findUnique({
      where: { id: parseInt(id) },
      include: { game: true },
    });
    if (!guide) {
      return res.status(404).json({ error: 'Meta guide not found' });
    }
    res.json(guide);
  } catch (error) {
    res.status(500).json({ error: `Something went wrong while fetching guide ${id}` });
  }
});

// PROTECTED
router.post('/', authMiddleware, async (req, res) => {
  const { title, content, author, gameId } = req.body;
  if (!title || !content || !gameId) {
    return res.status(400).json({ error: 'Title, content and gameId are required' });
  }
  try {
    const newGuide = await prisma.metaGuide.create({
      data: {
        title,
        content,
        author,
        gameId: parseInt(gameId),
      },
    });
    res.status(201).json(newGuide);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong, maybe the gameId does not exist?' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, content, author, gameId } = req.body;
  try {
    const updatedGuide = await prisma.metaGuide.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        author,
        gameId: gameId ? parseInt(gameId) : undefined,
      },
    });
    res.json(updatedGuide);
  } catch (error) {
    res.status(404).json({ error: `Guide with ID ${id} not found` });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.metaGuide.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: `Guide with ID ${id} not found` });
  }
});

module.exports = router;