import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './network/request' // axios配置
import './components/dateFormat/dateFormat' // 日期格式化

import TreeTable from 'vue-table-with-tree-grid'

import VueQuillEditor from 'vue-quill-editor' // 导入富文本编辑器

Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

import './assets/css/global.css'
import './assets/fonts/iconfont.css'