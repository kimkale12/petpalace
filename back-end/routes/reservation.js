// routes/reservation.js
const express = require('express');
const router = express.Router();
const { Reservation, User } = require('../models');
// const authenticate = require('../middlewares/authenticate');

// 예약 생성
router.post('/', async (req, res) => {
  try {
    // 프론트에서 오는 필드명에 맞춰 받기 (카멜케이스)
    const { order_id, user_id, roomType, checkIn, checkOut, totalPrice, status } = req.body;

    // 1. 필수값 방어 (카멜케이스 기준)
    if (!order_id || !user_id || !roomType || !checkIn || !checkOut || !totalPrice) {
      return res.status(400).json({ error: '필수값 누락' });
    }

    // 2. user_id 유효성 검사 (외래키 체크)
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(400).json({ error: '유효하지 않은 user_id' });
    }

    // 3. 예약 생성 (DB에는 스네이크케이스로 저장)
    const reservation = await Reservation.create({
      order_id,
      user_id,
      room_type: roomType,
      check_in: checkIn,
      check_out: checkOut,
      total_price: totalPrice,
      status
    });

    res.json({ id: reservation.id });
  } catch (err) {
    console.error('예약 생성 에러:', err);
    res.status(500).json({ error: err.message });
  }
});

// 예약 상세 조회
router.get('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id, {
      include: [{
        model: User,
        attributes: ['name', 'email', 'phone']
      }]
    });

    if (!reservation) {
      return res.status(404).json({ error: '예약을 찾을 수 없습니다.' });
    }

    // 프론트에서 기대하는 필드명으로 변환해서 반환
    res.json({
      id: reservation.id,
      roomType: reservation.room_type,
      checkIn: reservation.check_in,
      checkOut: reservation.check_out,
      totalPrice: reservation.total_price,
      status: reservation.status,
      User: reservation.User,
    });
  } catch (err) {
    console.error('예약 상세 조회 에러:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;