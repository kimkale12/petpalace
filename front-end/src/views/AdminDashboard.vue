<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h2 class="dashboard-title">관리자 대시보드</h2>
      <div class="dashboard-actions">
        <router-link to="/admin/reservations" class="btn green">예약 관리</router-link>
        <router-link to="/admin/payments" class="btn green-outline">문의 관리</router-link>
      </div>
    </div>
    <div class="dashboard-cards">
      <div class="card" style="background:#fff;">
        <h3>스탠다드 룸 예약</h3>
        <p>{{ stats.standard }}건</p>
      </div>
      <div class="card" style="background:#e6f4ea;">
        <h3>디럭스 룸 예약</h3>
        <p>{{ stats.deluxe }}건</p>
      </div>
      <div class="card" style="background:#d0f5e7;">
        <h3>스위트 룸 예약</h3>
        <p>{{ stats.suite }}건</p>
      </div>
    </div>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/utils/api'


  
const stats = ref({ standard: 0, deluxe: 0, suite: 0 })
const error = ref('')

onMounted(async () => {
  try {
    const res = await axios.get('/api/admin/reservations/stats')
    stats.value = res.data
  } catch (e) {
    error.value = '예약 통계 정보를 불러올 수 없습니다.'
    console.error('대시보드 API 에러:', e)
  }
})

</script>

<style scoped>
.admin-dashboard {
  padding: 32px;
  background: #f8f8f8;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: bold;
}

.dashboard-actions {
  display: flex;
  gap: 1rem;
}

.dashboard-cards {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}
.card {
  flex: 1;
  border-radius: 12px;
  box-shadow: 0 2px 8px #0001;
  padding: 24px;
  text-align: center;
}
.btn {
  padding: 12px 32px;
  border-radius: 8px;
  font-weight: bold;
  text-decoration: none;
  display: inline-block;
}
.green {
  background: #1abc6e;
  color: #fff;
}
.green-outline {
  background: #fff;
  color: #1abc6e;
  border: 2px solid #1abc6e;
}
.error-message {
  color: #e53935;
  margin-top: 24px;
  font-weight: bold;
  text-align: center;
}
</style> 