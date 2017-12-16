// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'element-ui/lib/theme-chalk/reset.css'
import 'element-ui/lib/theme-chalk/base.css'
import 'element-ui/lib/theme-chalk/row.css'
import 'element-ui/lib/theme-chalk/col.css'
import 'element-ui/lib/theme-chalk/select.css'
import 'element-ui/lib/theme-chalk/option.css'
import 'element-ui/lib/theme-chalk/button.css'
import 'element-ui/lib/theme-chalk/input.css'
import 'element-ui/lib/theme-chalk/form.css'
import 'element-ui/lib/theme-chalk/form-item.css'
import 'element-ui/lib/theme-chalk/message.css'
import './assets/main.less'

import Vue from 'vue'
import App from './App'

import {Row, Col, Select, Button, Input, Option, Form, FormItem, Message} from 'element-ui'

Vue.config.productionTip = false

Vue.use(Row)
Vue.use(Col)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)

Vue.component(Message.name, Message)
Vue.prototype.$message = Message

if (process.env.NODE_ENV === 'development') {
  window.chrome.i18n = {
    getMessage: function (val) {
      return val
    }
  }
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
