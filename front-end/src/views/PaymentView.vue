<script setup>
import { loadTossPayments } from '@tosspayments/payment-sdk'
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { reservationAPI } from '@/utils/api'

const route = useRoute()
const router = useRouter()
const customerKey = route.query.customerKey || 'user_1234'
const reservationId = route.query.reservationId
const order = ref(null)
const isLoading = ref(true)
const orderNumber = ref('') // 주문번호

const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY

// 객실명-1박 가격 매핑
const roomPriceMap = {
  '스탠다드 룸': 50000,
  '디럭스 룸': 70000,
  '스위트 룸': 100000
}
// 객실명-이미지 매핑
const roomImageMap = {
  '스탠다드 룸': '/assets/images/standard-room.png',
  '디럭스 룸': '/assets/images/deluxe-room.png',
  '스위트 룸': '/assets/images/suite-room.png'
}

const coupon = ref(Number(localStorage.getItem('userCoupon')) || 0)
const couponInput = ref(0) // 사용자가 입력한 쿠폰 사용 개수
const couponDiscount = computed(() => {
  // 쿠폰 1장당 10,000원 할인, 실제 보유 쿠폰 이하만 사용 가능
  const usable = Math.min(couponInput.value, coupon.value)
  return usable * 10000
})
const point = ref(Number(localStorage.getItem('userPoint')) || 0)

onMounted(async () => {
  if (!reservationId) {
    alert('예약 정보가 없습니다.')
    router.push('/')
    return
  }

  try {
    const res = await reservationAPI.getDetail(reservationId)
    if (!res.data) {
      throw new Error('예약 정보를 찾을 수 없습니다.')
    }
    // roomType, checkIn, checkOut이 제대로 오는지 콘솔로 확인
    console.log('예약상세:', res.data)
    const roomType = res.data.roomType
    const pricePerNight = roomPriceMap[roomType] || 0
    // 이미지 경로 동적 할당
    const roomImage = roomImageMap[roomType] || '/assets/images/standard-room.png'
    // 체크인~체크아웃 날짜 차이 계산 (박수)
    const checkIn = new Date(res.data.checkIn)
    const checkOut = new Date(res.data.checkOut)
    let nights = 1
    if (!isNaN(checkIn) && !isNaN(checkOut)) {
      const diffTime = checkOut - checkIn
      nights = diffTime > 0 ? Math.floor(diffTime / (1000 * 60 * 60 * 24)) : 1
    }
    // 포인트/쿠폰은 localStorage에서 불러오기
    const savedPoint = Number(localStorage.getItem('userPoint')) || Number(res.data.User?.point) || 0
    const savedCoupon = Number(localStorage.getItem('userCoupon')) || 0
    order.value = {
      product: {
        name: roomType,
        price: pricePerNight,
        count: nights,
        image: roomImage, // 동적으로 할당
        option: `${res.data.checkIn} ~ ${res.data.checkOut}`
      },
      buyer: {
        name: res.data.User?.name || '예약자',
        phone: res.data.User?.phone || '-',
        email: res.data.User?.email || '-',
        point: savedPoint,
        coupon: savedCoupon
      },
      receiver: {
        name: res.data.User?.name || '예약자',
        phone: res.data.User?.phone || '-',
        address: '-'
      },
      delivery: Number(res.data.delivery) || 0,
      memo: ''
    }
    coupon.value = savedCoupon
    point.value = savedPoint
  } catch (error) {
    console.error('예약 정보 조회 중 오류 발생:', error)
    alert(error.response?.data?.error || '예약 정보를 불러오지 못했습니다.')
    router.push('/')
  } finally {
    isLoading.value = false
  }
})

const payMethod = ref('payment')
const agreeAll = ref(false)
const agreeList = ref([
  false // 구매조건 확인 및 결제진행에 동의
  // 하위 동의 항목이 추가될 경우 false 추가
])

const totalPrice = computed(() => {
  if (!order.value) return 0
  // 수량 * 가격 - 쿠폰할인 - 포인트 + 배송비
  return order.value.product.price * order.value.product.count - couponDiscount.value - point.value + order.value.delivery
})

// 전체 동의 체크 시 하위 체크박스 모두 변경
function toggleAllAgree() {
  agreeList.value = agreeList.value.map(() => agreeAll.value)
}

// 하위 체크박스가 모두 체크되면 전체 동의도 체크
watch(agreeList, (val) => {
  agreeAll.value = val.every(Boolean)
})

const canPay = computed(() => agreeAll.value && totalPrice.value > 0)

