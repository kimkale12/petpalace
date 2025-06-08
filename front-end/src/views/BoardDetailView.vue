<template>
  <div class="board-detail-modern">
    <div class="detail-header-modern">
      <div class="title-block">
        <h1>{{ inquiry.title }}</h1>
        <div class="meta-modern">
          <span>작성자: <b>{{ inquiry.user?.name || '알수없음' }}</b></span>
          <div class="info-row">
            <span> |   날짜: {{ formatDate(inquiry.created_at) }}</span>
          </div>
          <span class="status" :class="inquiry.status"> {{ inquiry.status }}</span>
        </div>
      </div>
      <div class="action-block">
        <div class="like-view">
          <button class="like-btn" :class="{ liked: liked }" @click="likePost">
            <span class="icon">❤️</span> {{ likes }}
          </button>
          <span class="view-count">
            <span class="icon">🔎</span> {{ inquiry.views }}
          </span>
        </div>
        <div v-if="isOwner || isAdmin" class="edit-delete-block">
          <router-link :to="`/board/edit/${inquiry.id}`" class="edit-btn">수정</router-link>
          <button class="delete-btn" @click="deletePost">삭제</button>
        </div>
      </div>
      
    </div>
    <div class="content-modern">{{ inquiry.content }}</div>
    <div v-if="inquiry.attachments?.length" class="attachments-modern">
      <h4>첨부파일</h4>
      <ul>
        <li v-for="file in inquiry.attachments" :key="file.id">
          <a :href="file.file_url" target="_blank">{{ file.file_name }}</a>
        </li>
      </ul>
    </div>
    <div class="comments-modern">
      <h3>댓글</h3>
      <div v-for="comment in comments" :key="comment.id" class="comment-modern">
        <b>{{ comment.user_name || '알수없음' }}</b> : {{ comment.content }}
        <span class="date">{{ formatDate(comment.created_at) }}</span>
        <span v-if="comment.user_name === '관리자'" class="admin-badge">관리자</span>
        <button
          v-if="userStore.user?.name === comment.user_name"
          class="delete-x-btn"
          @click="openDeleteModal(comment.id)"
          aria-label="댓글 삭제"
        >✕</button>
      </div>
      <form @submit.prevent="addComment" class="comment-form">
        <input v-model="newComment" placeholder="댓글을 입력하세요" />
        <button type="submit">등록</button>
      </form>
    </div>

    <!-- 비밀번호 입력 모달 -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <h4>비밀번호 확인</h4>
        <input v-model="deletePassword" type="password" placeholder="비밀번호 입력" />
        <div class="modal-btns">
          <button class="modal-confirm" @click="confirmDeleteComment">확인</button>
          <button class="modal-cancel" @click="closeDeleteModal">취소</button>
        </div>
      </div>
    </div>
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

const inquiry = ref({})
const comments = ref([])
const newComment = ref('')

const likes = ref(0)
const liked = ref(false)

const isOwner = computed(() => String(inquiry.value.user?.id) === String(userStore.user?.id))
const isAdmin = computed(() => userStore.user?.role === 'admin')

const likeKey = computed(() => `board_like_${route.params.id}_${userStore.user?.id || 'guest'}`)

const showDeleteModal = ref(false)
const deletePassword = ref('')
const deleteCommentId = ref(null)

onMounted(async () => {
  const res = await boardApi.getDetail(route.params.id)
  inquiry.value = res.data
  const commentRes = await boardApi.getComments(route.params.id)
  comments.value = commentRes.data

  // 좋아요 처리
  liked.value = !!localStorage.getItem(likeKey.value)
  likes.value = (await boardApi.getLikes(inquiry.value.id)).data.likes
})

async function addComment() {
  if (!newComment.value) {
    alert('댓글 내용을 입력하세요.');
    return;
  }
  if (!userStore.user?.name) {
    alert('로그인 후 댓글을 작성할 수 있습니다.');
    return;
  }
  try {
    const commentData = {
      content: newComment.value,
      user_name: userStore.user.name
    };
    
    await boardApi.addComment(inquiry.value.id, commentData);
    
    const commentRes = await boardApi.getComments(inquiry.value.id);
    comments.value = commentRes.data;
    newComment.value = '';
  } catch (error) {
    alert('댓글 등록 중 오류가 발생했습니다.\n' + (error.response?.data?.message || ''));
    console.error(error);
  }
}

async function likePost() {
  if (liked.value) return
  await boardApi.addLike(inquiry.value.id)
  likes.value++
  liked.value = true
  localStorage.setItem(likeKey.value, '1')
}

async function deletePost() {
  if (!isOwner.value && !isAdmin.value) {
    alert('삭제 권한이 없습니다.')
    return
  }
  if (confirm('정말 삭제하시겠습니까?')) {
    await boardApi.remove(inquiry.value.id)
    alert('삭제되었습니다.')
    router.push('/board')
  }
}

function formatDate(date) {
  return date?.slice(0, 10)
}

