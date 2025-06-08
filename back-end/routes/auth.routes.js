const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { User } = require('../models'); // Sequelize User 모델 import

// nodemailer transporter 설정
const transporter = nodemailer.createTransport({
  service: 'naver',
  auth: {
    user: process.env.EMAIL_USER, // .env에 EMAIL_USER, EMAIL_PASS 필요
    pass: process.env.EMAIL_PASS,
  },
});

// 인증코드 저장소 (실무에서는 Redis/DB 추천)
const verificationCodes = new Map();

// 이메일 정규식
const emailRule = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

// 인증코드 발송 API
router.post('/send-code', async (req, res) => {
  const emailValue = req.body.email;
  const result = {
    success: false,
    message: null,
    code: null,
  };

  try {
    // 이메일 유효성 검사
    if (!emailRule.test(emailValue)) {
      throw new Error('이메일 양식이 올바르지 않습니다.');
    } else if (!emailValue) {
      throw new Error('이메일 값이 올바르지 않습니다.');
    }

    // 이메일 중복 체크 (User 모델 사용)
    const user = await User.findOne({
      where: {
        email: emailValue,
        is_deleted: false,
        is_active: true
      }
    });
    if (user) {
      throw new Error('중복된 메일입니다.');
    }

    // 인증코드 생성 및 저장
    const random_code = Math.floor(100000 + Math.random() * 900000); // 6자리
    verificationCodes.set(emailValue, {
      code: random_code,
      expires: Date.now() + 180000, // 3분 유효
    });

    // 이메일 발송
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: emailValue,
      subject: '[펫플레이스] 인증코드 안내',
      html: `
        <div>
          <div style="margin-top: 30px;">
            <p style="font-size: 14px; color: #222222;">인증코드를 확인해주세요.</p>
            <h3 style="font-size: 20px;">[${random_code}]</h3>
            <p style="font-size: 14px; color: #222222;">이메일 인증코드를 발급해드립니다.</p>
          </div>
        </div>
      `,
    });

    console.log(random_code, '메일 인증번호');

    result.success = true;
    result.code = random_code;
    res.send(result);
  } catch (e) {
    result.message = e.message;
    console.log('POST /send-code API ERR : ', e.message);
    res.send(result);
  }
});

// 아이디 찾기(이메일로 아이디 전송) API
router.post('/find-id', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({
      where: {
        email,
        is_deleted: false,
        is_active: true
      }
    });
    if (!user) {
      return res.status(401).json({ message: '존재하지 않는 이메일입니다.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }
    // 아이디(예: username) 이메일로 발송
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '[펫플레이스] 아이디 찾기 안내',
      html: `
        <div>
          <h2>펫플레이스 아이디 찾기</h2>
          <p>요청하신 아이디는 <b>${user.username}</b> 입니다.</p>
        </div>
      `,
    });
    return res.json({ success: true, username: user.username, message: '아이디가 이메일로 발송되었습니다.' });
  } catch (e) {
    console.error('[아이디 찾기 서버 오류]', e);
    return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// 인증코드 검증 API
router.post('/verify-code', async (req, res) => {
  const { email, code } = req.body;
  const result = { success: false, message: null };
  try {
    const stored = verificationCodes.get(email);
    if (!stored) {
      throw new Error('인증코드가 만료되었거나 없습니다.');
    }
    if (Date.now() > stored.expires) {
      verificationCodes.delete(email);
      throw new Error('인증코드가 만료되었습니다.');
    }
    if (String(stored.code) !== String(code)) {
      throw new Error('인증코드가 일치하지 않습니다.');
    }
    verificationCodes.delete(email);
    result.success = true;
    result.message = '인증 성공';
    res.send(result);
  } catch (e) {
    result.message = e.message;
    res.send(result);
  }
});

module.exports = router; 