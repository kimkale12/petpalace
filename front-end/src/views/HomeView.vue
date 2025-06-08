<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <h2>당신의 소중한 가족을 위한<br>최고의 휴식 공간</h2>
        <p>24시간 전문 케어와 프리미엄 시설로<br>반려견의 행복한 휴가를 약속드립니다</p>
        <button @click="scrollToRooms" class="cta-button">지금 예약하기</button>
      </div>
    </section>

    <section id="services" class="services">
      <h2>서비스 안내</h2>
      <div class="service-grid">
        <div class="service-card">
          <i class="fas fa-home"></i>
          <h3>프리미엄 객실</h3>
          <p>넓은 공간과 쾌적한 환경의 객실</p>
        </div>
        <div class="service-card">
          <i class="fas fa-dog"></i>
          <h3>전문 케어</h3>
          <p>수의사와 전문 트레이너의 24시간 케어</p>
        </div>
        <div class="service-card">
          <i class="fas fa-utensils"></i>
          <h3>맞춤 식단</h3>
          <p>반려견의 건강을 고려한 맞춤형 식단</p>
        </div>
        <div class="service-card">
          <i class="fas fa-shower"></i>
          <h3>그루밍 서비스</h3>
          <p>전문가의 프리미엄 그루밍 서비스</p>
        </div>
      </div>
    </section>

    <!-- 객실 섹션 -->
    <section id="rooms" class="room-list-section">
      <RoomList />
    </section>

    <!-- 서비스 섹션 -->
    <!-- <section class="service-section" ref="serviceSection">
      <ServiceList />
    </section> -->
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
// import RoomCard from '@/components/reservation/RoomCard.vue'
// import RoomList from '@/components/reservation/RoomList.vue'
// import ContactForm from '@/components/ContactForm.vue'
import { useRoute } from 'vue-router'
// import HeroSection from '@/components/home/HeroSection.vue'
// import ServiceList from '@/components/service/ServiceList.vue'
import RoomList from '@/views/RoomList.vue'

const route = useRoute()
const selectedRoom = ref(null)
const contactSection = ref(null)
const roomSection = ref(null)
const serviceSection = ref(null)

const rooms = [
  {
    name: '스탠다드 룸',
    description: '기본적인 편의시설이 갖춰진 쾌적한 공간',
    longDescription: `
  스탠다드 룸은 소형견을 위한 기본적인 편의시설을 완비한 실용적인 공간입니다. 아늑한 구조로 반려견이 안심하고 머물 수 있으며, 개별 칸막이와 환기 시스템을 통해 쾌적한 환경이 유지됩니다. 1일 단기 투숙부터 며칠 간의 이용에도 적합한 객실입니다.
  
  ※ 소형견 기준 8kg 이하의 반려견만 입실 가능합니다.
  
  ⚠️ 주의사항
  - 입질이 심하거나 공격 성향이 있는 반려견은 입실이 제한될 수 있습니다.
  - 1마리 기준 객실이며, 2마리 이상은 추가 요금이 발생할 수 있습니다.
  `.trim(),
    price: 50000,
    image: './assets/images/standard-room.png',
  },
  {
    name: '디럭스 룸',
    description: '넓은 공간과 프리미엄 시설이 갖춰진 공간',
    longDescription: `
  디럭스 룸은 중형견 또는 소형견 다견 가정을 위한 넉넉한 공간과 프리미엄 시설을 갖춘 객실입니다. 미끄럼 방지 바닥재, 조용한 조명, 독립 공기 순환 시스템 등이 마련되어 있어 반려견의 스트레스를 줄이고, 장기 숙박에도 적합합니다.
  
  ※ 중형견 기준 8~20kg 사이의 반려견, 또는 2마리 이상의 소형견이 적합합니다.
  
  ⚠️ 주의사항
  - 공격성, 입질이 심한 반려견은 보호자의 안전을 위해 입실이 불가합니다.
  - 객실 내 CCTV는 선택 사항입니다.
  - 반려견의 짖음, 파손 등으로 인한 피해 발생 시 별도 비용이 청구될 수 있습니다.
  `.trim(),
    price: 80000,
    image: './assets/images/deluxe-room.png',
  },
  {
    name: '스위트 룸',
    description: '최상의 편의시설과 프라이빗한 공간',
    longDescription: `
  스위트 룸은 최고의 설비와 완전 독립된 프라이빗 공간을 제공하는 최고급 객실로, 대형견을 포함한 모든 반려견에게 적합합니다. CCTV 모니터링, 방음 설계, 전용 매트와 식기류까지 갖춰져 있으며, 장기 투숙 시 맞춤 관리 서비스도 제공됩니다.
  
  ※ 대형견 기준 20kg 이상의 반려견도 편안하게 이용할 수 있는 전용 객실입니다.
  
  ⚠️ 주의사항
  - 입질 또는 과도한 짖음, 공격성 등 문제 행동이 있는 반려견은 입실이 불가합니다.
  - 입실 전 건강 확인 절차(예: 접종 기록, 피부질환 유무 등)가 있습니다.
  - 퇴실 시 룸 상태 점검 후 이상 발생 시 추가 청소비용이 청구될 수 있습니다.
  `.trim(),
    price: 120000,
    image: './assets/images/suite-room.png',
  },
]

