<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const storeName = decodeURIComponent(route.query.storeName || '')
const productName = route.query.productName ? decodeURIComponent(route.query.productName) : ''
const orderDate = new Date().toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
const orderNumber = route.query.orderNumber || ''
const orderAmount = Number(route.query.orderAmount || 0)

function goToOrderList() {
  router.push('/payment')
}
function closePopup() {
  router.push('/')
}
</script>

<template>
  <div class="payment-success-wrap">
    <div class="payment-success-box">
      <div class="payment-success-icon">
        <svg width="64" height="64" viewBox="0 0 64 64">
          <rect x="8" y="20" width="48" height="28" rx="6" fill="#1976d2"/>
          <rect x="16" y="28" width="32" height="12" rx="2" fill="#fff"/>
          <rect x="24" y="36" width="16" height="4" rx="1" fill="#1976d2"/>
        </svg>
      </div>
      <h2 class="payment-success-title">결제가 완료되었어요</h2>
      <p class="payment-success-desc">사장님이 주문을 접수한 후,<br>상품이 준비될거예요</p>
      <div class="payment-success-info">
        <div class="info-row"><span>매장명</span><span>{{ storeName }}</span></div>
        <div class="info-row"><span>주문상품</span><span>{{ productName }}</span></div>
        <div class="info-row"><span>결제일시</span><span>{{ orderDate }}</span></div>
        <div class="info-row"><span>주문번호</span><span>{{ orderNumber }}</span></div>
        <div class="info-row"><span>결제금액</span><span class="amount">{{ orderAmount.toLocaleString() }} 원</span></div>
      </div>
      <div class="payment-success-notice">
        * 사장님이 주문을 접수한 후에는 주문 취소가 불가능합니다.
      </div>
      <div class="payment-success-btns">
        <button class="btn-outline" @click="goToOrderList">주문내역보기</button>
        <button class="btn-main" @click="closePopup">확인</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.payment-success-wrap {
  background: #fafbfc;
  min-height: 100vh;
  padding: 40px 0;
}
.payment-success-box {
  max-width: 400px;
  margin: 40px auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px #0001;
  padding: 32px 24px 28px 24px;
  text-align: center;
}
.payment-success-icon {
  margin-bottom: 18px;
}
.payment-success-title {
  font-size: 1.35rem;
  font-weight: bold;
  margin-bottom: 8px;
  color: #222;
}
.payment-success-desc {
  color: #888;
  font-size: 1rem;
  margin-bottom: 18px;
}
.payment-success-info {
  background: #f7f8fa;
  border-radius: 10px;
  padding: 18px 14px 12px 14px;
  margin-bottom: 14px;
  text-align: left;
  font-size: 1rem;
}
.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 7px;
}
.info-row .amount {
  color: #e53935;
  font-weight: bold;
}
.payment-success-notice {
  font-size: 0.93rem;
  color: #888;
  margin-bottom: 18px;
  text-align: left;
}
.payment-success-btns {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.btn-outline {
  border: 1.5px solid #e53935;
  background: #fff;
  color: #e53935;
  border-radius: 24px;
  padding: 10px 24px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-outline:hover {
  background: #ffeaea;
}
.btn-main {
  background: #e53935;
  color: #fff;
  border: none;
  border-radius: 24px;
  padding: 10px 32px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-main:hover {
  background: #c62828;
}
</style>