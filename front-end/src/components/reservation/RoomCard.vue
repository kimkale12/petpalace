<template>
  <div class="room-card">
    <img :src="room.image" :alt="room.name">
    <div class="room-info">
      <h3>{{ room.name }}</h3>
      <p>{{ room.description }}</p>
      <span class="price">{{ formatPrice(room.price) }}원/일</span>
      <button 
        class="reserve-button"
        @click="handleReserve"
      >
        구경하기
      </button>
    </div>
  </div>
</template>

<script>
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';

export default {
  name: 'RoomCard',
  props: {
    room: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatPrice(price) {
      return price.toLocaleString()
    },
    handleReserve() {
      this.$emit('reserve', this.room)
    }
  }
}
</script>

<style scoped>
.room-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  width: 300px;
}
.room-card:hover {
  transform: translateY(-5px);
}
.room-card img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}
.room-info {
  padding: 1.5rem;
}
.room-info h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
.price {
  display: block;
  color: #2e8b57;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 1rem 0;
}
.reserve-button {
  width: 100%;
  padding: 0.8rem;
  background-color: #22a722;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.reserve-button:hover {
  background-color: #1d8f1d;
}
</style>
