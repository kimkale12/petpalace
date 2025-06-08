import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import '@fortawesome/fontawesome-free/css/all.css'
import { useUserStore } from '@/store/user'

import VCalendar from 'v-calendar'
import 'v-calendar/style.css'

import './assets/css/auth.css'
import './assets/css/styles.css'

import axios from 'axios'

// axios 설정은 api.js에서 관리
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
// app.use(VCalendar, {})

// 로그인 상태 복원
// const userStore = useUserStore()
// userStore.restoreFromLocalStorage()

app.mount('#app')