<template>
  <div class="product-detail">
    <div class="product-main">
      <!-- 상품 이미지 -->
      <div class="product-image">
        <img src="@/assets/images/dentalbar.jpg" alt="메디코펫 데일리 덴탈바" />
      </div>
      <!-- 상품 정보 -->
      <div class="product-info">
        <h1 class="product-title">메디코펫 데일리 덴탈바 가스트로인테스티날</h1>
        <div class="product-price">57,000원</div>
        <ul class="product-meta">
          <li>구매혜택 <span class="meta-desc">570 톡스 캐시 적립예정</span></li>
          <li>배송 방법 <span class="meta-desc">택배</span></li>
          <li>배송비 <span class="meta-desc">3,500원 (100,000원 이상 무료배송)</span></li>
        </ul>
        <!-- 수량 선택 -->
        <div class="quantity-box">
          <span>수량</span>
          <div class="quantity-control">
            <button @click="decreaseQty" :disabled="quantity <= 1">-</button>
            <span>{{ quantity }}</span>
            <button @click="increaseQty">+</button>
          </div>
          <span class="item-price">{{ formatPrice(unitPrice * quantity) }}</span>
        </div>
        <!-- 총 상품금액 -->
        <div class="total-price-box">
          <span>총 상품금액({{ quantity }}개)</span>
          <span class="total-price">{{ formatPrice(unitPrice * quantity) }}</span>
        </div>
        <!-- 구매 버튼들 -->
        <div class="action-buttons">
          <button class="buy-btn">구매하기</button>
          <button class="gift-btn">🎁 선물하기</button>
          <button class="cart-btn">장바구니</button>
        </div>
        <button class="quick-buy-btn">
          <span>💬 간편구매</span>
        </button>
      </div>
    </div>
    <!-- 문의 floating 버튼 -->
    <button class="inquiry-btn">문의</button>
  </div>
</template>

<script>
export default {
  name: 'ProductDetail',
  data() {
    return {
      quantity: 1,
      unitPrice: 57000
    }
  },
  methods: {
    increaseQty() {
      this.quantity += 1
    },
    decreaseQty() {
      if (this.quantity > 1) this.quantity -= 1
    },
    formatPrice(value) {
      return value.toLocaleString() + '원'
    }
  }
}
</script>

<style scoped>
.product-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  min-height: 100vh;
  padding: 40px 0 0 0;
  position: relative;
}
.product-main {
  display: flex;
  gap: 60px;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  align-items: flex-start;
}
.product-image img {
  width: 420px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  background: #fafafa;
}
.product-info {
  flex: 1;
  min-width: 340px;
}
.product-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 12px;
}
.product-price {
  font-size: 1.5rem;
  color: #222;
  font-weight: 600;
  margin-bottom: 18px;
}
.product-meta {
  list-style: none;
  padding: 0;
  margin: 0 0 18px 0;
  color: #888;
  font-size: 1rem;
}
.product-meta li {
  margin-bottom: 4px;
}
.meta-desc {
  color: #222;
  margin-left: 8px;
}
.quantity-box {
  display: flex;
  align-items: center;
  gap: 18px;
  background: #fafafa;
  border-radius: 8px;
  padding: 18px 20px;
  margin-bottom: 18px;
  font-size: 1.1rem;
}
.quantity-control {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #ddd;
  padding: 4px 10px;
}
.quantity-control button {
  background: none;
  border: none;
  font-size: 1.2rem;
  width: 28px;
  height: 28px;
  cursor: pointer;
  color: #222;
}
.quantity-control button:disabled {
  color: #ccc;
  cursor: not-allowed;
}
.item-price {
  margin-left: auto;
  font-weight: 600;
}
.total-price-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  margin-bottom: 18px;
  font-weight: 600;
}
.total-price {
  color: #222;
  font-size: 1.3rem;
}
.action-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}
.buy-btn, .gift-btn, .cart-btn {
  flex: 1;
  padding: 14px 0;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  background: #eee;
  color: #222;
  transition: background 0.2s;
}
.buy-btn { background: #888; color: #fff; }
.gift-btn { background: #fff; border: 1px solid #ddd; }
.cart-btn { background: #fff; border: 1px solid #ddd; }
.quick-buy-btn {
  width: 100%;
  background: #ffe000;
  color: #222;
  border: none;
  border-radius: 6px;
  padding: 16px 0;
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
}
.inquiry-btn {
  position: fixed;
  right: 32px;
  bottom: 32px;
  background: #ffe000;
  color: #222;
  border: none;
  border-radius: 50px;
  padding: 16px 28px;
  font-size: 1.1rem;
  font-weight: 700;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  cursor: pointer;
  z-index: 100;
}
</style> 