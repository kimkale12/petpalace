<template>
  <div>
    <h2>결제 관련 문의 내역</h2>
    <table class="inquiry-table">
      <thead>
        <tr>
          <th>문의번호</th>
          <th>이름</th>
          <th>이메일</th>
          <th>연락처</th>
          <th>문의내용</th>
          <th>객실</th>
          <th>접수일</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="inq in inquiries" :key="inq.id">
          <td>{{ inq.id }}</td>
          <td>{{ inq.name }}</td>
          <td>{{ inq.email }}</td>
          <td>{{ inq.phone }}</td>
          <td>{{ inq.message }}</td>
          <td>{{ inq.room }}</td>
          <td>{{ formatDate(inq.createdAt) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/utils/api'
const inquiries = ref([])

function formatDate(date) {
  if (!date) return '-'
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

onMounted(async () => {
  try {
    const res = await axios.get('/inquiries')
    inquiries.value = res.data
  } catch (e) {
    console.error('문의내역 불러오기 실패:', e)
  }
})
</script>

<style scoped>
.inquiry-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
}
.inquiry-table th, .inquiry-table td {
  border: 1px solid #eee;
  padding: 12px 8px;
  text-align: center;
}
.inquiry-table th {
  background: #f8f8f8;
  font-weight: bold;
}
</style> 