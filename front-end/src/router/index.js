import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'
import HomeView from '@/views/HomeView.vue'
import BoardListView from '@/views/BoardListView.vue'
import BoardDetailView from '@/views/BoardDetailView.vue'
import BoardWriteView from '@/views/BoardWriteView.vue'
import MyInfoView from '@/views/MyInfoView.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'
import PaymentSuccessView from '@/views/PaymentSuccessView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('@/views/SignupView.vue')
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/ContactView.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reservation',
    name: 'Reservation',
    component: () => import('@/views/ReservationView.vue')
  },
  {
    path: '/location',
    name: 'Location',
    component: () => import('@/views/LocationView.vue')
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('@/views/ProductDetail.vue')
  },
  {
    path: '/service',
    name: 'Service',
    component: () => import('@/views/ServiceView.vue')
  },
  {
    path: '/myinfo',
    name: 'MyInfo',
    component: MyInfoView
  },
  {
    path: '/payment',
    name: 'Payment',
    component: () => import('@/views/PaymentView.vue')
  },
  {
    path: '/payment/success',
    name: 'PaymentSuccess',
    component: () => import('@/views/PaymentSuccessView.vue')
  },
  {
    path: '/payment/success-delay',
    name: 'PaymentSuccessDelay',
    component: () => import('@/views/PaymentSuccessDelayView.vue')
  },
  {
    path: '/payment/cancel',
    name: 'PaymentCancel',
    component: () => import('@/views/PaymentCancelView.vue')
  },
  {
    path: '/payment/fail',
    name: 'PaymentFail',
    component: () => import('@/views/PaymentFailView.vue')
  },
  {
    path: '/board',
    name: 'BoardList',
    component: BoardListView
  },
  {
    path: '/board/write',
    name: 'BoardWrite',
    component: BoardWriteView,
    meta: { requiresAuth: true }
  },
  {
    path: '/board/:id',
    name: 'BoardDetail',
    component: BoardDetailView
  },
  {
    path: '/board/edit/:id',
    name: 'BoardEdit',
    component: BoardWriteView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/reservations',
    name: 'AdminReservations',
    component: () => import('@/views/AdminReservations.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/inquiries',
    name: 'AdminInquiries',
    component: () => import('@/views/AdminInquiries.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/payments',
    name: 'AdminPayments',
    component: () => import('@/views/AdminPayments.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/coupon-point',
    name: 'CouponPoint',
    component: () => import('@/views/CouponPointView.vue')
  },
  {
    path: '/find-id',
    name: 'FindId',
    component: () => import('@/views/FindIdView.vue')
  },
  {
    path: '/find-password',
    name: 'FindPassword',
    component: () => import('@/views/FindPasswordView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.user) {
    next('/login')
  } else {
    next()
  }
})

// 🔐 네비게이션 가드
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.user) {
    next('/login')
  } else {
    next()
  }
})

getters: {
  isLoggedIn: (state) => !!state.user
}

export default router
