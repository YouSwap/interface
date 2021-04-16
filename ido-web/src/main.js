import 'element-ui/lib/theme-chalk/index.css';
import './assets/reset.css'

import Vue from 'vue'
import Vuex from 'vuex';
import App from './App.vue'
import store from './store'
import ElementUI from 'element-ui';
import { messages } from './assets/script/resetMessage'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import router from './router'
import axios from "axios"

Vue.use(Vuex);
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: Cookies.get('lan') || 'en', // set locale
  messages: {
    zh: require('./lan/zh.js'), // 中文语言包
    en: require('./lan/en.js') // 英文语言包
  }
})

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$messages = messages
Vue.prototype.$axios= axios

new Vue({
  render: h => h(App),
  i18n,
  router,
  store
}).$mount('#app')
