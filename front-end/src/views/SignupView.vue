<template>
  <div class="signup-view">
    <div class="signup-form-wrapper">
      <SignupForm />
    </div>
  </div>
</template>

<script>
import SignupForm from '@/components/auth/SignupForm.vue' // 경로는 실제 위치에 맞게 수정

export default {
  name: 'SignupView',
  components: {
    SignupForm
  }
}
</script>

<style scoped>
.signup-view {
  background: #f7f7f7;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* margin-top: 70px; */
  padding-top: 70px;
  padding-bottom: 70px;
}

.signup-form-wrapper {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 40px 32px;
  min-width: 320px;
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
</style> 

