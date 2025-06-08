<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="closeModal">×</button>
      <h2>{{ room.name }} 예약</h2>
      <img :src="room.image" :alt="room.name" class="room-image" />

      <div class="modal-details">
        <div class="form-group">
          <label>객실 설명</label>
          <p>{{ room.longDescription }}</p>
        </div>
        <div class="date-select-group">
          <div class="form-group">
            <label>체크인</label>
            <div class="calendar-wrapper">
              <DatePicker
                v-model="checkInDate"
                :min-date="minDate"
                :max-date="checkOutDate"
                @update:model-value="updateCheckIn"
                class="calendar"
              />
            </div>
          </div>
          <div class="form-group">
            <label>체크아웃</label>
            <div class="calendar-wrapper">
              <DatePicker
                v-model="checkOutDate"
                :min-date="checkInDate"
                @update:model-value="updateCheckOut"
                class="calendar"
              />
            </div>
          </div>
        </div>
        <div class="form-group">
          <p class="total-price">예약 날짜 : {{ checkInDate ? formatDate(checkInDate) : '체크인 날짜' }} ~ {{ checkOutDate ? formatDate(checkOutDate) : '체크아웃 날짜' }}</p>
          <p class="total-price">총 금액 : {{ (totalPrice || 0).toLocaleString() }}원</p>
        </div>
      </div>
      <div class="modal-actions">
        <button @click="confirmReservation" class="confirm-button" :disabled="!canReserve">예약 확정</button>
        <button @click="closeModal" class="cancel-button">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { DatePicker } from 'v-calendar'
import 'v-calendar/style.css'
import { useRouter } from 'vue-router'
import { reservationAPI } from '@/utils/api'
import { useUserStore } from '@/store/user'
import axios from 'axios'

const router = useRouter()
const userStore = useUserStore()
const props = defineProps({ isOpen: Boolean, room: Object })
const emit = defineEmits(['close', 'confirm'])

const checkInDate = ref(null)
const checkOutDate = ref(null)
const totalPrice = ref(0)

const minDate = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
})

const canReserve = computed(() => checkInDate.value && checkOutDate.value && totalPrice.value > 0)

const updateCheckIn = (date) => {
  checkInDate.value = date
  if (date && checkOutDate.value) {
    const days = (new Date(checkOutDate.value) - new Date(date)) / (1000 * 60 * 60 * 24)
    const price = Number(props.room?.price) || 0
    totalPrice.value = price * (days > 0 ? days : 0)
  }
}
const updateCheckOut = (date) => {
  checkOutDate.value = date
  if (date && checkInDate.value) {
    const days = (new Date(date) - new Date(checkInDate.value)) / (1000 * 60 * 60 * 24)
    const price = Number(props.room?.price) || 0
    totalPrice.value = price * (days > 0 ? days : 0)
  }
}

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
}

const closeModal = () => {
  // 모달 닫기 및 상태 초기화
  checkInDate.value = null
  checkOutDate.value = null
  totalPrice.value = 0
  emit('close')
}

const confirmReservation = async () => {
  if (!checkInDate.value || !checkOutDate.value) {
    alert('체크인과 체크아웃 날짜를 모두 선택해 주세요.');
    return;
  }
  if (!canReserve.value) return;
  try {
    const userId = userStore.user?.id || localStorage.getItem('userId');
    const payload = {
      order_id: 'ORDER_' + Date.now(),
      user_id: userId,
      roomType: props.room.name,
      checkIn: checkInDate.value ? new Date(checkInDate.value).toISOString().slice(0, 10) : null,
      checkOut: checkOutDate.value ? new Date(checkOutDate.value).toISOString().slice(0, 10) : null,
      totalPrice: totalPrice.value,
      status: 'pending'
    };
    console.log('예약 생성 payload:', payload);

    const res = await axios.post('/api/reservations', payload);
    if (res.data && res.data.id) {
      closeModal();
      router.push({ path: '/payment', query: { reservationId: res.data.id } });
    }
  } catch (error) {
    console.error('예약 생성 에러:', error);
    alert('예약 생성 중 오류가 발생했습니다.');
  }
}

// 모달이 열릴 때마다 상태 초기화
watch(() => props.isOpen, (val) => {
  if (val) {
    checkInDate.value = null
    checkOutDate.value = null
    totalPrice.value = 0
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}
.modal-content h2 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
.modal-close {
  position: absolute;
  right: 1rem;
  top: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}
.room-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}
.modal-details {
  margin: 1rem 0;
}
.form-group {
  margin-bottom: 1.5rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
  font-size: 1.1rem;
}
.date-select-group {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}
.date-select-group .form-group {
  flex: 1;
  margin-bottom: 0;
}
.date-select-group .form-group label {
  text-align: center;
}
.calendar-wrapper {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  width: fit-content;
  margin: 0 auto;
}
.calendar {
  width: 100%;
}
.selected-date {
  padding: 0.8rem;
  background-color: #f8f9fa;
  border-top: 1px solid #ddd;
  font-size: 0.9rem;
  color: #333;
  text-align: center;
}
.total-price {
  font-size: 1.2rem;
  color: #4CAF50;
  font-weight: bold;
  margin: 0;
}
.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}
.confirm-button, .cancel-button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}
.confirm-button {
  background-color: #4CAF50;
  color: white;
}
.confirm-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
.confirm-button:not(:disabled):hover {
  background-color: #45a049;
}
.cancel-button {
  background-color: #f5f5f5;
  color: #333;
}
.cancel-button:hover {
  background-color: #e0e0e0;
}
</style>