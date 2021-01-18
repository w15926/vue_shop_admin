import Vue from 'vue'

// 全局导入，输入代码少体积大

// 按需导入，输入代码多体积小
import {
  Button,
  Form,
  FormItem,
  Input,
  Message, // message弹窗提示（需挂载全局）
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb, // 面包屑（路径）
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination, // 分页区域
  Dialog,
  MessageBox,
  Tag,
  Cascader, // 级联选择器
  Tree,
  Select,
  Option,
  Alert,
  Tabs,
  TabPane,
  Steps,
  Step,
  CheckboxGroup,
  Checkbox,
  Upload
} from 'element-ui'

import Timeline from './timeline/index'
import TimelineItem from './timeline-item/index'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Cascader)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.prototype.$message = Message // 挂载，赋值给原型对象里自定义属性message
Vue.prototype.$confirm = MessageBox.confirm