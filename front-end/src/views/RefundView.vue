<template>
  <div>
    <h2>환불 처리</h2>
    <table class="refund-table">
      <thead>
        <tr>
          <th>환불번호</th>
          <th>예약자</th>
          <th>금액</th>
          <th>환불상태</th>
          <th>요청일</th>
          <th>처리일</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="refund in refunds" :key="refund.id">
          <td>{{ refund.id }}</td>
          <td>{{ refund.user }}</td>
          <td>{{ refund.amount.toLocaleString() }}원</td>
          <td>{{ refund.status }}</td>
          <td>{{ formatDate(refund.requestedAt) }}</td>
          <td>{{ refund.processedAt ? formatDate(refund.processedAt) : '-' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const refunds = ref([
  { id: 1, user: '홍길동', amount: 50000, status: '대기', requestedAt: '2024-06-01', processedAt: null },
  { id: 2, user: '김철수', amount: 70000, status: '완료', requestedAt: '2024-05-28', processedAt: '2024-05-29' },
])
function formatDate(date) {
  if (!date) return '-'
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
</script>

<style scoped>
.refund-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
}
.refund-table th, .refund-table td {
  border: 1px solid #eee;
  padding: 12px 8px;
  text-align: center;
}
.refund-table th {
  background: #f8f8f8;
  font-weight: bold;
}
</style> 