<template>
    <div class="payments-main">
      <div class="sidebar">
        <ul>
          <li :class="{active: tab==='inquiries'}" @click="tab='inquiries'">문의 내용</li>
          <li :class="{active: tab==='refund'}" @click="tab='refund'">환불처리</li>
        </ul>
      </div>
      <div class="content">
        <div class="card-area">
          <PaymentInquiriesView v-if="tab==='inquiries'" />
          <RefundView v-if="tab==='refund'" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import PaymentInquiriesView from './PaymentInquiriesView.vue'
  import RefundView from './RefundView.vue'
  
  const tab = ref('inquiries') // 기본값: 문의 내용
  </script>
  
  <style scoped>
  .payments-main {
    display: flex;
    min-height: 80vh;
    background: #f7f7f7;
    border-radius: 18px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    margin: 40px 0;
  }
  .sidebar {
    width: 220px;
    background: #fff;
    border-radius: 18px 0 0 18px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    padding: 32px 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  .sidebar ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .sidebar li {
    padding: 18px 32px;
    cursor: pointer;
    font-size: 1.1rem;
    color: #333;
    border-left: 4px solid transparent;
    transition: background 0.2s, border-color 0.2s;
  }
  .sidebar li.active {
    background: #f0f8f4;
    border-left: 4px solid #2ecc71;
    color: #1abc6e;
    font-weight: bold;
  }
  .content {
    flex: 1;
    padding: 40px 32px;
    background: #fff;
    border-radius: 0 18px 18px 0;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    min-height: 600px;
    display: flex;
    flex-direction: column;
  }
  .card-area {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
  </style>