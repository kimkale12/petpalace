<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import dogLogo from '@/assets/images/dog.svg'

const router = useRouter()
const userStore = useUserStore()

// 드롭다운 메뉴 상태
const showUserMenu = ref(false)
function toggleUserMenu() { showUserMenu.value = !showUserMenu.value }
function closeUserMenu() { showUserMenu.value = false }
function goTo(menu) {
  closeUserMenu()
  if (menu === 'myinfo') router.push('/myinfo')
  else if (menu === 'find-id') router.push('/find-id')
  else if (menu === 'find-password') router.push('/find-password')
  else if (menu === 'coupon-point') router.push('/coupon-point')
  else if (menu === 'logout') {
    if (confirm('로그아웃 하시겠습니까?')) {
      userStore.logout()
      router.push('/')
    }
  }
}
function logout() {
  if (confirm('로그아웃 하시겠습니까?')) {
    userStore.logout()
    router.push('/')
  }
}
function toggleMenu() {
  const navMenu = document.querySelector('.nav-menu');
  navMenu.classList.toggle('active');
}
</script>

<template>
  <header class="header">
    <nav class="nav-container">
      <a href="#" @click.prevent="router.push('/')">
        <div class="logo">
          <div class="logo-icon">
            <img :src="dogLogo" alt="펫팰리스 로고" />
          </div>
          <h1>펫팰리스</h1>
        </div>
      </a>
      <ul class="nav-menu">
        <li><router-link to="/">홈</router-link></li>
        <li><router-link to="/service">서비스</router-link></li>
        <li><router-link to="/contact">문의하기</router-link></li>
        <li><router-link to="/board">게시판</router-link></li>
        <li v-if="userStore.user && userStore.user.role === 'admin'">
          <router-link to="/admin/dashboard">관리자</router-link>
        </li>
        <li v-if="!userStore.isLoggedIn">
          <a href="#" @click.prevent="router.push('/login')">로그인</a>
        </li>
        <li v-if="!userStore.isLoggedIn">
          <a href="#" @click.prevent="router.push('/signup')">회원가입</a>
        </li>
        <li v-if="userStore.isLoggedIn"><router-link to="/myinfo">내정보</router-link></li>
        <!-- <li v-if="userStore.isLoggedIn"><router-link to="/my/product-inquiry">쇼핑몰</router-link></li> -->
       
        <li v-if="userStore.isLoggedIn"><a href="#" @click.prevent="logout">로그아웃</a></li>
      </ul>
      <div class="header-icons" v-if="userStore.isLoggedIn" style="display:inline-flex;align-items:center;gap:16px;position:relative;">
        <!-- 사람모양 아이콘 -->
        <span style="cursor:pointer;display:inline-flex;position:relative;" @click="toggleUserMenu" title="내정보">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="4" stroke="#222" stroke-width="2"/>
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="#222" stroke-width="2" fill="none"/>
          </svg>
          <!-- 드롭다운 메뉴 -->
          <div v-if="showUserMenu" class="user-dropdown-modal" @click.self="closeUserMenu">
            <ul class="user-dropdown-list">
              <li @click="goTo('myinfo')">내정보</li>
              <li @click="goTo('find-id')">아이디 찾기</li>
              <li @click="goTo('find-password')">비밀번호 찾기</li>
              <li @click="goTo('coupon-point')">쿠폰/포인트 확인</li>
              <li @click="goTo('logout')">로그아웃</li>
            </ul>
          </div>
        </span>
        <!-- 종모양 아이콘 -->
        <span style="cursor:pointer;display:inline-flex;" @click="alert('알림이 없습니다.')" title="알림">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 16v-5a6 6 0 10-12 0v5l-1 1v1h14v-1l-1-1z" stroke="#222" stroke-width="2" fill="none"/>
            <circle cx="12" cy="20" r="1.5" fill="#222"/>
          </svg>
        </span>
      </div>
      <div class="hamburger" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  </header>
</template>

<style scoped>
/* ... 기존 스타일 ... */
.user-dropdown-modal {
  position: absolute;
  right: 0;
  top: 40px;
  z-index: 100;
}
.user-dropdown-list {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px #0002;
  padding: 8px 0;
  min-width: 160px;
  list-style: none;
  margin: 0;
}
.user-dropdown-list li {
  padding: 12px 20px;
  cursor: pointer;
  font-size: 1rem;
  color: #222;
  transition: background 0.15s;
}
.user-dropdown-list li:hover {
  background: #f5f5f5;
  color: #1976d2;
}
</style>