// backend/index.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const gameRoutes = require('./routes/games');
const teamRoutes = require('./routes/teams');
const playerRoutes = require('./routes/players');
const newsRoutes = require('./routes/news');
const metaRoutes = require('./routes/metas');
const authRoutes = require('./routes/auth');
const commentRoutes = require('./routes/comments');
const uploadRoutes = require('./routes/upload');
const adminCommentRoutes = require('./routes/admin_comments');
const profileRoutes = require('./routes/profile');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // อนุญาตให้เซิร์ฟเวอร์อ่านข้อมูลแบบ JSON จาก request
app.use('/api/games', gameRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/metas', metaRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin/comments', adminCommentRoutes);
app.use('/api/profile', profileRoutes);

// Route ทดสอบ
app.get('/', (req, res) => {
  res.send('<h1>TAE-ESPORT Backend is running!</h1>');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});