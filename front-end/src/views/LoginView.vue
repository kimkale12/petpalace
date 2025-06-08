<template>
  <div class="auth-main">
    <div class="login-box">
      <h2>로그인</h2>
      <form @submit.prevent="handleLogin">
        <input v-model="email" type="email" placeholder="이메일" required />
        <input v-model="password" type="password" placeholder="비밀번호" required autocomplete="current-password" />
        <button type="submit">로그인</button>
      </form>
      <div class="auth-links">
        <router-link to="/find-id">아이디 찾기</router-link>
        <span> | </span>
        <router-link to="/find-password">비밀번호 찾기</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { authAPI } from '@/utils/api'

const email = ref('')
const password = ref('')
const userStore = useUserStore()
const router = useRouter()

const handleLogin = async () => {
  try {
    await userStore.login({ email: email.value, password: password.value })
    router.push('/')
  } catch (err) {
    alert('로그인 실패: ' + (err.response?.data?.message || err.message))
  }
}
</script>

<style scoped>
/* 위의 CSS를 여기에 붙여넣으세요 */
.login-box {
  width: 350px;
  margin: 120px auto 0 auto;
  padding: 32px 28px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.login-box h2 {
  text-align: center;
  margin-bottom: 24px;
  font-size: 1.6rem;
  font-weight: 700;
}
.login-box form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.login-box input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}
.login-box button[type="submit"] {
  background: #2ecc71;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.login-box button[type="submit"]:hover {
  background: #27ae60;
}

/* 부모 컨테이너(뷰 전체)를 중앙 정렬 */
.auth-main, .login-view, .login-container {
  min-height: calc(100vh - 70px); /* 헤더 높이만큼 빼기 */
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f7f7f7;
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