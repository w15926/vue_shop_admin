import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('@/views/Login.vue')

Vue.use(VueRouter)
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: () => import('@/views/Home.vue'),
    redirect: '/users',
    children: [
      { path: '/users', component: () => import('@/views/user/Users.vue') },
      { path: '/rights', component: () => import('@/views/power/Rights.vue') },
      { path: '/roles', component: () => import('@/views/power/Roles.vue') },
      { path: '/categories', component: () => import('@/views/goods/Category') },
      { path: '/params', component: () => import('@/views/goods/Params') },
      { path: '/goods', component: () => import('@/views/goods/List') },
      { path: '/goods/add', component: () => import('@/views/goods/Add') },
      { path: '/orders', component: () => import('@/views/order/Order') },
      { path: '/reports', component: () => import('@/views/report/Report') }
    ]
  },
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// beforeEach导航守卫  没有token则一直返回login
// to将要访问  from从哪个路径跳转来
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router