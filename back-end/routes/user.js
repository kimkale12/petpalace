require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const authenticate = require('../middlewares/authenticate');
const nodemailer = require('nodemailer');
const router = express.Router();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('❌ 이메일 인증 정보 누락: EMAIL_USER 또는 EMAIL_PASS가 .env에 설정되지 않았습니다.');
}

const transporter = nodemailer.createTransport({
  host: 'smtp.naver.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const verificationCodes = new Map();

const emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 아이디 중복 확인
router.get('/check-username', async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ message: '아이디를 입력하세요.' });

  const exist = await User.findOne({ where: { username } });
  if (exist) return res.status(409).json({ message: '이미 사용 중인 아이디입니다.' });

  res.json({ available: true });
});

// 이메일 중복 확인
router.get('/check-email', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: '이메일을 입력하세요.' });

  const exist = await User.findOne({ where: { email } });
  if (exist) return res.status(409).json({ message: '이미 사용 중인 이메일입니다.' });

  res.json({ available: true });
});

// 회원가입
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, name, phone, address, role } = req.body;

    if (!/^[a-zA-Z0-9]{4,16}$/.test(username)) {
      return res.status(400).json({ message: '아이디는 4~16자의 영문/숫자만 가능합니다.' });
    }

    if (!email || !password || !name || !username) {
      return res.status(400).json({ message: '필수 항목이 누락되었습니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = ['user', 'admin'].includes(role) ? role : 'user';

    await User.create({ username, email, password: hashedPassword, name, phone, address, role: userRole });
    res.status(201).json({ message: '회원가입 성공' });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.toString() });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: '이메일과 비밀번호를 입력하세요.' });

    const user = await User.findOne({ where: { email, is_deleted: false, is_active: true } });
    if (!user) return res.status(401).json({ message: '존재하지 않는 이메일입니다.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: '로그인 성공',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
  } catch (err) {
    console.error('로그인 에러:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 이메일 인증코드 전송
router.post('/send-find-code', async (req, res) => {
  const emailValue = req.body.email;
  const result = { success: false, message: null, code: null };

  try {
    if (!emailRule.test(emailValue)) throw new Error('이메일 양식이 올바르지 않습니다.');

    const user = await User.findOne({ where: { email: emailValue } });
    if (!user) throw new Error('가입된 이메일이 아닙니다.');

    const random_code = Math.floor(100000 + Math.random() * 900000);
    verificationCodes.set(emailValue, { code: random_code, expires: Date.now() + 180000 });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: emailValue,
      subject: '[펫플레이스] 인증코드 안내',
      html: `<p>인증코드: <b>${random_code}</b></p><p>유효 시간: 3분</p>`
    });

    console.log('인증코드 전송:', random_code);
    result.success = true;
    result.code = random_code;
    res.send(result);
  } catch (e) {
    result.message = e.message;
    console.error('POST /send-find-code 오류:', e.message);
    res.send(result);
  }
});

// 인증코드 검증
router.post('/verify-find-code', async (req, res) => {
  const { email, code } = req.body;
  const stored = verificationCodes.get(email);

  if (!stored) return res.status(400).json({ success: false, message: '인증코드가 존재하지 않습니다.' });
  if (Date.now() > stored.expires) {
    verificationCodes.delete(email);
    return res.status(400).json({ success: false, message: '인증코드가 만료되었습니다.' });
  }
  if (stored.code !== Number(code)) return res.status(400).json({ success: false, message: '인증코드가 일치하지 않습니다.' });

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ success: false, message: '해당 이메일로 가입된 계정이 없습니다.' });

  res.json({ success: true, username: user.username });
});

// 내 정보 조회
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'name', 'email', 'phone', 'address', 'role']
    });
    if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.toString() });
  }
});

// 내 정보 수정
router.put('/me', authenticate, async (req, res) => {
  try {
    const { phone, address, password } = req.body;
    const user = await User.findOne({ where: { id: req.user.id } });

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 비밀번호 변경 시 암호화
    if (password && password.length >= 6) {
      const hashed = await bcrypt.hash(password, 10);
      user.password = hashed;
    }

    user.phone = phone;
    user.address = address;
    await user.save();

    res.json({ message: '내 정보가 성공적으로 수정되었습니다.' });
  } catch (err) {
    console.error('[PUT /me 오류]', err);
    res.status(500).json({ message: '서버 오류', error: err.toString() });
  }
});

// 임시 비밀번호 발급
router.post('/find-password', async (req, res) => {
  const { userid, email } = req.body;
  try {
    // 아이디와 이메일로 사용자 찾기
    const user = await User.findOne({ where: { username: userid, email } });
    if (!user) {
      return res.json({ success: false, message: '일치하는 정보가 없습니다.' });
    }

    // 임시 비밀번호 생성
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashed = await bcrypt.hash(tempPassword, 10);

    // 비밀번호 업데이트
    user.password = hashed;
    await user.save();

    // 임시 비밀번호 이메일로 발송
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '[펫플레이스] 임시 비밀번호 안내',
      html: `<p>임시 비밀번호: <b>${tempPassword}</b></p><p>로그인 후 반드시 비밀번호를 변경해 주세요.</p>`
    });

    res.json({ success: true, tempPassword });
  } catch (e) {
    console.error('임시 비밀번호 발급 오류:', e);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});

module.exports = router;
