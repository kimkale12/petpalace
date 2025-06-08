<template>
  <ReservationUI :room="currentRoom" />
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { differenceInDays, parseISO } from 'date-fns'
import axios from 'axios'
import { useUserStore } from '@/store/user'
import ReservationUI from './ReservationUI.vue'
import { loadTossPayments } from '@tosspayments/payment-sdk'
import { reservationAPI } from '@/utils/api'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const roomList = [
  {
    name: '스탠다드 룸',
    image: '/assets/images/standard-room.png',
    longDescription: '테스트용 객실 설명입니다.',
    price: 50000
  },
  {
    name: '디럭스 룸',
    image: '/assets/images/deluxe-room.png',
    longDescription: '테스트용 객실 설명입니다.',
    price: 70000
  },
  {
    name: '스위트 룸',
    image: '/assets/images/suite-room.png',
    longDescription: '테스트용 객실 설명입니다.',
    price: 100000 
  }
  // ... (다른 객실)
]

const initialRoomIdx = (() => {
  const name = route.query.name
  if (!name) return 0
  const idx = roomList.findIndex(r => r.name === name)
  return idx !== -1 ? idx : 0
})()

const currentRoomIdx = ref(initialRoomIdx)
const currentRoom = computed(() => roomList[currentRoomIdx.value])

const checkInDate = ref('')
const checkOutDate = ref('')
const isLoading = ref(true)

const totalDays = computed(() => {
  if (!checkInDate.value || !checkOutDate.value) return 0
  const start = parseISO(checkInDate.value)
  const end = parseISO(checkOutDate.value)
  if (isNaN(start) || isNaN(end)) return 0
  return differenceInDays(end, start) || 0
})
const totalRoomPrice = computed(() => (currentRoom.value?.price ?? 0) * totalDays.value)
const canReserve = computed(() => totalDays.value > 0)

const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

const customerKey = route.query.customerKey || 'user_1234'
const reservationId = route.query.reservationId
const order = ref(null)
const orderNumber = ref('') // 주문번호

const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY

// 객실명-1박 가격 매핑
const roomPriceMap = {
  '스탠다드 룸': 50000,
  '디럭스 룸': 70000,
  '스위트 룸': 100000
}

onMounted(async () => {
  if (!reservationId) {
    alert('예약 정보가 없습니다.')
    router.push('/')
    return
  }

  try {
    const res = await reservationAPI.getDetail(reservationId)
    console.log('예약상세:', res.data)
    const roomType = res.data.roomType
    const checkIn = res.data.checkIn
    const checkOut = res.data.checkOut

    // 방어 코드
    if (!roomType || !checkIn || !checkOut) {
      alert('예약 정보(roomType, checkIn, checkOut)가 올바르지 않습니다. 관리자에게 문의하세요.')
      console.error('roomType:', roomType, 'checkIn:', checkIn, 'checkOut:', checkOut)
      router.push('/')
      return
    }

    const pricePerNight = roomPriceMap[roomType] || 0
    if (pricePerNight === 0) {
      alert(`알 수 없는 객실명(roomType: ${roomType})입니다. 관리자에게 문의하세요.`)
    }
    // 체크인~체크아웃 날짜 차이 계산 (박수)
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    let nights = 1
    if (!isNaN(checkInDate) && !isNaN(checkOutDate)) {
      const diffTime = checkOutDate - checkInDate
      nights = diffTime > 0 ? Math.floor(diffTime / (1000 * 60 * 60 * 24)) : 1
    }
    order.value = {
      product: {
        name: roomType,
        price: pricePerNight,
        count: nights,
        image: '/assets/images/standard-room.png',
        option: `${checkIn} ~ ${checkOut}`
      },
      buyer: {
        name: res.data.User?.name || '예약자',
        phone: res.data.User?.phone || '-',
        email: res.data.User?.email || '-',
        point: Number(res.data.User?.point) || 0
      },
      receiver: {
        name: res.data.User?.name || '예약자',
        phone: res.data.User?.phone || '-',
        address: '-'
      },
      delivery: Number(res.data.delivery) || 0,
      memo: ''
    }
  } catch (error) {
    console.error('예약 정보 조회 중 오류 발생:', error)
    alert(error.response?.data?.error || '예약 정보를 불러오지 못했습니다.')
    router.push('/')
  } finally {
    isLoading.value = false
  }
})

const coupon = ref(1000)
const couponCode = ref('')
const point = ref(0)
const payMethod = ref('bank')
const agreeAll = ref(false)
const agreeDetail = ref(false)

const totalPrice = computed(() => {
  if (!order.value) return 0
  // 수량 * 가격 - 쿠폰 - 포인트 + 배송비
  return order.value.product.price * order.value.product.count - coupon.value - point.value + order.value.delivery
})

const canPay = computed(() => agreeAll.value && agreeDetail.value && totalPrice.value > 0)

function applyCoupon() {
  alert('쿠폰이 적용되었습니다.')
}
function useAllPoints() {
  if (order.value && order.value.buyer) {
    point.value = order.value.buyer.point
  }
}

async function pay() {
  if (!canPay.value) return;
  orderNumber.value = 'ORDER-' + Math.floor(Math.random() * 1000000000)
  const storeName = order.value?.storeName || '펫팰리스'
  const productName = order.value?.product?.name || ''
  const orderAmount = totalPrice.value

  console.log('결제정보:', { storeName, orderNumber: orderNumber.value, productName, orderAmount })

  const tossPayments = await loadTossPayments(clientKey)
  tossPayments.requestBillingAuth('카드', {
    customerKey: customerKey,
    successUrl: window.location.origin + '/payment/success-delay'
      + `?storeName=${encodeURIComponent(storeName)}`
      + `&orderNumber=${orderNumber.value}`
      + `&productName=${encodeURIComponent(productName)}`
      + `&orderAmount=${orderAmount}`,
    failUrl: window.location.origin + '/payment/fail'
  })
}

const reserveRoom = async () => {
  if (!canReserve.value) return;
  if (!isLoggedIn) {
    alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
    closeModal();
    router.push('/login');
    return;
  }
  isLoading.value = true
  try {
    const orderId = 'ORDER_' + Date.now()
    const amount = totalPrice.value
    const productName = currentRoom.value.name
    const buyerName = userStore.user?.name || '테스트'
    const buyerEmail = userStore.user?.email || 'test@naver.com'
    const res = await axios.post('/api/payment/payment/ready', {
      orderId, amount, productName, buyerName, buyerEmail,
      checkInDate: checkInDate.value,
      checkOutDate: checkOutDate.value
    })
    console.log('결제 준비 요청:', { orderId, amount, productName, buyerName, buyerEmail, checkInDate: checkInDate.value, checkOutDate: checkOutDate.value });
    console.log('결제 준비 응답:', res.data);
    // 오직 결제창 팝업만 띄움
    window.open(res.data.paymentUrl, '_blank', 'width=500,height=700')
    // 내정보로 이동시키는 코드 없음!
  } catch (err) {
    alert('결제 준비 중 오류가 발생했습니다.')
    console.error('결제 준비 에러:', err)
  } finally {
    isLoading.value = false
  }
}

function closeModal() {
  router.back()
}

function toggleRoom() {
  currentRoomIdx.value = (currentRoomIdx.value + 1) % roomList.length
}

function onOverlayClick() {
  closeModal()
}
</script>