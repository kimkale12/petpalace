<template>
  <div class="board-list-container">
    <h2 class="board-title">문의 게시판</h2>
    <div class="category-tabs">
      <button
        v-for="cat in categories"
        :key="cat"
        :class="['tab-btn', { active: selectedCategory === cat }]"
        @click="selectCategory(cat)"
      >
        {{ cat }}
      </button>
    </div>
    <div class="board-header">
      <span class="post-count">문의 게시판 {{ filteredInquiries.length }}</span>
      <div class="search-box">
        <input v-model="search" type="text" placeholder="Search" />
        <button class="search-btn">🔍</button>
      </div>
    </div>
    <table class="board-table">
      <thead>
        <tr>
          <th>No</th>
          <th>카테고리</th>
          <th>제목</th>
          <th>글쓴이</th>
          <th>작성날짜</th>
          <th>조회수</th>
          <th>좋아요</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in filteredInquiries" :key="item.id">
          <td>{{ filteredInquiries.length - idx }}</td>
          <td>{{ item.category }}</td>
          <td>
            <router-link :to="`/board/${item.id}`" class="board-title-link">
              {{ item.title }}
            </router-link>
          </td>
          <td>{{ item.user?.name || '알수없음' }}</td>
          <td>{{ formatDate(item.created_at) }}</td>
          <td>{{ item.views || 0 }}</td>
          <td>{{ item.likes || 0 }}</td>
        </tr>
      </tbody>
    </table>
    <button class="write-btn" @click="goWrite">글쓰기</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { boardApi } from '@/api/boardApi'

const router = useRouter()
const inquiries = ref([])
const search = ref('')
const categories = [
  '공지사항', 'FAQ', '자유게시판'
]
const selectedCategory = ref('공지사항')

onMounted(async () => {
  const res = await boardApi.getList()
  inquiries.value = res.data
})

function selectCategory(cat) {
  selectedCategory.value = cat
}
function goWrite() {
  router.push('/board/write')
}
function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  // YYYY-MM-DD 형식
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

const filteredInquiries = computed(() => {
  let list = inquiries.value
  if (selectedCategory.value !== '공지사항') {
    list = list.filter(i => i.category === selectedCategory.value)
  }
  if (search.value) {
    list = list.filter(i =>
      i.title.includes(search.value) ||
      (i.user?.name && i.user.name.toString().includes(search.value)) ||
      (i.user_id && i.user_id.toString().includes(search.value))
    )
  }
  return list
})
</script>


<style scoped>

.board-title-link {
  color: #222;
  text-decoration: underline;
  cursor: pointer;
}
.board-title-link:hover {
  color: #4caf50; ;
}

.board-list-container[data-v-40179705] {
  max-width: 100%;
  margin: 40px 40px 40px 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 32px 32px 32px 32px;
  position: relative;
  min-height: calc(80vh - 50px);
  display: flex
  ;
  flex-direction: column;
}
.board-title {
  color: #4caf50; ;
  font-size: 2.5em;
  font-weight: bold;
  margin-bottom: 8px;
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
  color: #4caf50; ;
  font-weight: bold;
  border-bottom: 2px solid #4caf50; ;
}
.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.post-count {
  color: #222;
  font-size: 1em;
}
.search-box {
  display: flex;
  align-items: center;
  gap: 4px;
}
.search-box input {
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 1em;
}
.search-btn {
  background: #fff;
  border: none;
  font-size: 1.1em;
  cursor: pointer;
}
.board-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
}
.board-table th, .board-table td {
  border: 1px solid #eee;
  padding: 10px 8px;
  text-align: center;
  font-size: 0.98em;
}
.board-table th:nth-child(3), .board-table td:nth-child(3) {
  min-width: 220px;
  width: 30%;
  text-align: center;
  padding-left: 18px;
}
.board-table th:nth-child(2), .board-table td:nth-child(2) {
  text-align: center;
}
.board-table th {
  background: #f8f8f8;
  color: #4caf50; ;
  font-weight: bold;
}
.badge {
  display: inline-block;
  margin-left: 6px;
  padding: 2px 7px;
  border-radius: 8px;
  font-size: 0.85em;
  font-weight: bold;
}
.badge.new {
  background: #eab308;
  color: #fff;
}
.badge.notice {
  background: #f87171;
  color: #fff;
}
.write-btn {
  position: absolute;
  right: 32px;
  bottom: 24px;
  background: #eab308;
  color: #fff;
  padding: 10px 28px;
  border-radius: 8px;
  font-weight: bold;
  border: none;
  font-size: 1.1em;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(234,179,8,0.08);
}
.write-btn:hover {
  background: #facc15;
}
@media (max-width: 600px) {
  .board-list-container { padding: 12px 2px 80px 2px; }
  .category-tabs { flex-wrap: wrap; gap: 8px; }
  .board-table th, .board-table td { padding: 6px 2px; font-size: 0.93em; }
  .write-btn { right: 10px; bottom: 10px; padding: 8px 16px; font-size: 1em; }
}
</style>