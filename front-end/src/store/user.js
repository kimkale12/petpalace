import { defineStore } from 'pinia'
import { authAPI } from '@/utils/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    userEmail: localStorage.getItem('userEmail') || null,
  }),
  actions: {
    async login({ email, password }) {
      try {
        // 1. 로그인 API 요청
        const res = await authAPI.login({ email, password })
        console.log('로그인 응답:', res.data) // 응답 구조 확인용

        // 2. 토큰 및 사용자 정보 저장
        if (res.data && res.data.token && res.data.user) {
          localStorage.setItem('token', res.data.token)
          this.isLoggedIn = true
          this.user = res.data.user
          this.userEmail = res.data.user.email
          localStorage.setItem('isLoggedIn', 'true')
          localStorage.setItem('user', JSON.stringify(res.data.user))
          localStorage.setItem('userEmail', res.data.user.email)
        } else {
          // 응답에 필요한 데이터가 없을 때
          alert('로그인에 실패했습니다. 서버 응답을 확인하세요.')
        }
      } catch (error) {
        // 에러 핸들링
        console.error('로그인 에러:', error)
        if (error.response && error.response.status === 400) {
          alert('이메일 또는 비밀번호를 확인하세요.')
        } else {
          alert('로그인 중 오류가 발생했습니다.')
        }
      }
    },
    logout() {
      this.isLoggedIn = false
      this.user = null
      this.userEmail = null
      localStorage.clear()
    }
  }
})