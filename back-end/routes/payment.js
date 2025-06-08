const express = require('express')
const axios = require('axios')
const { User } = require('../models') // 예시: User 모델
const authenticate = require('../middlewares/authenticate')
const router = express.Router()

// 토스 빌링키 발급(정기결제 등록) 준비
router.post('/ready', authenticate, async (req, res) => {
  try {
    // 프론트에서 customerKey, successUrl, failUrl 등 전달받음
    const { customerKey, successUrl, failUrl } = req.body
    // 결제창 띄우기는 프론트에서 처리 (requestBillingAuth)
    // 여기서는 결제 준비가 필요없으므로 바로 200 OK 반환
    res.json({ message: '프론트에서 requestBillingAuth로 결제창을 띄워주세요.' })
  } catch (err) {
    console.error('토스 빌링키 준비 에러:', err)
    res.status(500).json({ message: '토스 빌링키 준비 오류', error: err.message })
  }
})

// 토스 빌링키 발급 콜백 (successUrl)
router.get('/success', async (req, res) => {
  const { authKey, customerKey } = req.query
  console.log('빌링키 발급 콜백, authKey:', authKey, 'customerKey:', customerKey)
  if (!authKey || !customerKey) {
    console.error('authKey 또는 customerKey가 없습니다.')
    return res.redirect('/payment/fail')
  }
  try {
    // 토스 빌링키 발급 API 호출
    const response = await axios.post(
      'https://api.tosspayments.com/v1/billing/authorizations/issue',
      {
        authKey,
        customerKey
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(process.env.TOSS_SECRET_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    )
    const billingKey = response.data.billingKey
    // DB에 billingKey 저장 (예시)
    await User.update({ billingKey }, { where: { customerKey } })
    res.send('빌링키 발급 성공!') // 또는 프론트엔드로 리다이렉트
  } catch (err) {
    console.error('빌링키 발급 실패:', err.response?.data || err)
    res.status(500).send('빌링키 발급 실패')
  }
})

// 결제 취소/실패 라우트 (필요시)
router.get('/fail', (req, res) => {
  res.send('빌링키 발급 실패')
})

module.exports = router