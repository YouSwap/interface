import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
Vue.config.productionTip = false
import { Button, Form, Input, Table, TableColumn, Message, Radio, Main, RadioGroup, Tooltip } from 'element-ui'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
Vue.use(Button);
Vue.use(Form);
Vue.use(Input);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Radio);
Vue.use(Main);
Vue.use(RadioGroup);
Vue.use(Tooltip);
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: Cookies.get('lang') || 'en', // set locale
  messages: {
    zh: require('./lan/zh.js'), // 中文语言包
    en: require('./lan/en.js') // 英文语言包
  }
})
Vue.prototype.$message = Message
// import vconsole from "vconsole";
// new vconsole();

// import './assets/style/customElement.css'
import 'element-ui/lib/theme-chalk/index.css';

new Vue({
  render: h => h(App),
  i18n,
  store,
  router
}).$mount('#app')
