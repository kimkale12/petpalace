<script setup>
import { loadTossPayments } from '@tosspayments/payment-sdk'

const clientKey = 'test_ck_...'; // 발급받은 clientKey

async function requestBilling() {
  const tossPayments = await loadTossPayments(clientKey)
  tossPayments.requestBillingAuth('카드', {
    customerKey: 'user.id', // 유저 고유값(직접 생성)
    successUrl: 'http://localhost:8080/billing/success',
    failUrl: 'http://localhost:8080/billing/fail'
  })
}
</script>

<template>
  <button @click="requestBilling">정기결제 등록(빌링키 발급)</button>
</template>