function applyCoupon() {
  // 사용자가 입력한 쿠폰 개수만큼만 적용, 보유 쿠폰 초과 불가
  if (couponInput.value > coupon.value) {
    alert('보유 쿠폰보다 많이 사용할 수 없습니다.')
    couponInput.value = coupon.value
    return
  }
  if (couponInput.value < 0) {
    couponInput.value = 0
    return
  }
  alert(`${couponInput.value}장 쿠폰이 적용되었습니다.`)
}
function useAllPoints() {
  if (order.value && order.value.buyer) {
    point.value = order.value.buyer.point
  }
}

// 결제 성공 후 포인트 적립 및 사용 포인트/쿠폰 동기화
function addPointAfterPayment() {
  const pointToAdd = Math.floor((totalPrice.value || 0) / 100) * 1
  let newPoint = (order.value.buyer.point - point.value) + pointToAdd
  if (newPoint < 0) newPoint = 0
  order.value.buyer.point = newPoint
  localStorage.setItem('userPoint', newPoint)
  // 쿠폰 차감
  let usedCoupon = couponInput.value
  let newCoupon = Math.max(0, coupon.value - usedCoupon)
  coupon.value = newCoupon
  order.value.buyer.coupon = newCoupon
  localStorage.setItem('userCoupon', newCoupon)
  couponInput.value = 0 // 결제 후 입력값 초기화
}

// pay 함수
async function pay() {
  if (!canPay.value) return;
  // 주문번호, 결제금액 등 동적으로 생성
  orderNumber.value = 'ORDER-' + Math.floor(Math.random() * 1000000000)
  const storeName = order.value?.storeName || '펫팰리스'
  const productName = order.value?.product?.name || ''
  const orderAmount = totalPrice.value

  // 결제 성공 시 포인트 적립 및 동기화
  addPointAfterPayment()
  alert('결제가 완료되었습니다! 포인트가 적립되었습니다.')
  router.push('/coupon-point')
}
</script>

