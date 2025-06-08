import axios from 'axios'
const baseURL = '/api'

const instance = axios.create({
  baseURL,
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (credentials) => instance.post('/users/login', credentials),
  signup: (userData) => instance.post('/users/register', userData),
  logout: () => instance.post('/users/logout'),
  checkUsername: (username) => instance.get('/users/check-username', { params: { username } }),
  checkEmail: (email) => instance.get('/users/check-email', { params: { email } })
}

export const userAPI = {
  getInfo: () => instance.get('/users/me'),
  updateProfile: (userData) => instance.put('/users/profile', userData)
}

export const reservationAPI = {
  createReservation(data) {
    return axios.post('/api/reservations', data)
  },
  getReservations() {
    return axios.get('/api/reservations')
  },
  getDetail(id) {
    return axios.get(`/api/reservations/${id}`)
  }
}

export default instance