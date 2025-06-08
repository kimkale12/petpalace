<template>
  <div class="couponpoint-wrap">
    <div class="couponpoint-box">
      <h2>쿠폰/포인트 확인</h2>
      <div class="info-row">
        <span>보유 쿠폰</span>
        <span class="coupon">{{ coupon }}장</span>
      </div>
      <div class="info-row">
        <span>보유 포인트</span>
        <span class="point">{{ point.toLocaleString() }}P</span>
      </div>
      <div class="desc">쿠폰과 포인트는 결제 시 사용 가능합니다.</div>
      <button @click="convertPointToCoupon" class="convert-btn">
        1만 포인트 → 쿠폰 1장 전환
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const point = ref(0)
const coupon = ref(0)

function convertPointToCoupon() {
  // 1만 포인트마다 쿠폰 1장 전환
  let addCoupon = Math.floor(point.value / 10000)
  if (addCoupon > 0) {
    point.value -= addCoupon * 10000
    coupon.value += addCoupon
    // 동기화
    localStorage.setItem('userPoint', point.value)
    localStorage.setItem('userCoupon', coupon.value)
    alert(`포인트가 쿠폰 ${addCoupon}장으로 전환되었습니다!`)
  } else {
    alert('포인트가 1만점 이상일 때만 쿠폰으로 전환할 수 있습니다.')
  }
}

onMounted(() => {
  point.value = Number(localStorage.getItem('userPoint')) || 0
  coupon.value = Number(localStorage.getItem('userCoupon')) || 0
})
</script>

<style scoped>
.couponpoint-wrap {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f7f7f7;
}
.couponpoint-box {
  width: 350px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px #0001;
  padding: 32px 24px 28px 24px;
  text-align: center;
}
.couponpoint-box h2 {
  margin-bottom: 18px;
  font-size: 1.3rem;
  font-weight: bold;
}
.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
  font-size: 1.08rem;
}
.coupon {
  color: #1976d2;
  font-weight: bold;
}
.point {
  color: #e53935;
  font-weight: bold;
}
.desc {
  margin-top: 18px;
  font-size: 0.98rem;
  color: #888;
}
.convert-btn {
  margin-top: 12px;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 18px;
  font-size: 1rem;
  cursor: pointer;
}
.convert-btn:hover {
  background: #1251a3;
}
</style> 