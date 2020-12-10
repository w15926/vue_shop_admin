import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message // message弹窗提示（需挂载全局）
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message // 挂载，赋值给原型对象里自定义属性message