<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const storeName = route.query.storeName
const productName = route.query.productName
const orderNumber = route.query.orderNumber
const orderAmount = route.query.orderAmount
const customerKey = route.query.customerKey
const authKey = route.query.authKey



onMounted(() => {
  setTimeout(() => {
    router.replace({
      path: '/payment/success',
      query: { storeName, productName, orderNumber, orderAmount, customerKey, authKey }
    })
  }, 2000)
})
</script>

<template>
  <div class="payment-delay-wrap">
    <div class="payment-delay-box">
      <div class="payment-delay-icon">
        <!-- 로딩/인증 일러스트 (SVG) -->
        <svg width="60" height="60" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="26" fill="#f3f6fa" />
          <path d="M30 10 a20 20 0 1 1 -14.14 5.86" stroke="#1976d2" stroke-width="4" fill="none" stroke-linecap="round"/>
          <circle cx="30" cy="10" r="4" fill="#1976d2"/>
        </svg>
      </div>
      <h2 class="payment-delay-title">결제 인증 처리 중입니다...</h2>
      <p class="payment-delay-desc">잠시만 기다려주세요.</p>
    </div>
  </div>
</template>

<style scoped>
.payment-delay-wrap {
  background: #fafbfc;
  min-height: 100vh;
  padding: 40px 0;
}
.payment-delay-box {
  max-width: 360px;
  margin: 120px auto 0 auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px #0001;
  padding: 36px 24px 32px 24px;
  text-align: center;
}
.payment-delay-icon {
  margin-bottom: 18px;
  animation: rotate 1.2s linear infinite;
  display: flex;
  justify-content: center;
}
@keyframes rotate {
  100% { transform: rotate(360deg); }
}
.payment-delay-title {
  font-size: 1.18rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #1976d2;
}
.payment-delay-desc {
  color: #888;
  font-size: 1rem;
  margin-bottom: 2px;
}
</style>