const openModal = (room) => {
  selectedRoom.value = room
}

const closeModal = () => {
  selectedRoom.value = null
}

const scrollToContact = () => {
  const element = document.getElementById('contactPet')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const scrollToRooms = () => {
  const el = document.querySelector('.room-title')
  if (el) {
    const headerHeight = 80 // 헤더 높이
    const offset = 20 // 추가 여백
    const elementPosition = el.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight - offset
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

// URL 파라미터에 따른 스크롤 처리
const handleSectionScroll = () => {
  const section = route.query.section
  if (section === 'rooms') {
    setTimeout(() => {
      const el = document.querySelector('.room-title')
      if (el) {
        const headerHeight = 80 // 헤더 높이
        const offset = 20 // 추가 여백
        const elementPosition = el.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight - offset
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }, 300)
  }
}

// URL 파라미터 변경 감지
watch(() => route.query.section, () => {
  handleSectionScroll()
})

onMounted(() => {
  handleSectionScroll()
})
</script>

<style scoped>
.hero {
  height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
                url('assets/images/hotel.jpg') center/cover;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
}

/* .hero {
    height: 100vh;
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
                url('https://via.placeholder.com/1920x1080') center/cover;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
    padding-top: 80px;
} */


.hero-content {
  max-width: 800px;
  padding: 0 20px;
}

.hero h2 {
  font-size: 3rem;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.hero p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2.5rem;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1.2rem;
  transition: background-color 0.3s;
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.cta-button:hover {
  background-color: #45a049;
}

.services {
  padding: 80px 20px;
  background-color: #f5f5f5;
}

.services h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #333;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.service-card {
  background: white;
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.service-card:hover {
  transform: translateY(-5px);
}

.service-card i {
  font-size: 2.5rem;
  color: #4CAF50;
  margin-bottom: 1rem;
}

.service-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.service-card p {
  color: #666;
  line-height: 1.6;
}

.room-list-section {
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.room-title {
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
}

.room-list-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 0;
}

.room-list {
  display: flex;
  gap: 32px;
  justify-content: center;
  flex-wrap: wrap;
}

.modal-overlay {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  position: relative;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.modal-close {
  position: absolute;
  right: 16px;
  top: 12px;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
}

.modal-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 12px;
}

.modal-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 16px;
}

.modal-description {
  font-size: 15px;
  color: #333;
  margin-bottom: 8px;
  text-align: left;
  white-space: pre-line;
}

.modal-price {
  font-size: 18px;
  color: #2e8b57;
  font-weight: bold;
}

.contact-section {
  scroll-margin-top: 80px; /* 헤더 높이만큼 여백 추가 */
  scroll-behavior: smooth;
  background: #f5f5f5;
}
</style>