function openDeleteModal(commentId) {
  showDeleteModal.value = true
  deleteCommentId.value = commentId
  deletePassword.value = ''
}
function closeDeleteModal() {
  showDeleteModal.value = false
  deletePassword.value = ''
  deleteCommentId.value = null
}
async function confirmDeleteComment() {
  try {
    await boardApi.deleteComment(inquiry.value.id, deleteCommentId.value, { password: deletePassword.value });
    // 댓글 목록 새로고침
    const commentRes = await boardApi.getComments(route.params.id)
    comments.value = commentRes.data
    closeDeleteModal()
  } catch (err) {
    alert('댓글 삭제 중 오류가 발생했습니다.\\n' + (err.response?.data?.error || err.message));
  }
}
</script>

<style scoped>
.board-detail-modern {
  max-width: 900px;
  margin: 48px auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 32px rgba(34,197,94,0.10), 0 1.5px 8px rgba(0,0,0,0.04);
  padding: 48px 40px 32px 40px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.detail-header-modern {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}
.title-block {
  flex: 1;
}
h1 {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #222;
}
.meta-modern {
  color: #6b7280;
  font-size: 1.05em;
  display: flex;
  /* gap: 18px; */
  align-items: center;
}
.status {
  margin-left: 10px;
  padding: 2px 14px;
  border-radius: 14px;
  font-weight: 600;
}
.status.답변대기 { background: #ffe6e6; color: #e53935; }
.status.답변완료 { background: #e6fff2; color: #22c55e; }
.action-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
}
.like-view {
  display: flex;
  align-items: center;
  gap: 18px;
  font-size: 1.15em;
}
.like-btn {
  background: #f3f4f6;
  border: none;
  border-radius: 20px;
  padding: 6px 18px;
  font-size: 1.1em;
  color: #e53935;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s, color 0.15s;
}
.like-btn.liked {
  background: #e53935;
  color: #fff;
}
.like-btn .icon { font-size: 1.2em; }
.view-count {
  background: #f3f4f6;
  border-radius: 20px;
  padding: 6px 18px;
  color: #16a34a;
  display: flex;
  align-items: center;
  gap: 6px;
}
.view-count .icon { font-size: 1.2em; }
.edit-delete-block {
  display: flex;
  gap: 8px;
}
.edit-btn, .delete-btn {
  background: #f3f4f6;
  color: #333;
  border: none;
  border-radius: 8px;
  padding: 7px 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  font-size: 1em;
}
.edit-btn:hover { background: #22c55e; color: #fff; }
.delete-btn:hover { background: #e53935; color: #fff; }
.content-modern {
  font-size: 1.18em;
  color: #222;
  line-height: 1.7;
  margin-bottom: 18px;
  min-height: 120px;
}
.attachments-modern {
  margin-bottom: 18px;
}
.attachments-modern ul { padding-left: 18px; }
.comments-modern {
  margin-top: 24px;
  background: #f9fafb;
  border-radius: 12px;
  padding: 24px 18px 18px 18px;
}
.comment-modern {
  margin-bottom: 12px;
  font-size: 1.05em;
  color: #333;
}
.comment-modern .date { color: #aaa; font-size: 0.95em; margin-left: 8px; }
.admin-badge {
  background: #22c55e;
  color: #fff;
  border-radius: 8px;
  font-size: 0.95em;
  padding: 2px 8px;
  margin-left: 8px;
}
.comment-form {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}
.comment-form input {
  flex: 1;
  padding: 12px;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-size: 1.08em;
}
.comment-form button {
  background: #22c55e;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: bold;
  font-size: 1.08em;
  transition: background 0.15s;
}
.comment-form button:hover { background: #16a34a; }
@media (max-width: 700px) {
  .board-detail-modern { padding: 16px 2vw; }
  .detail-header-modern { flex-direction: column; gap: 10px; }
  .action-block { align-items: flex-start; }
}

.info-row span:last-child {
  margin-left: 18px;
}

.comments-modern h3 {
  margin-bottom: 16px;
  border-bottom: 3px solid #eee;
  padding-bottom: 8px;
}

.delete-x-btn {
  background: none;
  border: none;
  color: #e53935;
  font-size: 1.2em;
  margin-left: 8px;
  cursor: pointer;
  transition: color 0.15s;
}
.delete-x-btn:hover {
  color: #b71c1c;
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 32px rgba(34,197,94,0.10), 0 1.5px 8px rgba(0,0,0,0.08);
  padding: 36px 32px 28px 32px;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.modal-content h4 {
  margin-bottom: 18px;
  font-size: 1.18em;
  font-weight: bold;
}
.modal-content input {
  width: 100%;
  padding: 12px;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-size: 1.08em;
  margin-bottom: 18px;
}
.modal-btns {
  display: flex;
  gap: 12px;
  width: 100%;
  justify-content: flex-end;
}
.modal-confirm {
  background: #22c55e;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 22px;
  font-weight: bold;
  font-size: 1em;
  transition: background 0.15s;
}
.modal-confirm:hover { background: #16a34a; }
.modal-cancel {
  background: #f3f4f6;
  color: #333;
  border: none;
  border-radius: 8px;
  padding: 10px 22px;
  font-weight: bold;
  font-size: 1em;
  transition: background 0.15s;
}
.modal-cancel:hover { background: #e53935; color: #fff; }
</style>