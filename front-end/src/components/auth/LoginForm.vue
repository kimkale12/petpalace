<template>
  <div class="auth-container">
    <div class="login-logo-title">
      <span class="logo-circle">
        <img src="/dog.svg" alt="로고" class="login-logo" />
      </span>
      <span class="login-title">펫펠리스</span>
    </div>
    <form @submit.prevent="handleSubmit" class="auth-form">
      <div class="form-group">
        <label for="email">이메일</label>
        <input 
          type="email" 
          id="email" 
          v-model="formData.email" 
          required
          placeholder="이메일"
          autocomplete="username"
          @input="emailError = ''"
        >
        <span v-if="emailError" class="error-message">{{ emailError }}</span>
      </div>

      <div class="form-group">
        <label for="password">비밀번호</label>
        <input 
          type="password" 
          id="password" 
          v-model="formData.password" 
          required
          autocomplete="current-password"
          @input="passwordError = ''"
        >
        <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
      </div>

      <div class="form-group">
        <label class="checkbox-label">
          <input 
            type="checkbox" 
            v-model="formData.remember"
          >
          <span>로그인 상태 유지</span>
        </label>
      </div>

      <button type="submit" class="submit-button">로그인</button>
    </form>
    <div class="auth-links">
      <router-link to="/find-id" class="forgot-id">아이디 찾기</router-link>
      <router-link to="/find-password" class="forgot-password">비밀번호 찾기</router-link>
      <p class="auth-link">
        계정이 없으신가요? <a href="#" @click.prevent="$emit('close', 'signup')">회원가입</a>
      </p>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/store/user'

export default {
  name: 'LoginForm',
  data() {
    return {
      formData: {
        email: '',
        password: '',
        remember: false
      },
      emailError: '',
      passwordError: ''
    }
  },
  methods: {
    async handleSubmit() {
      // 이메일 유효성 검사
      const email = this.formData.email.trim();
      if (!email || !/^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(email)) {
        this.emailError = '올바른 이메일 형식을 입력하세요';
        return;
      }
      // 비밀번호 유효성 검사: 8자리 이상, 공백 불가
      const password = this.formData.password;
      if (!password || /^\s+$/.test(password) || password.length < 8) {
        this.passwordError = '비밀번호는 8자리 이상 입력하세요';
        return;
      }
      try {
        const userStore = useUserStore()
        await userStore.login(this.formData)
        this.$emit('close')
        this.$router.push('/')
      } catch (error) {
        alert(error.message)
      }
    }
  }
}
</script>

<style scoped>
.login-logo-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 2rem;
}
.logo-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #21c200;
  border-radius: 50%;
  width: 48px;
  height: 48px;
}
.login-logo {
  width: 32px;
  height: 32px;
}
.login-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--primary-color);
}
.error-message {
  color: #ff4444;
  font-size: 0.95rem;
  margin-top: 0.2rem;
}
.auth-links {
  margin-top: 18px;
  text-align: center;
  font-size: 0.98rem;
  color: #888;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
}
.auth-links .forgot-id,
.auth-links .forgot-password {
  color: #2ecc71;
  text-decoration: none;
  margin: 0 4px;
}
.auth-links .forgot-id:hover,
.auth-links .forgot-password:hover {
  text-decoration: underline;
}
</style> 