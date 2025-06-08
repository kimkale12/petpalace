<script setup>
function closePopup() {
  window.close()
}
</script>

<template>
  <div class="payment-result fail">
    <h2>정기결제 등록 실패</h2>
    <p>빌링키 발급에 실패했습니다.<br>잠시 후 다시 시도해 주세요.</p>
    <button class="btn" @click="closePopup">창 닫기</button>
  </div>
</template>
  
  <style scoped>
  .payment-result.cancel {
    max-width: 400px;
    margin: 120px auto;
    padding: 32px 24px;
    background: #fff8f6;
    border-radius: 16px;
    text-align: center;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  }
  h2 { color: #e53935; }
  .btn {
    display: inline-block;
    margin-top: 24px;
    padding: 12px 24px;
    background: #e53935;
    color: #fff;
    border-radius: 6px;
    text-decoration: none;
    font-weight: bold;
  }
  </style>