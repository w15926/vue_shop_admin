import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './components/content/axiosConfig'
import TreeTable from 'vue-table-with-tree-grid'

Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

import './assets/css/global.css'
import './assets/fonts/iconfont.css'