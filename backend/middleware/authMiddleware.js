// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { Role } = require('@prisma/client');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid token format.' });
  }
  const token = tokenParts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // --- ส่วนที่เพิ่มเข้ามา ---
    // ตรวจสอบว่ามี role เป็น ADMIN หรือไม่
    if (decoded.role !== Role.ADMIN) {
        return res.status(403).json({ error: 'Forbidden. Admin access required.' });
    }

    req.user = decoded; // เปลี่ยนจาก req.admin เป็น req.user
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;