import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('@/components/Login.vue')
const Home = () => import('@/components/Home.vue')

const Welcome = () => import('@/components/Welcome.vue')
const Users = () => import('@/components/user/Users.vue')

const Rights = () => import('@/components/power/Rights.vue')
const Roles = () => import('@/components/power/Roles.vue')

const Category = () => import('@/components/goods/Category')
const Params = () => import('@/components/goods/Params')
const List = () => import('@/components/goods/List')
const Add = () => import('@/components/goods/Add')

const Order = () => import('@/components/order/Order')

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
    { path: '/orders', component: Order }]
},]
const router = new VueRouter({
  mode: 'history',
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