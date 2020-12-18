import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './components/content/axiosConfig'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

import './assets/css/global.css'
import './assets/fonts/iconfont.css'