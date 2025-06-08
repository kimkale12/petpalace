<template>
  <div class="location-container">
    <hr/>
    <h2>오시는길</h2>
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
</template>

<script>
export default {
  name: 'LocationView',
  mounted() {
    // 구글맵 스크립트가 이미 있으면 중복 삽입 방지
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key="키입력"';
      script.async = true;
      window.initMap = this.initMap;
      document.head.appendChild(script);
    } else {
      this.initMap();
    }
  },
  methods: {
    initMap() {
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
    },
  },
};
</script>

<style scoped>
.location-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem 1rem;
  margin-top: 80px;
}
h2 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 2rem;
}
#map {
  width: 100%;
  height: 400px;
  margin-bottom: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.directions {
  width: 100%;
}
.directions-content {
  background: #4caf50;
  color: #fff;
  padding: 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
}
.directions h3 {
  margin: 0;
  padding: 1rem 0 0.5rem 0;
  color: #a00;
  border-bottom: 2px solid #a00;
  background: #fff;
  border-radius: 10px 10px 0 0;
}
</style>