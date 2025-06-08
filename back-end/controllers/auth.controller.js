const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { User } = require('../models');

const transporter = nodemailer.createTransport({
  service: 'naver',
  host: 'smtp.naver.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.NAVER_EMAIL,
    pass: process.env.NAVER_EMAIL_PASSWORD,
  },
});

const verificationCodes = new Map();

function generateVerificationCode() {
  return crypto.randomInt(100000, 999999).toString();
}

exports.sendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    const verificationCode = generateVerificationCode();

    verificationCodes.set(email, {
      code: verificationCode,
      expires: Date.now() + 180000,
    });

    await transporter.sendMail({
      from: process.env.NAVER_EMAIL,
      to: email,
      subject: '[펫팰리스] 비밀번호 찾기 인증번호',
      html: `<div>인증번호: <b>${verificationCode}</b></div>`,
    });

    res.json({ success: true, message: '인증번호가 발송되었습니다.' });
  } catch (error) {
    console.error('이메일 발송 실패:', error);
    res.status(500).json({ success: false, message: '인증번호 발송에 실패했습니다.' });
  }
};

exports.verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const storedData = verificationCodes.get(email);

    if (!storedData || Date.now() > storedData.expires) {
      verificationCodes.delete(email);
      return res.json({ success: false, message: '인증번호가 만료되었습니다.' });
    }

    if (storedData.code !== code) {
      return res.json({ success: false, message: '인증번호가 일치하지 않습니다.' });
    }

    verificationCodes.delete(email);
    res.json({ success: true, message: '인증이 완료되었습니다.' });
  } catch (error) {
    console.error('인증 확인 실패:', error);
    res.status(500).json({ success: false, message: '인증 확인에 실패했습니다.' });
  }
};

exports.findIdByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      where: { email, is_deleted: false, is_active: true },
    });

    if (!user) {
      return res.json({ success: false, message: '해당 이메일로 가입된 아이디가 없습니다.' });
    }

    await transporter.sendMail({
      from: process.env.NAVER_EMAIL,
      to: email,
      subject: '[펫팰리스] 아이디 찾기 안내',
      html: `<div>요청하신 아이디는 <b>${user.username}</b> 입니다.</div>`,
    });

    res.json({ success: true, username: user.username, message: '아이디가 이메일로 발송되었습니다.' });
  } catch (error) {
    console.error('[아이디 찾기 서버 오류]', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, name, email, phone, address } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ success: false, message: '유저를 찾을 수 없습니다.' });
    }

    user.username = username;
    user.name = name;
    user.phone = phone;
    user.address = address;
    await user.save();

    res.json({ success: true });
  } catch (err) {
    console.error('[프로필 수정 서버 오류]', err);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
};

exports.signup = async (req, res) => {
  try {
    const { email, password, name, username, phone, address } = req.body;

    if (!email || !password || !name || !username) {
      return res.status(400).json({ message: '필수 항목이 누락되었습니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      username,
      phone,
      address,
    });

    res.status(201).json({ message: '회원가입 성공', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류', error: error.message });
  }
};

exports.checkUsername = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) return res.status(400).json({ message: '아이디를 입력하세요.' });

    const user = await User.findOne({ where: { username } });
    if (user) return res.status(409).json({ message: '이미 사용 중인 아이디입니다.' });

    res.json({ available: true });
  } catch (error) {
    console.error('[checkUsername 에러]', error);
    res.status(500).json({ message: '서버 오류' });
  }
};