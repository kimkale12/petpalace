<template>
  <div class="signup-main">
    <div class="signup-box">
      <h2>회원가입</h2>
      <form @submit.prevent="onSubmit">
        <!-- 아이디 -->
        <label>아이디</label>
        <div class="row">
          <input v-model="form.username" placeholder="아이디" :disabled="idChecked" autocomplete="username" />
          <button type="button" class="check-btn" @click="checkUsername" :disabled="idChecked">중복체크</button>
        </div>
        <div v-if="idMessage" :class="{'success-msg': idAvailable, 'error-msg': !idAvailable}">{{ idMessage }}</div>

        <!-- 이메일 -->
        <label>이메일</label>
        <div class="row">
          <input v-model="form.email" placeholder="이메일" :disabled="emailChecked" autocomplete="email" />
          <button type="button" class="check-btn" @click="checkEmail" :disabled="emailChecked">중복체크</button>
        </div>
        <div v-if="emailMessage" :class="{'success-msg': emailAvailable, 'error-msg': !emailAvailable}">{{ emailMessage }}</div>

        <!-- 비밀번호 -->
        <div class="row2">
          <div>
            <label>비밀번호</label>
            <input type="password" v-model="form.password" placeholder="비밀번호" autocomplete="new-password" />
          </div>
          <div>
            <label>비밀번호 확인</label>
            <input type="password" v-model="form.passwordConfirm" placeholder="비밀번호 확인" autocomplete="new-password" />
          </div>
        </div>

        <!-- 이름 -->
        <label>이름</label>
        <input v-model="form.name" placeholder="이름" autocomplete="name" />

        <!-- 전화번호 -->
        <label>전화번호</label>
        <input v-model="form.phone" placeholder="010-2345-6789" autocomplete="tel" />

        <!-- 주소 -->
        <label>주소</label>
        <div class="row">
          <input v-model="form.address" placeholder="주소" autocomplete="street-address" />
          <button type="button" class="check-btn" @click="openPostcode">검색</button>
        </div>

        <!-- 에러 메시지 -->
        <div v-if="errorMessage" class="error-msg">{{ errorMessage }}</div>

        <!-- 회원가입 버튼 -->
        <button type="submit" class="signup-btn">회원가입</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/utils/api'

const router = useRouter()

const form = ref({
  username: '',
  email: '',
  password: '',
  passwordConfirm: '',
  name: '',
  phone: '',
  address: ''
})

const idChecked = ref(false)
const idAvailable = ref(false)
const idMessage = ref('')

const emailChecked = ref(false)
const emailAvailable = ref(false)
const emailMessage = ref('')

const errorMessage = ref('')

// 아이디 중복체크
const checkUsername = async () => {
  idMessage.value = ''
  idAvailable.value = false
  try {
    // 실제 API 경로에 맞게 수정
    const res = await authAPI.checkUsername(form.value.username)
    if (res.data.available) {
      idAvailable.value = true
      idChecked.value = true
      idMessage.value = '사용 가능한 아이디입니다.'
    } else {
      idAvailable.value = false
      idMessage.value = '이미 사용 중인 아이디입니다.'
    }
  } catch (e) {
    idAvailable.value = false
    idMessage.value = '서버 오류'
  }
}

// 이메일 중복체크
const checkEmail = async () => {
  emailMessage.value = ''
  emailAvailable.value = false
  try {
    await authAPI.checkEmail(form.value.email)
    emailAvailable.value = true
    emailChecked.value = true
    emailMessage.value = '사용 가능한 이메일입니다.'
  } catch (e) {
    emailAvailable.value = false
    if (e.response && e.response.status === 409) {
      emailMessage.value = '이미 사용 중인 이메일입니다.'
    } else {
      emailMessage.value = '이메일 중복 확인 중 오류가 발생했습니다.'
    }
  }
}

// 주소 검색
const openPostcode = () => {
  if (!window.daum || !window.daum.Postcode) {
    alert('주소 검색 기능을 불러오지 못했습니다.');
    return;
  }
  new window.daum.Postcode({
    oncomplete: (data) => {
      form.value.address = data.roadAddress || data.jibunAddress
    }
  }).open()
}

// 회원가입
const onSubmit = async () => {
  errorMessage.value = ''
  if (!idChecked.value || !idAvailable.value) {
    errorMessage.value = '아이디 중복체크를 해주세요.'
    return
  }
  if (!emailChecked.value || !emailAvailable.value) {
    errorMessage.value = '이메일 중복체크를 해주세요.'
    return
  }
  if (form.value.password !== form.value.passwordConfirm) {
    errorMessage.value = '비밀번호가 일치하지 않습니다.'
    return
  }
  try {
    await authAPI.signup({
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      name: form.value.name,
      phone: form.value.phone,
      address: form.value.address
    })
    alert('회원가입이 완료되었습니다!')
    router.push('/login')
  } catch (e) {
    errorMessage.value = e.response?.data?.message || '서버 오류'
  }
}

// 주소 검색 스크립트 로드
if (!window.daum) {
  const script = document.createElement('script')
  script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
  document.body.appendChild(script)
}
</script>

<style scoped>
.signup-main {
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
}
.signup-box {
  background: #fff;
  /* padding: 1.2rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1); */
}
h2 {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  font-weight: bold;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
label {
  font-weight: 600;
  color: #333;
}
input {
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}
.row, .row2 {
  display: flex;
  gap: 8px;
  align-items: stretch;
}
.row input, .row2 input {
  flex: 1;
}
.row .check-btn, .row2 .check-btn {
  height: 100%;
}
.success-msg {
  color: #4CAF50;
  font-size: 0.95rem;
  margin-top: -8px;
  margin-bottom: 4px;
}
.error-msg {
  color: #e53935;
  font-size: 0.95rem;
  margin-top: -8px;
  margin-bottom: 4px;
}
.check-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}
.check-btn:disabled {
  background: #bdbdbd;
  cursor: not-allowed;
}
.check-btn:hover:enabled {
  background: #388e3c;
}
.signup-btn {
  width: 100%;
  background: #4CAF50;
  color: white;
  border: none;
  padding: 0.9rem;
  font-size: 1.1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1.2rem;
}
.signup-btn:hover {
  background: #388e3c;
}
</style>
