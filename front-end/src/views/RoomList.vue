<template>
  <div class="room-list-section">
    <h2 class="room-title">객실 안내</h2>
    <div class="room-list">
      <div v-for="room in rooms" :key="room.id" class="room-card" @click="selectRoom(room)">
        <img :src="room.image" :alt="room.name" class="room-image" />
        <div class="room-info">
          <h3>{{ room.name }}</h3>
          <p>{{ room.description }}</p>
          <span class="room-price">{{ room.price.toLocaleString() }}원/일</span>
        </div>
      </div>
    </div>

    <!-- 객실 상세 모달 -->
    <div v-if="selectedRoom" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">×</button>
        <img :src="selectedRoom.image" :alt="selectedRoom.name" class="modal-image" />
        <div class="modal-info">
          <h2>{{ selectedRoom.name }}</h2>
          <p class="modal-description">{{ selectedRoom.longDescription }}</p>
          <div class="modal-details">
            <p><strong>수용 인원:</strong> {{ selectedRoom.capacity }}명</p>
            <p><strong>객실 크기:</strong> {{ selectedRoom.size }}㎡</p>
            <p><strong>침대:</strong> {{ selectedRoom.bedType }}</p>
          </div>
          <div class="modal-price">{{ selectedRoom.price.toLocaleString() }}원/일</div>
          <button class="modal-reserve-btn" @click="showReservationModal">예약하기</button>
        </div>
      </div>
    </div>

    <!-- 예약 모달 -->
    <ReservationModal
      v-if="isReservationModalOpen"
      :is-open="isReservationModalOpen"
      :room="selectedRoom"
      @close="closeReservationModal"
      @confirm="handleReservationConfirm"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import roomData from '@/data/rooms.json'
import ReservationModal from '@/components/reservation/ReservationModal.vue'

const router = useRouter()
const selectedRoom = ref(null)
const isReservationModalOpen = ref(false)
const rooms = roomData.rooms

const selectRoom = (room) => {
  selectedRoom.value = room
}

const closeModal = () => {
  selectedRoom.value = null
}

const showReservationModal = () => {
  isReservationModalOpen.value = true
}

const closeReservationModal = () => {
  isReservationModalOpen.value = false
}

const handleReservationConfirm = (reservationData) => {
  // 예약 데이터 처리
  console.log('Reservation confirmed:', reservationData)
  closeReservationModal()
  closeModal()
  router.push('/payment')
}
</script>

<style scoped>
  .room-title {
      font-size: 2.5rem;
      font-weight: 800;
      text-align: center;
      margin-bottom: 2rem;
      scroll-margin-top: 100px; /* 헤더 높이 + 여유 공간 */
  }

  .room-list-section {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 0;
  }

  .room-list {
      display: flex;
      gap: 32px;
      justify-content: center;
      flex-wrap: wrap;
  }

  .room-card {
      width: calc(33.33% - 32px);
      cursor: pointer;
      transition: transform 0.2s;
  }

  .room-card:hover {
      transform: translateY(-5px);
  }

  .room-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 8px;
  }

  .room-info {
      padding: 16px;
  }

  .room-info h3 {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 8px;
  }

  .room-info p {
      font-size: 14px;
      color: #666;
  }

  .room-info .room-price {
      font-size: 16px;
      font-weight: bold;
      color: #2e8b57;
  }

  /* 모달 스타일 */
  .modal-overlay {
      position: fixed;
      left: 0;
      top: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.4);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
  }

  .modal-content {
      background: white;
      padding: 30px;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      /* 화면 비율로 변경 */
      overflow-y: auto;
      position: relative;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      margin: 32px 0;
      /* 위아래 여백 추가 */
  }

  .modal-close {
      position: absolute;
      right: 16px;
      top: 12px;
      font-size: 24px;
      background: none;
      border: none;
      cursor: pointer;
  }

  .modal-image {
      width: 100%;
      height: 180px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 16px;
  }

  .modal-info {
      text-align: left;
  }

  .modal-info h2 {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 12px;
  }

  .modal-info .modal-description {
      font-size: 15px;
      color: #333;
      margin-bottom: 8px;
      text-align: left;
      white-space: pre-line;
  }

  .modal-info .modal-details {
      margin-bottom: 12px;
  }

  .modal-info .modal-details p {
      font-size: 14px;
      color: #666;
  }

  .modal-info .modal-details strong {
      font-weight: bold;
  }

  .modal-info .modal-price {
      font-size: 18px;
      color: #2e8b57;
      font-weight: bold;
  }

  .modal-reserve-btn {
      background-color: #22c55e;
      color: white;
      padding: 0.8rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.3s;
      width: 100%;
      margin-top: 1rem;
      font-size: 1.2rem;
  }

  .modal-reserve-btn:hover {
      background-color: #16a34a;
  }
</style>