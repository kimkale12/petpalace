<template>
  <div class="service-page">
    <h2 class="section-title">서비스 안내</h2>
    <div class="service-image-wrap">
      <img src="/assets/images/service-room.jpg" alt="호텔 서비스 예시" class="service-image" />
    </div>
    <div class="service-content">
      <div class="service-main">
        <h2 class="service-subtitle">24시간 셀프 체크인, CCTV 확인이 가능한 반려견 호텔링 서비스</h2>
        <p>
          나의 소중한 반려견. 안전하고 쾌적하게 호캉스를 보내고 싶으시다면, 저희 펫펠리스 반려견 호텔링 서비스를 이용해보세요.<br><br>
          잠시라도 떨어지고 싶지 않은데 호텔 운영시간에 가서 맡겨야 해서 몇시간 먼저 맡겨야하는 단점 없이 새벽시간대에도 마음놓고 입실이 가능합니다.<br><br>
          맡긴 이후에도 내 강아지가 잘 있는지 호텔에 일일히 연락해서 물어보지 마세요! 저희 펫펠리스는 견주분이 직접 매장 및 호텔룸 내부 CCTV를 보실 수 있습니다(통신망 이용 시 데이터 요금이 과다하게 청구 될 수 있으니 꼭 WIFI 환경에서 이용하시는게 좋습니다).<br><br>
          소중한 반려견들을 위해 블루 세스코 멤버스에 가입하여 매장 내 및 해충이 발생 할 수 있는 매장 앞 하수구까지 정기적으로 관리를 받고 있으며,<br><br>
          매장 내 UV Led가 장착되어 바이러스까지 살균되는 대형 공기청정기 및 다수의 공기청정기 또한 구비하고 있습니다.
        </p>
      </div>
      <aside class="service-aside">
        <h3>이용 안내</h3>
        <ul class="check-info">
          <li>- <b>Check-in</b> : <span class="checkin">10:00</span></li>
          <li>- <b>Check-out</b> : <span class="checkout">19:00</span></li>
        </ul>
        <div class="aside-desc">
          <p>체크인은 24시간 직접 가능합니다.<br>
          체크아웃 기준 시간은 19시 이며,<br>
          초과 시 요금이 추가 청구 될 수 있습니다.</p>
          <p>유인 운영시간 내 호텔이용을 원하시는 고객분들은<br>
          매장으로 전화주셔서 객실 이용 가능 여부 확인하시고<br>
          바로 방문주시면 되시고, 20시 이후 무인운영시간에<br>
          호텔 이용을 원하시는 고객분들은 홈페이지에서 예약 진행하시고<br>
          방문하시면 됩니다.</p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
// 별도 스크립트 필요 없음
</script>

<style scoped>
.service-page {
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

.service-content {
  display: flex;
  gap: 48px;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}
.service-main {
  flex: 2;
  min-width: 320px;
}
.service-subtitle {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
}
.service-main p {
  font-size: 1rem;
  color: #222;
  line-height: 1.7;
}
.service-aside {
  flex: 1;
  min-width: 220px;
  background: #fafbfc;
  border-radius: 12px;
  padding: 1.5rem 1.2rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  margin-top: 0.5rem;
}
.service-aside h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: left;
}
.check-info {
  list-style: none;
  padding: 0;
  margin-bottom: 1rem;
}
.check-info li {
  font-size: 1rem;
  margin-bottom: 0.3rem;
}
.checkin { color: #e53935; font-weight: bold; }
.checkout { color: #e53935; font-weight: bold; }
.aside-desc p {
  font-size: 0.97rem;
  color: #444;
  margin-bottom: 0.7rem;
}
.service-image-wrap {
  text-align: center;
}
.service-image {
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}
</style> 