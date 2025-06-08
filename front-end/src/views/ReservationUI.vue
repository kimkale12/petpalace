<template>
  <div class="reservation-container">
    <div class="reservation-form">
      <!-- 객실명 -->
      <h2 class="room-title">{{ room.name }}</h2>

      <!-- 이미지 -->
      <img :src="room.image" :alt="room.name" class="room-image" />

      <!-- 상세 설명 -->
      <p class="room-description">{{ room.longDescription }}</p>

      <!-- 날짜 선택 -->
      <div class="date-select">
        <label>체크인 날짜</label>
        <input type="date" v-model="checkInDate" :min="minDate" @change="calculateTotalPrice" />
        <label>체크아웃 날짜</label>
        <input type="date" v-model="checkOutDate" :min="checkInDate" @change="calculateTotalPrice" />
      </div>

      <!-- 가격 및 예약 버튼 -->
      <div class="form-actions">
        <p class="total-price">총 금액: {{ (totalPrice || 0).toLocaleString() }}원</p>
        <button type="button" @click="confirmReservation" :disabled="!canReserve" class="reserve-button">
          예약하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/utils/api'

const router = useRouter()
const props = defineProps({
  room: {
    type: Object,
    default: () => ({
      name: '스탠다드 룸',
      image: '/assets/images/standard-room.png',
      longDescription: '테스트용 객실 설명입니다.',
      price: 50000
    })
  }
})

const checkInDate = ref('')
const checkOutDate = ref('')

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const totalDays = computed(() => {
  if (!checkInDate.value || !checkOutDate.value) return 0
  const start = new Date(checkInDate.value)
  const end = new Date(checkOutDate.value)
  if (isNaN(start) || isNaN(end)) return 0
  const diffTime = end - start
  return diffTime > 0 ? Math.floor(diffTime / (1000 * 60 * 60 * 24)) : 0
})

const totalPrice = computed(() => {
  const price = Number(props.room?.price) || 0
  return price * totalDays.value
})

const canReserve = computed(() => {
  return checkInDate.value && checkOutDate.value && totalDays.value > 0
})

function calculateTotalPrice() {
  // 반응형 totalPrice 계산용 (별도 로직 필요 없음)
}

async function confirmReservation() {
  if (!canReserve.value) return
  try {
    // 1. 예약 정보를 DB에 저장
    const res = await axios.post('/api/reservations', {
      roomType: props.room.name,
      checkIn: checkInDate.value,
      checkOut: checkOutDate.value,
      totalPrice: totalPrice.value
    })
    const reservationId = res.data.id // 백엔드에서 반환하는 예약 ID

    alert('예약이 완료되었습니다.')
    console.log('예약 완료, 결제 페이지로 이동:', reservationId)
    // 2. 결제 페이지로 예약ID 전달
    router.push({ path: '/payment', query: { reservationId } })
  } catch (e) {
    alert('예약에 실패했습니다.')
  }
}
</script>

<style scoped>
.reservation-container {
  max-width: 500px;
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  font-family: 'Noto Sans KR', sans-serif;
}

.room-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.room-image {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
  height: 220px;
  margin-bottom: 1rem;
}

.room-description {
  font-size: 0.95rem;
  white-space: pre-line;
  margin-bottom: 1.5rem;
  color: #444;
}

.date-select label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: 500;
}

.date-select input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.total-price {
  font-weight: bold;
  font-size: 1rem;
  color: #2e8b57;
}

.reserve-button {
  background-color: #22c55e;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.reserve-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.reserve-button:hover:enabled {
  background-color: #16a34a;
}
</style> 