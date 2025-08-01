// backend/routes/news.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/authMiddleware');

// PUBLIC
router.get('/', async (req, res) => {
  try {
    const articles = await prisma.newsArticle.findMany({
      orderBy: {
        publishedAt: 'desc',
      },
    });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while fetching news articles' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const article = await prisma.newsArticle.findUnique({
      where: { id: parseInt(id) },
    });
    if (!article) {
      return res.status(404).json({ error: 'News article not found' });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: `Something went wrong while fetching article ${id}` });
  }
});

// PROTECTED
router.post('/', authMiddleware, async (req, res) => {
  const { title, content, imageUrl, author } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  try {
    const newArticle = await prisma.newsArticle.create({
      data: { title, content, imageUrl, author },
    });
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while creating the article' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { title, content, imageUrl, author } = req.body;
    try {
        const updatedArticle = await prisma.newsArticle.update({
            where: { id: parseInt(id) },
            data: { title, content, imageUrl, author },
        });
        res.json(updatedArticle);
    } catch (error) {
        res.status(404).json({ error: `Article with ID ${id} not found` });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.newsArticle.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: `Article with ID ${id} not found` });
    }
});

module.exports = router;