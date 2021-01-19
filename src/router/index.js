import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('@/views/Login.vue')
const Home = () => import('@/views/Home.vue')

const Welcome = () => import('@/views/Welcome.vue')
const Users = () => import('@/views/user/Users.vue')

const Rights = () => import('@/views/power/Rights.vue')
const Roles = () => import('@/views/power/Roles.vue')

const Category = () => import('@/views/goods/Category')
const Params = () => import('@/views/goods/Params')
const List = () => import('@/views/goods/List')
const Add = () => import('@/views/goods/Add')

const Order = () => import('@/views/order/Order')

const Report = () => import('@/views/report/Report')

Vue.use(VueRouter)
const routes = [{
  path: '/',
  redirect: '/login'
}, {
  path: '/login',
  component: Login
}, {
  path: '/home',
  component: Home,
  redirect: '/welcome',
  children: [
    { path: '/welcome', component: Welcome },
    { path: '/users', component: Users },
    { path: '/rights', component: Rights },
    { path: '/roles', component: Roles },
    { path: '/categories', component: Category },
    { path: '/params', component: Params },
    { path: '/goods', component: List },
    { path: '/goods/add', component: Add },
    { path: '/orders', component: Order },
    { path: '/reports', component: Report }
  ]
},]
const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
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