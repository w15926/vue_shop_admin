import Vue from 'vue'
import axios from 'axios'

import NProgress from 'nprogress' // 导入 NProgress进度条和对应 css
import 'nprogress/nprogress.css'

axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.defaults.timeout = 5000

// 在 request拦截器中，展示进度条
axios.interceptors.request.use(config => {
  NProgress.start()
  // 将token保存在里面，访问接口其他数据时候需要验证
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后固定写法必须 return config
  return config
})

// 在 response拦截器中隐藏进度条
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

Vue.prototype.$http = axios