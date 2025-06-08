<template>
    <div class="profile-box">
      <div class="profile-header">
        <div class="profile-img-wrap">
          <img :src="form.profileImg || defaultImg" class="profile-img" />
          <label class="img-upload-btn">
            <input type="file" accept="image/*" @change="onImgChange" style="display:none" />
            <span class="camera-icon">📷</span>
          </label>
        </div>
        <div class="profile-info">
          <div class="profile-email">{{ form.email }}</div>
          <button class="pw-btn" @click="showPwChange = true">비밀번호 변경</button>
        </div>
      </div>
      <form class="profile-form" @submit.prevent="saveProfile">
        <div class="form-row">
          <label>이름</label>
          <input v-model="form.name" required maxlength="20" />
        </div>
        <div class="form-row">
          <label>전화번호</label>
          <input v-model="form.phone" maxlength="20" />
        </div>
        <div class="form-row">
          <label>주소</label>
          <input v-model="form.address" maxlength="50" />
        </div>
        <div class="form-row">
          <label>자기소개</label>
          <textarea v-model="form.intro" maxlength="100" />
        </div>
        <div class="btn-group">
          <button type="button" class="btn cancel" @click="resetForm">취소</button>
          <button type="submit" class="btn save">저장</button>
        </div>
      </form>
      <PwChangeModal v-if="showPwChange" @close="showPwChange=false" />
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { getMyInfo, updateMyInfo, uploadProfileImg } from '@/api/userApi'
  import PwChangeModal from './PwChangeModal.vue'
  
  const defaultImg = '/img/profile-default.png'
  const showPwChange = ref(false)
  const form = reactive({
    name: '',
    email: '',
    phone: '',
    address: '',
    intro: '',
    profileImg: ''
  })
  let original = {}
  
  onMounted(async () => {
    const res = await getMyInfo()
    Object.assign(form, res.data)
    original = JSON.parse(JSON.stringify(form))
  })
  
  function resetForm() {
    Object.assign(form, original)
  }
  
  async function saveProfile() {
    await updateMyInfo(form)
    alert('저장되었습니다!')
    original = JSON.parse(JSON.stringify(form))
  }
  
  async function onImgChange(e) {
    const file = e.target.files[0]
    if (!file) return
    // 이미지 업로드 API 호출 (FormData 사용)
    const formData = new FormData()
    formData.append('profileImg', file)
    const res = await uploadProfileImg(formData)
    form.profileImg = res.data.url
  }
  </script>
  
  <style scoped>
  .profile-box {
    max-width: 600px;
    margin: 0 auto;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px #0001;
    padding: 40px 32px;
  }
  .profile-header {
    display: flex;
    align-items: center;
    gap: 32px;
    margin-bottom: 32px;
  }
  .profile-img-wrap {
    position: relative;
    width: 110px; height: 110px;
  }
  .profile-img {
    width: 110px; height: 110px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #eee;
  }
  .img-upload-btn {
    position: absolute; right: 0; bottom: 0;
    background: #f7f7f7;
    border-radius: 50%;
    padding: 8px;
    cursor: pointer;
    border: 1px solid #ddd;
  }
  .camera-icon {
    font-size: 1.2rem;
  }
  .profile-info {
    flex: 1;
  }
  .profile-email {
    font-size: 1.1rem;
    color: #888;
    margin-bottom: 8px;
  }
  .pw-btn {
    background: none;
    border: none;
    color: #1abc6e;
    font-weight: bold;
    cursor: pointer;
    font-size: 1rem;
    text-decoration: underline;
  }
  .profile-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .form-row {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .form-row label {
    width: 90px;
    font-weight: 500;
  }
  .form-row input, .form-row textarea {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
  }
  .form-row textarea {
    min-height: 48px;
    resize: vertical;
  }
  .btn-group {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 24px;
  }
  .btn {
    padding: 10px 28px;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    border: none;
  }
  .btn.save {
    background: #1abc6e;
    color: #fff;
  }
  .btn.cancel {
    background: #e0e0e0;
    color: #333;
  }
  </style>