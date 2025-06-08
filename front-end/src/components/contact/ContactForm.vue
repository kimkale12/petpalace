<template>
  <div class="contact-container">
    <h2 class="section-title">문의하기</h2>
    <div class="content-wrapper">
      <div class="location-section">
        <div id="map"></div>
        <div class="directions">
          <div class="directions-content">
            <p>주소: 서울 강남구 테헤란로4길 38-5 4층</p>
            <ul>
              <li>지하철 2호선 역삼역 3번 출구 도보 5분</li>
              <li>주차 가능(건물 내 주차장 이용)</li>
              <li>버스: 146, 341, 360, 740 등 다수 노선</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="contact-form">
        <form @submit.prevent="handleSubmit" class="form-container">
          <div class="form-group">
            <label for="name">이름</label>
            <input 
              type="text" 
              id="name" 
              v-model="formData.name" 
              required 
              placeholder="이름을 입력해주세요"
            >
          </div>

          <div class="form-group">
            <label for="email">이메일</label>
            <input 
              type="email" 
              id="email" 
              v-model="formData.email" 
              required 
              placeholder="이메일을 입력해주세요"
            >
          </div>

          <div class="form-group">
            <label for="phone">연락처</label>
            <input 
              type="tel" 
              id="phone" 
              v-model="formData.phone" 
              required 
              placeholder="연락처를 입력해주세요"
            >
          </div>

          <div class="form-group">
            <label for="message">문의내용</label>
            <textarea 
              id="message" 
              v-model="formData.message" 
              required 
              placeholder="문의하실 내용을 입력해주세요"
              rows="5"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="room">객실 선택</label>
            <select id="room" v-model="formData.room" required>
              <option value="">객실을 선택하세요</option>
              <option value="스탠다드">스탠다드</option>
              <option value="디럭스">디럭스</option>
              <option value="스위트">스위트</option>
            </select>
          </div>

          <button type="submit" class="submit-button">문의하기</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import axios from '@/utils/api'

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  message: '',
  room: ''
})

const handleSubmit = async () => {
  if (!formData.room) {
    alert('객실을 선택해 주세요.');
    return;
  }
  try {
    await axios.post('/inquiries', formData)
    alert('문의가 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.')
    formData.name = ''
    formData.email = ''
    formData.phone = ''
    formData.message = ''
    formData.room = ''
  } catch (e) {
    alert('문의 접수에 실패했습니다. 다시 시도해 주세요.')
    console.error(e)
  }
}

// 구글맵 초기화
onMounted(() => {
  if (!window.google || !window.google.maps) {
    const script = document.createElement('script');
    script.src =
      'https://maps.googleapis.com/maps/api/js?key="키입력"';
    script.async = true;
    window.initMap = initMap;
    document.head.appendChild(script);
  } else {
    initMap();
  }
})

function initMap() {
  const location = { lat: 0, lng: 0 };
  const map = new window.google.maps.Map(document.getElementById('map'), {
    zoom: 17,
    center: location,
  });
  new window.google.maps.Marker({
    position: location,
    map: map,
    title: '강아지 호텔 (서울 강남구)',
  });
}
</script>

<style scoped>
.contact-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
  /* margin-top: 70px; */
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
}

.content-wrapper {
  display: flex;
  gap: 2rem;
  align-items: stretch;
  padding: 2rem 1rem;
}

.location-section, .contact-form {
  flex: 1;
  display: flex;
  flex-direction: column;
}

#map {
  width: 100%;
  height: 350px;
  margin-bottom: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.directions {
  width: 100%;
}

.directions-content {
  background: #4caf50;
  color: #fff;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
}

.directions-content p {
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.directions-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.directions-content li {
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
}

.form-container {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem
}

.form-group {
  /* margin-bottom: 1.5rem; */
}

.form-group:last-child {
  margin-bottom: 0;
}

label {
  display: block;
  /* margin-bottom: 0.5rem; */
  font-weight: 600;
  color: #333;
}

input, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #2e8b57;
  box-shadow: 0 0 0 2px rgba(46, 139, 87, 0.1);
}

.submit-button {
  width: 100%;
  padding: 1rem;
  background-color: #2e8b57;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #246b47;
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }
  
  .location-section, .contact-form {
    width: 100%;
  }
}

.form-group select {
  width: 100%;
  height: 48px;         /* 높이 조절 */
  padding: 0 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  margin-top: 6px;      /* 라벨과의 간격 */
  margin-bottom: 8px;   /* 아래 요소와의 간격 */
  background: #fff;
  appearance: none;     /* 기본 화살표 스타일 제거(선택) */
}
</style> 