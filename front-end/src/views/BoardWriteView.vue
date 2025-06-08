<template>
  <div class="board-write-container">
    <h2 class="board-title">{{ isEdit ? '게시글 수정' : '글쓰기' }}</h2>
    <div class="category-tabs">
      <button
        v-for="cat in categories"
        :key="cat"
        :class="['tab-btn', { active: form.category === cat }]"
        @click="form.category = cat"
        type="button"
      >
        {{ cat }}
      </button>
    </div>
    <form @submit.prevent="submitForm" class="write-form">
      <!-- 글쓴이 정보: 제목 위에 배치 -->
      <div class="writer-info">
        <label class="writer-label">글쓴이</label>
        <span class="writer-name">{{ userStore.user?.name || '알수없음' }}</span>
      </div>
      <input v-model="form.title" placeholder="제목" required class="input-title" />
      <textarea v-model="form.content" placeholder="내용" required rows="7" class="input-content"></textarea>
      <!-- 작성일자 표시 (수정 모드일 때만) -->
      <div v-if="isEdit && form.created_at" class="created-at-info">
        <label class="created-at-label">작성일자</label>
        <span class="created-at-value">{{ formatDate(form.created_at) }}</span>
      </div>
      <div class="form-actions">
        <button type="submit" class="submit-btn">{{ isEdit ? '수정' : '등록' }}</button>
        <button type="button" class="cancel-btn" @click="goList">취소</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { boardApi } from '@/api/boardApi'
import { useUserStore } from '@/store/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const categories = ['공지사항', 'FAQ', '자유게시판']
const isEdit = computed(() => !!route.params.id)
const form = ref({
  title: '',
  content: '',
  category: categories[0],
  created_at: '',
})

onMounted(async () => {
  if (isEdit.value) {
    const res = await boardApi.getDetail(route.params.id)
    form.value = {
      title: res.data.title,
      content: res.data.content,
      category: res.data.category,
      created_at: res.data.created_at,
    }
  }
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('ko-KR')
}

async function submitForm() {
  const payload = {
    ...form.value,
    user_id: userStore.user.id
  }
  try {
    if (isEdit.value) {
      await boardApi.update(route.params.id, payload)
      alert('수정되었습니다!')
    } else {
      await boardApi.create(payload)
      alert('등록되었습니다!')
    }
    router.push('/board')
  } catch (e) {
    console.error('🚨 서버 오류:', e.response?.data || e.message)
    alert(`저장 실패: ${e.response?.data?.error || '서버 오류가 발생했습니다.'}`)
  }
}

function goList() {
  router.push('/board')
}
</script>

<style scoped>
.board-write-container {
  max-width: 400px;
  margin: 40px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 32px 24px;
}

.board-title {
  color: #222;
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 18px;
  text-align: center;
}

.category-tabs {
  display: flex;
  gap: 18px;
  justify-content: center;
  margin-bottom: 18px;
  border-bottom: 2px solid #f3f3f3;
  padding-bottom: 8px;
}

.tab-btn {
  background: none;
  border: none;
  font-size: 1em;
  color: #888;
  padding: 6px 10px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border 0.2s;
}
.tab-btn.active {
  color: #eab308;
  font-weight: bold;
  border-bottom: 2px solid #eab308;
}

.write-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.writer-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
  font-size: 1em;
  padding-left: 2px;
}

.writer-label {
  color: #888;
  font-weight: bold;
  min-width: 48px;
}

.writer-name {
  color: #222;
  font-weight: bold;
}

.input-title, .input-content {
  width: 100%;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 10px;
  font-size: 1.1em;
}

.input-content {
  min-height: 120px;
}

.created-at-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95em;
  color: #888;
  margin-bottom: 4px;
}
.created-at-label {
  font-weight: bold;
  min-width: 60px;
}
.created-at-value {
  color: #222;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.submit-btn {
  background: #eab308;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 28px;
  font-weight: bold;
  font-size: 1.1em;
  cursor: pointer;
}
.submit-btn:hover {
  background: #facc15;
}
.cancel-btn {
  background: #eee;
  color: #333;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-weight: bold;
  font-size: 1.1em;
  cursor: pointer;
}
.cancel-btn:hover {
  background: #ddd;
}

@media (max-width: 600px) {
  .board-write-container { padding: 12px 4px; }
  .write-form { gap: 8px; }
  .form-actions { gap: 6px; }
}
</style>