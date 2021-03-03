import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './network/request' // axios配置
import './components/dateFormat/dateFormat' // 日期格式化

import TreeTable from 'vue-table-with-tree-grid'

import VueQuillEditor from 'vue-quill-editor' // 导入富文本编辑器
import 'quill/dist/quill.core.css' // 导入富文本编辑器三条样式
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

import './assets/css/global.css'
import './assets/fonts/iconfont.css'