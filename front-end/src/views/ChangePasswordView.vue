<template>
    <div class="change-password">
      <h2>비밀번호 변경</h2>
      <form @submit.prevent="changePassword">
        <input type="password" v-model="currentPassword" placeholder="현재 비밀번호" />
        <input type="password" v-model="newPassword" placeholder="새 비밀번호" />
        <input type="password" v-model="confirmPassword" placeholder="새 비밀번호 확인" />
        <button type="submit">변경하기</button>
        <p class="error" v-if="errorMessage">{{ errorMessage }}</p>
        <p class="success" v-if="successMessage">{{ successMessage }}</p>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  
  const currentPassword = ref('')
  const newPassword = ref('')
  const confirmPassword = ref('')
  const errorMessage = ref('')
  const successMessage = ref('')
  
  const changePassword = async () => {
    errorMessage.value = ''
    successMessage.value = ''
  
    if (newPassword.value !== confirmPassword.value) {
      errorMessage.value = '새 비밀번호가 일치하지 않습니다.'
      return
    }
  
    try {
      const res = await axios.put('/api/user/change-password', {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value
      })
      successMessage.value = res.data.message
      currentPassword.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
    } catch (err) {
      errorMessage.value = err.response?.data?.message || '오류가 발생했습니다.'
    }
  }
  </script>
  
  <style scoped>
  input {
    display: block;
    margin: 0.5rem 0;
  }
  .error {
    color: red;
  }
  .success {
    color: green;
  }
  </style>
  