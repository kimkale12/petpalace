import axios from 'axios'

const API = axios.create({
  baseURL: '/api/user',
});

// 요청마다 토큰 자동 추가
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 내 정보 불러오기 (토큰 필요)
export const getMyInfo = () => API.get('/me');

// 내 정보 수정 (토큰 필요)
export const updateMyInfo = (data) => API.put('/me', data);

export async function uploadProfileImg(formData) {
  return axios.post('/user/me/profile-img', formData)
}
export async function changePassword(data) {
  return axios.put('/user/me/password', data)
}