<template>
  <div v-if="order" class="payment-container">
    <h2 class="payment-title">결제하기</h2>
    <div class="payment-content">
      <!-- 왼쪽: 주문/배송/쿠폰 -->
      <div class="payment-left">
        <!-- 주문 상품 정보 -->
        <section class="box">
          <h3>주문 상품 정보</h3>
          <div class="product-info">
            <img :src="order.product.image" class="product-img" />
            <div>
              <div class="product-name">{{ order.product.name }}</div>
              <div class="product-count">수량: {{ order.product.count }}</div>
              <div class="product-price">{{ ((order.product.price * order.product.count) || 0).toLocaleString() }}원</div>
            </div>
          </div>
        </section>
        <!-- 주문자 정보 -->
        <section class="box">
          <h3>주문자 정보</h3>
          <div class="info-row">
            <div>
              <div>{{ order.buyer.name }}</div>
              <div>{{ order.buyer.phone }}</div>
              <div>{{ order.buyer.email }}</div>
            </div>
            <button class="btn-edit">수정</button>
          </div>
        </section>
        <!-- 숙박 정보 -->
        <section class="box">
          <h3>숙박 정보</h3>
          <div class="info-row">
            <div>
              <div>{{ order.receiver.name }}</div>
              <div>{{ order.receiver.phone }}</div>
              <div>{{ order.receiver.address }}</div>
            </div>
            <button class="btn-edit">변경</button>
          </div>
          <div class="form-row">
            <label>숙박 관련메모</label>
            <select v-model="order.memo">
              <option value="">특이사항 선택해주세요.</option>
              <option>소형견</option>
              <option>중형견</option>
              <option>대형견</option>
            </select>
          </div>
        </section>
        <!-- 쿠폰/포인트 -->
        <section class="box">
          <h3>쿠폰/포인트</h3>
          <div class="form-row">
            <label>쿠폰</label>
            <input v-model.number="couponInput" type="number" min="0" :max="coupon" />
            <button class="btn-sub" @click="applyCoupon">쿠폰적용</button>
          </div>
          <div class="form-row">
            <label>쿠폰 번호</label>
            <input v-model="couponCode" placeholder="쿠폰 번호 입력" />
            <button class="btn-sub">번호확인</button>
          </div>
          <div class="form-row">
            <label>포인트</label>
            <input v-model="point" type="number" min="0" />
            <button class="btn-sub" @click="useAllPoints">전액사용</button>
          </div>
          <div class="point-info">
            보유 포인트 {{ order.buyer.point.toLocaleString() }} / 5,000포인트 이상 보유 및 10,000원 이상 구매시 사용 가능
          </div>
        </section>
      </div>
      <!-- 오른쪽: 결제 요약/방법 -->
      <div class="payment-right">
        <section class="box">
          <h3>최종 결제금액</h3>
          <div class="summary-row">
            <span>상품가격</span>
            <span>{{ ((order.product.price * order.product.count) || 0).toLocaleString() }}원</span>
          </div>
          <div class="summary-row">
            <span>쿠폰 할인</span>
            <span>-{{ (couponDiscount || 0).toLocaleString() }}원</span>
          </div>
          <div class="summary-row">
            <span>포인트 사용</span>
            <span>-{{ (point || 0).toLocaleString() }}원</span>
          </div>
          <div class="summary-row">
            <span>배송비</span>
            <span>+{{ (order.delivery || 0).toLocaleString() }}원</span>
          </div>
          <div class="summary-total">
            <span>총 결제금액</span>
            <span class="total">{{ (totalPrice || 0).toLocaleString() }}원</span>
          </div>
          <div class="summary-point">
            {{ Math.floor((totalPrice || 0)/100) * 1 }} 포인트 적립예정
          </div>
        </section>
        <section class="box">
          <h3>결제 방법</h3>
          <div class="form-row">
            <!-- <label><input type="radio" v-model="payMethod" value="card" /> 신용카드</label>
            <label><input type="radio" v-model="payMethod" value="bank" /> 무통장 입금</label> -->
            <label><input type="radio" v-model="payMethod" value="payment" /> 토스페이</label>
            <!-- <label><input type="radio" v-model="payMethod" value="virtual" /> 가상계좌</label> -->
            <!-- <label><input type="radio" v-model="payMethod" value="phone" /> 핸드폰 결제</label> -->
          </div>
          <div v-if="payMethod==='bank'" class="form-row">
            <select>
              <option>신한은행: 0000-00-0000 테스트</option>
              <option>국민은행: 123-456-7890 홍길동</option>
            </select>
            <input placeholder="입금자명" />
          </div>
        </section>
        <section class="box">
          <div class="form-row">
            <label><input type="checkbox" v-model="agreeAll" @change="toggleAllAgree" /> 전체 동의</label>
          </div>
          <div class="form-row sub">
            <label><input type="checkbox" v-model="agreeList[0]" /> 구매조건 확인 및 결제진행에 동의</label>
          </div>
          <button class="btn-pay" :disabled="!canPay" @click="pay">결제하기</button>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
 .payment-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 40px 0 60px 0;
  }
  .payment-title {
    text-align: center;
    font-size: 2.2rem;
    font-weight: 700;
    margin-bottom: 32px;
  }
  .payment-content {
    display: flex;
    gap: 32px;
  }
  .payment-left, .payment-right {
    flex: 1;
    min-width: 340px;
  }
  .box {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px #0001;
    padding: 28px 24px 20px 24px;
    margin-bottom: 24px;
  }
  .product-info {
    display: flex;
    gap: 18px;
    align-items: center;
  }
  .product-img {
    width: 70px;
    height: 70px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #eee;
  }
  .product-name {
    font-weight: bold;
    font-size: 1.1rem;
    margin-bottom: 4px;
  }
  .product-count {
    font-size: 0.95rem;
    color: #888;
    margin-bottom: 4px;
  }
  .product-price {
    font-size: 1.1rem;
    color: #222;
  }
  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }
  .btn-edit {
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 4px 14px;
    font-size: 0.95rem;
    cursor: pointer;
  }
  .form-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }
  .form-row label {
    min-width: 70px;
    font-weight: 500;
  }
  .form-row input, .form-row select {
    flex: 1;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #ddd;
    font-size: 1rem;
  }
  .btn-sub {
    background: #e0e0e0;
    border: none;
    border-radius: 6px;
    padding: 6px 14px;
    font-size: 0.95rem;
    cursor: pointer;
  }
  .point-info {
    font-size: 0.92rem;
    color: #888;
    margin-top: 4px;
  }
  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
    font-size: 1rem;
  }
  .summary-total {
    display: flex;
    justify-content: space-between;
    font-size: 1.15rem;
    font-weight: bold;
    margin: 14px 0 6px 0;
  }
  .summary-total .total {
    color: #1976d2;
  }
  .summary-point {
    color: #1976d2;
    font-size: 0.98rem;
    margin-bottom: 4px;
  }
  .btn-pay {
    width: 100%;
    background: #1976d2;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 16px 0;
    font-size: 1.15rem;
    font-weight: bold;
    margin-top: 12px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .btn-pay:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  .form-row.sub {
    margin-left: 18px;
    font-size: 0.97rem;
  }

</style>
