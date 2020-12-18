import Vue from 'vue'
import axios from 'axios'

axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'

axios.interceptors.request.use(config => {
  // 将token保存在里面，访问接口其他数据时候需要验证
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http = axios