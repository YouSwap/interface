import Vue from 'vue'
import VueRouter from 'vue-router'
import Mining from '../pages/Mining'
import Across from '../pages/acrossChain'
import fileRead from '../components/PDFRead'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Mining
  },
  {
    path: '/mining',
    component: Mining
  },
  {
    path: '/AcrossChain',
    component: Across
  },
  {
    path: '/fileRead',
    component: fileRead
  },
]

var router = new VueRouter({
  mode: 'history',
  routes
})

export default router;