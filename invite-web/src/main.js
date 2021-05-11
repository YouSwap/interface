import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

import { post, get } from './assets/script/http'
Vue.prototype.$get = get
Vue.prototype.$post = post

import less from 'less'
Vue.use(less)

import { Button, Notification, Input } from 'element-ui'

Vue.prototype.$notify = Notification
import { message } from './assets/script/resetMessage'
Vue.prototype.$message = message
import './assets/style/customElement.css'
import YouswapHeader from 'youswap-header'
Vue.use(Button)
Vue.use(Input)
import 'element-ui/lib/theme-chalk/index.css';

import i18n from "./lang"; // 引入国际化

// import vconsole from "vconsole";
// new vconsole();

Vue.config.productionTip = false
Vue.use(YouswapHeader)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
