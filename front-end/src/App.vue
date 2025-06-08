<script setup>
import Header from './components/common/Header.vue'
import Footer from './components/common/Footer.vue'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoginModal from '@/views/LoginModal.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import SignupForm from '@/components/auth/SignupForm.vue'

const showLoginModal = ref(false)
const showSignupModal = ref(false)
const route = useRoute()
const router = useRouter()

// 라우터 경로에 따라 모달 자동 오픈
watch(
  () => route.path,
  (path) => {
    showLoginModal.value = path === '/login'
    showSignupModal.value = path === '/signup'
  },
  { immediate: true }
)

// 모달 닫기 시 홈으로 이동
function closeLoginModal(type) {
  showLoginModal.value = false
  if (type === 'signup') {
    router.replace('/signup')
  } else {
    router.replace('/')
  }
}
function closeSignupModal() {
  showSignupModal.value = false
  router.replace('/')
}
</script>

<template>
  <div id="app">
    <Header />
    <div class="header-spacer"></div>
    <router-view/>
    <Footer />
    <!-- 로그인/회원가입 모달 -->
    <LoginModal :visible="showLoginModal" @close="closeLoginModal">
      <LoginForm @close="closeLoginModal" />
    </LoginModal>
    <LoginModal :visible="showSignupModal" @close="closeSignupModal">
      <SignupForm @close="closeSignupModal" />
    </LoginModal>
  </div>
</template>

<style>
:root {
  --primary-color: #2ecc71;
  --secondary-color: #27ae60;
  --text-color: #333;
  --background-color: #f5f5f5;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Noto Sans KR', sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--background-color);
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.router-view {
  flex: 1;
  padding: 2rem;
}
</style>
