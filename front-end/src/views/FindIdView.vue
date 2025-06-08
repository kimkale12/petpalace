<template>
  <div class="findid-wrap">
    <div class="findid-box">
      <h2>아이디 찾기</h2>
      <form v-if="!codeSent" @submit.prevent="sendCode">
        <div class="form-row">
          <label>이메일</label>
          <input v-model="email" type="email" placeholder="가입한 이메일 입력" required />
        </div>
        <button class="btn-main" type="submit">인증코드 받기</button>
      </form>
      <form v-else @submit.prevent="verifyCodeAndFindId">
        <div class="form-row">
          <label>인증코드</label>
          <input v-model="inputCode" type="text" placeholder="인증코드 입력" required />
        </div>
        <button class="btn-main" type="submit">아이디 찾기</button>
      </form>
      <div v-if="foundId" class="result-box">
        <span>아이디: <b>{{ foundId }}</b></span>
      </div>
      <div v-if="errorMsg" class="result-box" style="color:#e53935;">
        <span>{{ errorMsg }}</span>
      </div>
      <div class="auth-links">
        <router-link to="/login">로그인</router-link>
        <span> | </span>
        <router-link to="/find-password">비밀번호 찾기</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'

const email = ref('')
const inputCode = ref('')
const foundId = ref('')
const errorMsg = ref('')
const codeSent = ref(false)

async function sendCode() {
  errorMsg.value = ''
  foundId.value = ''
  try {
    const res = await axios.post('/api/user/send-find-code', { email: email.value })
    if (res.data.success) {
      codeSent.value = true
      alert('이메일로 인증코드가 발송되었습니다.')
    } else {
      errorMsg.value = res.data.message
    }
  } catch (e) {
    errorMsg.value = '서버 오류가 발생했습니다.'
  }
}

async function verifyCodeAndFindId() {
  errorMsg.value = ''
  foundId.value = ''
  try {
    const res = await axios.post('/api/user/verify-find-code', { email: email.value, code: inputCode.value })
    if (res.data.success) {
      foundId.value = res.data.username
      alert('인증 성공! 아이디가 이메일로 발송되었습니다.')
    } else {
      errorMsg.value = res.data.message
    }
  } catch (e) {
    errorMsg.value = '서버 오류가 발생했습니다.'
  }
}
</script>


<style scoped>
.findid-wrap {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f7f7f7;
}
.findid-box {
  width: 400px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px #0001;
  padding: 32px 24px 28px 24px;
  text-align: center;
}
.findid-box h2 {
  margin-bottom: 18px;
  font-size: 1.3rem;
  font-weight: bold;
}
.form-row {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.form-row label {
  margin-bottom: 6px;
  font-weight: 500;
  text-align: left;
}
.form-row input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}
.btn-main {
  background: #2ecc71;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 0;
  font-size: 1.08rem;
  font-weight: bold;
  width: 100%;
  margin-top: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-main:hover {
  background: #2ecc71;
}
.result-box {
  margin-top: 18px;
  font-size: 1.08rem;
  color: #2ecc71;
}
.auth-links {
  margin-top: 18px;
  text-align: center;
  font-size: 0.98rem;
  color: #888;
}
.auth-links a {
  color: #2ecc71;
  text-decoration: none;
  margin: 0 4px;
}
.auth-links a:hover {
  text-decoration: underline;
}
</style> 