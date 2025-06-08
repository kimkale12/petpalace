<template>
    <div>
      <h2>문의 내용</h2>
      <table class="inquiry-table">
        <thead>
          <tr>
            <th>이름<br><span class="en">name</span></th>
            <th>이메일<br><span class="en">email</span></th>
            <th>연락처<br><span class="en">phone</span></th>
            <th>문의내용<br><span class="en">message</span></th>
            <th>객실<br><span class="en">room</span></th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="inq in inquiries" :key="inq.id">
            <td>{{ inq.name }}</td>
            <td>{{ inq.email }}</td>
            <td>{{ inq.phone }}</td>
            <td>{{ inq.message }}</td>
            <td>{{ inq.room }}</td>
            <td>{{ formatDateTime(inq.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from '@/utils/api'
  const inquiries = ref([])
  
  function formatDateTime(dateString) {
    const date = new Date(dateString)
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const hh = String(date.getHours()).padStart(2, '0')
    const min = String(date.getMinutes()).padStart(2, '0')
    const ss = String(date.getSeconds()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`
  }
  
  onMounted(async () => {
    const res = await axios.get('/inquiries')
    inquiries.value = res.data
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
    text-align: left;
  }
  .inquiry-table th {
    background: #f8f8f8;
    font-weight: bold;
  }
  .inquiry-table th .en {
    font-size: 0.8em;
    color: #888;
    font-weight: normal;
  }
  </style>