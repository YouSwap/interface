import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../pages/main'
import List from '../pages/list'
import Introduct from '../pages/introduct'
import IntroductPc from '../pages/introductPc'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Main
  },
  {
    path: '/main',
    component: Main
  },
  {
    path: '/list',
    component: List
  },
  {
    path: '/introduct',
    component: Introduct
  },
  {
    path: '/introduct/pc',
    component: IntroductPc
  }
]

var router = new VueRouter({
  mode: 'history',
  routes
})

export default router;