// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // 1. ดึง Token จาก Header ที่ชื่อ 'Authorization'
  const authHeader = req.header('Authorization');

  // 2. ตรวจสอบว่ามี Token ส่งมาหรือไม่
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  // 3. ตรวจสอบรูปแบบของ Token (ต้องเป็น "Bearer <token>")
  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid token format. Must be "Bearer <token>".' });
  }

  const token = tokenParts[1];

  try {
    // 4. ตรวจสอบความถูกต้องและวันหมดอายุของ Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 5. ถ้า Token ถูกต้อง, ให้เก็บข้อมูลที่ถอดรหัสแล้ว (payload) ไว้ใน request
    // เพื่อให้ route ต่อไปสามารถนำไปใช้ได้ (ถ้าต้องการ)
    req.admin = decoded;
    
    // 6. อนุญาตให้ request วิ่งต่อไปยังด่านถัดไป (controller)
    next();

  } catch (error) {
    // 7. ถ้า Token ไม่ถูกต้อง (ปลอมแปลง, หมดอายุ) ให้ปฏิเสธการเข้าถึง
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;