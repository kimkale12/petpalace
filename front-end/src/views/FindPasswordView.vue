<template>
  <div class="findpw-wrap">
    <div class="findpw-box">
      <h2>비밀번호 찾기</h2>
      <form @submit.prevent="findPassword">
        <div class="form-row">
          <label>아이디</label>
          <input v-model="userid" type="text" placeholder="아이디 입력" required />
        </div>
        <div class="form-row">
          <label>이메일</label>
          <div class="email-verify">
            <input v-model="email" type="email" placeholder="가입한 이메일 입력" required />
            <button type="button" class="btn-verify" @click="sendVerificationCode" :disabled="isSending">
              {{ isSending ? `${countdown}초` : '인증번호 발송' }}
            </button>
          </div>
        </div>
        <div class="form-row" v-if="showVerificationInput">
          <label>인증번호</label>
          <div class="verify-input">
            <input v-model="verificationCode" type="text" placeholder="인증번호 입력" required />
            <button type="button" class="btn-verify" @click="verifyCode" :disabled="isVerifying">
              {{ isVerifying ? '확인 중...' : '확인' }}
            </button>
          </div>
        </div>
        <button class="btn-main" type="submit" :disabled="!isVerified">임시 비밀번호 발급</button>
      </form>
      <div v-if="tempPassword" class="result-box">
        <span>임시 비밀번호: <b>{{ tempPassword }}</b></span>
        <div class="desc">로그인 후 반드시 비밀번호를 변경해 주세요.</div>
      </div>
      <div class="auth-links">
        <router-link to="/login">로그인</router-link>
        <span> | </span>
        <router-link to="/find-id">아이디 찾기</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const userid = ref('')
const email = ref('')
const tempPassword = ref('')
const verificationCode = ref('')
const isSending = ref(false)
const isVerifying = ref(false)
const showVerificationInput = ref(false)
const isVerified = ref(false)
const countdown = ref(180)
let timer = null

async function sendVerificationCode() {
  if (!email.value) {
    alert('이메일을 입력해주세요.')
    return
  }

  try {
    isSending.value = true
    const response = await axios.post('/api/user/send-find-code', {
      email: email.value
    })
    
    if (response.data.success) {
      showVerificationInput.value = true
      startCountdown()
      alert('인증번호가 이메일로 발송되었습니다.')
    }
  } catch (error) {
    alert('인증번호 발송에 실패했습니다.')
    console.error(error)
  } finally {
    isSending.value = false
  }
}

async function verifyCode() {
  if (!verificationCode.value) {
    alert('인증번호를 입력해주세요.')
    return
  }

  try {
    isVerifying.value = true
    const response = await axios.post('/api/user/verify-find-code', {
      email: email.value,
      code: verificationCode.value
    })

    if (response.data.success) {
      isVerified.value = true
      alert('인증이 완료되었습니다.')
      clearInterval(timer)
    } else {
      alert('인증번호가 일치하지 않습니다.')
    }
  } catch (error) {
    alert('인증에 실패했습니다.')
    console.error(error)
  } finally {
    isVerifying.value = false
  }
}

function startCountdown() {
  countdown.value = 180
  clearInterval(timer)
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(timer)
      isSending.value = false
      showVerificationInput.value = false
      isVerified.value = false
    }
  }, 1000)
}

async function findPassword() {
  if (!isVerified.value) {
    alert('이메일 인증을 완료해주세요.')
    return
  }

  try {
    const response = await axios.post('/api/user/find-password', {
      userid: userid.value,
      email: email.value
    })

    if (response.data.success) {
      tempPassword.value = response.data.tempPassword
    } else {
      alert('일치하는 정보가 없습니다.')
    }
  } catch (error) {
    alert('비밀번호 찾기에 실패했습니다.')
    console.error(error)
  }
}
</script>

<style scoped>
.findpw-wrap {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f7f7f7;
}
.findpw-box {
  width: 400px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px #0001;
  padding: 32px 24px 28px 24px;
  text-align: center;
}
.findpw-box h2 {
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
  color: #e53935;
}
.result-box .desc {
  margin-top: 8px;
  font-size: 0.98rem;
  color: #888;
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
.email-verify {
  display: flex;
  gap: 8px;
}
.verify-input {
  display: flex;
  gap: 8px;
}
.btn-verify {
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0 16px;
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
}
.btn-verify:hover:not(:disabled) {
  background: #1565c0;
}
.btn-verify:disabled {
  background: #ccc;
  cursor: not-allowed;
}
input[type="email"] {
  flex: 1;
}
</style> 