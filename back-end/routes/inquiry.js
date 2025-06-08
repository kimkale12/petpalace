// routes/inquiry.js
const express = require('express');
const router = express.Router();
const { Inquiry } = require('../models');

// 문의 등록
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message, room } = req.body;
    const inquiry = await Inquiry.create({ name, email, phone, message, room });
    res.json({ id: inquiry.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 문의 목록 조회
router.get('/', async (req, res) => {
  const inquiries = await Inquiry.findAll({ order: [['createdAt', 'DESC']] });
  res.json(inquiries);
});

module.exports = router;