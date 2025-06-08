<template>
  <div class="my-card-section">
    <div class="my-card">
      <div class="my-card-title">나의 게시글</div>
      <ul class="my-card-list">
        <li><router-link to="/my/inquiry">1:1문의</router-link></li>
        <li><router-link to="/my/product-inquiry">상품문의</router-link></li>
        <li><router-link to="/my/review">상품후기</router-link></li>
      </ul>
    </div>
  </div>
</template>

<script setup>
// 별도의 JS 코드 필요 없음
</script>

<style scoped>
.my-card-section {
  margin-top: 32px;
  display: flex;
  justify-content: flex-start;
}

.my-card {
  background: #f8f8f8;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  padding: 24px 28px;
  min-width: 220px;
  max-width: 260px;
  margin-left: 0;
  margin-right: auto;
}

.my-card-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 18px;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
}

.my-card-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.my-card-list li {
  margin-bottom: 12px;
}

.my-card-list li:last-child {
  margin-bottom: 0;
}

.my-card-list a,
.my-card-list .router-link-active {
  color: #333;
  text-decoration: none;
  font-size: 1rem;
  padding: 8px 0;
  display: block;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
  cursor: pointer;
}

.my-card-list a:hover,
.my-card-list .router-link-active {
  background: #e0f5e9;
  color: #2ecc71;
}
</style>