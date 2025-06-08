// routes/admin.js
const express = require('express');
const { Reservation, User } = require('../models');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();

// 관리자 권한 체크 미들웨어
function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: '관리자만 접근 가능합니다.' });
  }
  next();
}

// 예약 통계 API
// 예시: routes/admin.js
router.get('/reservations/stats', async (req, res) => {
  try {
    const [standard, deluxe, suite] = await Promise.all([
      Reservation.countDocuments({ roomType: '스탠다드 룸' }),
      Reservation.countDocuments({ roomType: '디럭스 룸' }),
      Reservation.countDocuments({ roomType: '스위트 룸' }),
    ]);
    res.json({ standard, deluxe, suite });
  } catch (e) {
    res.status(500).json({ error: 'DB 에러' });
  }
});
// 전체 예약 목록 조회
router.get('/reservations', authenticate, isAdmin, async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      include: [{ model: User, attributes: ['name', 'email', 'phone'] }]
    });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: '예약 목록 조회 실패', error: err.toString() });
  }
});

// 예약 확정
router.put('/reservations/:id/confirm', authenticate, isAdmin, async (req, res) => {
  const { id } = req.params;
  await Reservation.update({ status: 'confirmed' }, { where: { id } });
  res.json({ message: '예약이 확정되었습니다.' });
});

// 예약 취소
router.put('/reservations/:id/cancel', authenticate, isAdmin, async (req, res) => {
  const { id } = req.params;
  await Reservation.update({ status: 'canceled' }, { where: { id } });
  res.json({ message: '예약이 취소되었습니다.' });
});

module.exports = router;