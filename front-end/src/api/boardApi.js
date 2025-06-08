import axios from '@/utils/api'

export const boardApi = {
  getList(params) {
    return axios.get('/board', { params });
  },
  getDetail(id) {
    return axios.get(`/board/${id}`);
  },
  create(data) {
    return axios.post('/board', data);
  },
  update(id, data) {
    return axios.put(`/board/${id}`, data);
  },
  remove(id) {
    return axios.delete(`/board/${id}`);
  },
  addView(id) {
    return axios.post(`/board/${id}/view`);
  },
  getViews(id) {
    return axios.get(`/board/${id}/views`);
  },
  addLike(id) {
    return axios.post(`/board/${id}/like`);
  },
  getLikes(id) {
    return axios.get(`/board/${id}/likes`);
  },
  // 댓글 등록
  addComment(id, data) {
    return axios.post(`/board/${id}/comments`, data);
  },
  // 댓글 목록 조회
  getComments(id) {
    return axios.get(`/board/${id}/comments`);
  },
  // 댓글 삭제
  deleteComment(commentId, data) {
    return axios.delete(`/board/comments/${commentId}`, { data });
  },
  deletePost(id, data) {
    return axios.delete(`/board/${id}`, { data });
  },
};