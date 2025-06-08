<template>
  <div class="myinfo-main">
    <div class="sidebar">
      <ul>
        <li :class="{active: tab==='status'}" @click="tab='status'">객실 예약 현황</li>
        <li :class="{active: tab==='cancel'}" @click="tab='cancel'">회원관리</li>
        <li :class="{active: tab==='profile'}" @click="tab='profile'">매출액 현황</li>
        <li :class="{active: tab==='findpw'}" @click="tab='findpw'">업데이트 로그</li>
      </ul>
    </div>
    <div class="content">
      <div v-if="tab==='status'">
        <h2>객실예약 현황</h2>
        <table class="reservation-table">
          <thead>
            <tr>
              <th>예약자</th>
              <th>객실</th>
              <th>체크인</th>
              <th>체크아웃</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in reservations" :key="r.id">
              <td>{{ r.User?.name || '-' }}</td>
              <td>{{ r.roomType }}</td>
              <td>{{ r.checkIn }}</td>
              <td>{{ r.checkOut }}</td>
              <td>{{ r.status }}</td>
              <td>
                <button v-if="r.status==='pending'" @click="confirm(r.id)">확정</button>
                <button v-if="r.status!=='canceled'" @click="cancel(r.id)">취소</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="error" class="error-message">{{ error }}</div>
      </div>
      <div v-else-if="tab==='cancel'">
        <h2>회원관리</h2>
        <!-- 예약 취소 내역/버튼 등 -->
      </div>
      <div v-else-if="tab==='profile'">
        <h2>매출액 현황</h2>
        <!-- 기존 form 내용 복사 -->
      </div>
      <div v-else-if="tab==='findpw'">
        <h2>업데이트 로그</h2>
        <!-- 비밀번호 찾기 폼 등 -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '@/utils/api'

const reservations = ref([])
const error = ref('')
const tab = ref('status') // 기본값: 객실 예약 현황

async function fetchReservations() {
  try {
    const res = await axios.get('/admin/reservations')
    reservations.value = Array.isArray(res.data) ? res.data : (res.data.reservations || [])
  } catch (e) {
    error.value = '예약 목록을 불러올 수 없습니다.'
    console.error('예약 목록 API 에러:', e)
  }
}

async function confirm(id) {
  await axios.put(`/admin/reservations/${id}/confirm`)
  fetchReservations()
}

async function cancel(id) {
  await axios.put(`/admin/reservations/${id}/cancel`)
  fetchReservations()
}

onMounted(fetchReservations)

// 예시: 취소된 예약은 7일 이내만 표시
import { differenceInDays, parseISO } from 'date-fns'
const now = new Date()
const filteredReservations = computed(() =>
  Array.isArray(reservations.value)
    ? reservations.value.filter(r => {
        if (r.status !== 'canceled') return true
        const canceledAt = r.updatedAt || r.canceledAt
        if (!canceledAt) return false
        return differenceInDays(now, parseISO(canceledAt)) < 7
      })
    : []
)
</script>

<style scoped>
.myinfo-main {
  display: flex;
  min-height: calc(100vh - 70px);
  background: #f7f7f7;
}
.sidebar {
  width: 220px;
  background: #fff;
  border-radius: 16px 0 0 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  margin: 70px 0 70px 70px;
  padding: 32px 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar li {
  padding: 18px 32px;
  cursor: pointer;
  font-size: 1.1rem;
  color: #333;
  border-left: 4px solid transparent;
  transition: background 0.2s, border-color 0.2s;
}
.sidebar li.active {
  background: #f0f8f4;
  border-left: 4px solid #2ecc71;
  color: #1abc6e;
  font-weight: bold;
}
.content {
  flex: 1;
  margin: 70px 70px 70px 0;
  padding: 32px 28px;
  background: #fff;
  border-radius: 0 16px 16px 0;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.reservation-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
}
.reservation-table th, .reservation-table td {
  border: 1px solid #eee;
  padding: 10px 8px;
  text-align: center;
}
.reservation-table th {
  background: #f8f8f8;
}
button {
  margin: 0 4px;
  padding: 6px 16px;
  border-radius: 6px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  background: #1abc6e;
  color: #fff;
}
button:hover {
  background: #16a34a;
}
.error-message {
  color: #e53935;
  margin-top: 24px;
  font-weight: bold;
  text-align: center;
}
</style> 