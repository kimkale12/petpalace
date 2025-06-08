// 내정보 수정 페이지

<template>
  <div class="myinfo-main">
    <div class="info-box">
      <h2>내 정보</h2>
      <form>
        <div class="form-row">
          <label>아이디</label>
          <input type="text" v-model="form.username" />
        </div>
        <div class="form-row">
          <label>이름</label>
          <input type="text" v-model="form.name" />
        </div>
        <div class="form-row">
          <label>이메일</label>
          <input type="email" v-model="form.email" />
        </div>
        <div class="form-row">
          <label>전화번호</label>
          <input type="text" v-model="form.phone" />
        </div>
        <div class="form-row">
          <label>주소</label>
          <div style="display: flex; gap: 8px; flex:1;">
            <input type="text" v-model="form.address" readonly style="flex:1;" />
            <button type="button" class="btn save" @click="openPostcode" style="padding: 0 12px;">검색</button>
          </div>
        </div>
        <div class="form-row">
          <label>새 비밀번호</label>
          <input type="password" v-model="form.newPassword" placeholder="새 비밀번호 입력" />
        </div>
        <div class="form-row">
          <label>비밀번호 확인</label>
          <input type="password" v-model="form.newPasswordConfirm" placeholder="비밀번호 확인" />
        </div>
        <div class="btn-group">
          <button type="button" class="btn save" @click="saveInfo">저장</button>
          <button type="button" class="btn cancel" @click="cancelEdit">취소</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import axios from 'axios'

const userStore = useUserStore()
const form = reactive({
  username: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  newPassword: '',
  newPasswordConfirm: ''
})
const originalForm = {}

// API 경로를 /api/users/me로 통일
async function getMyInfo() {
  return axios.get('/api/users/me', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
}
async function updateMyInfo(data) {
  return axios.put('/api/users/me', data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
}

onMounted(async () => {
  try {
    const res = await getMyInfo()
    // username이 null이면 new_id, userid 등 다른 컬럼을 우선적으로 보여줌
    form.username = res.data.username || res.data.new_id || res.data.userid || ''
    form.name = res.data.name || ''
    form.email = res.data.email || ''
    form.phone = res.data.phone || ''
    form.address = res.data.address || ''
    if (userStore.user) {
      Object.assign(originalForm, JSON.parse(JSON.stringify(userStore.user)))
    }
  } catch (e) {
    alert('내 정보 불러오기 실패')
  }
})

async function saveInfo() {
  // 아이디 유효성 검사
  if (!/^[a-zA-Z0-9]{4,16}$/.test(form.username)) {
    alert('아이디는 4~16자의 영문/숫자만 가능합니다.');
    return;
  }
  if (form.newPassword || form.newPasswordConfirm) {
    if (form.newPassword !== form.newPasswordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
  }
  try {
    await updateMyInfo({
      username: form.username,
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      password: form.newPassword ? form.newPassword : undefined
    });
    alert('저장되었습니다!');
    window.location.href = '/';
  } catch (e) {
    if (e.response?.status === 409) {
      alert('이미 사용 중인 아이디입니다.');
    } else {
      alert('저장에 실패했습니다.');
    }
  }
}

function cancelEdit() {
  Object.assign(form, originalForm)
}

function openPostcode() {
  // 다음 주소 API 스크립트가 없으면 동적으로 추가
  if (!window.daum || !window.daum.Postcode) {
    const script = document.createElement('script')
    script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.onload = showPostcode
    document.body.appendChild(script)
  } else {
    showPostcode()
  }
}

function showPostcode() {
  new window.daum.Postcode({
    oncomplete: function(data) {
      form.address = data.roadAddress || data.jibunAddress
    }
  }).open()
}
</script>

<style scoped>
.myinfo-main {
  min-height: calc(100vh - 70px);
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f7f7f7;
}
.info-box {
  width: 450px;
  margin: 70px auto;
  padding: 32px 28px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.info-box h2 {
  text-align: center;
  margin-bottom: 24px;
  font-size: 1.6rem;
  font-weight: 700;
}
.info-box form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.info-box input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}
.btn-group {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 16px;
}
.btn {
  flex: 1;
  padding: 12px 0;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
}
.btn.save {
  background-color: #2ecc71;
  color: white;
}
.btn.save:hover {
  background-color: #27ae60;
}
.btn.cancel {
  background-color: #e0e0e0;
  color: #333;
}
.btn.cancel:hover {
  background-color: #d5d5d5;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}
.form-row label {
  width: 100px;
  min-width: 90px;
  font-weight: 500;
  margin-bottom: 0;
}
.form-row input,
.form-row > .address-row {
  flex: 1;
}
.address-row {
  display: flex;
  gap: 8px;
  width: 100%;
}
.address-row input {
  flex: 1;
}
.address-row .btn {
  padding: 0 12px;
  white-space: nowrap;
}
</style>
