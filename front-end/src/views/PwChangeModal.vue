<template>
    <div class="pw-modal">
      <div class="pw-modal-content">
        <h3>비밀번호 변경</h3>
        <input type="password" v-model="pw" placeholder="새 비밀번호" />
        <input type="password" v-model="pw2" placeholder="비밀번호 확인" />
        <div class="btn-group">
          <button class="btn cancel" @click="$emit('close')">취소</button>
          <button class="btn save" @click="changePw">변경</button>
        </div>
      </div>
    </div>
  </template>
  <script setup>
  import { ref } from 'vue'
  import { changePassword } from '@/api/userApi'
  const pw = ref('')
  const pw2 = ref('')
  async function changePw() {
    if (pw.value !== pw2.value) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }
    await changePassword({ password: pw.value })
    alert('비밀번호가 변경되었습니다.')
    pw.value = pw2.value = ''
    // 모달 닫기
    setTimeout(() => { 
      // emit close
      window.dispatchEvent(new Event('closePwModal'))
    }, 500)
  }
  </script>
  <style scoped>
  .pw-modal { position: fixed; left:0; top:0; width:100vw; height:100vh; background:rgba(0,0,0,0.2); display:flex; align-items:center; justify-content:center; z-index:2000;}
  .pw-modal-content { background:#fff; border-radius:12px; padding:32px 24px; min-width:320px; box-shadow:0 2px 16px #0002; }
  .pw-modal-content h3 { margin-bottom:18px; }
  .pw-modal-content input { width:100%; margin-bottom:12px; padding:10px; border-radius:6px; border:1px solid #ddd;}
  .btn-group { display:flex; justify-content:flex-end; gap:10px;}
  .btn.save { background:#1abc6e; color:#fff;}
  .btn.cancel { background:#e0e0e0; color:#333;}
  </style>