// back-end/routes/billing.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/success', async (req, res) => {
  const { authKey, customerKey } = req.query;
  try {
    // Toss 빌링키 발급 API 호출
    const response = await axios.post(
      'https://api.tosspayments.com/v1/billing/authorizations/issue',
      {
        authKey,
        customerKey
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from('test_sk_...:').toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const billingKey = response.data.billingKey;
    // TODO: billingKey를 DB에 저장 (아래 예시 참고)
    await User.update({ billingKey }, { where: { customerKey } });

    res.send('빌링키 발급 성공!'); // 또는 프론트엔드로 리다이렉트
  } catch (err) {
    console.error('빌링키 발급 실패:', err.response?.data || err);
    res.status(500).send('빌링키 발급 실패');
  }
});

module.exports = router;