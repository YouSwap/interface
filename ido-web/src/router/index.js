import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../pages/Home'
import Detail from '../pages/Detail'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/detail',
    component: Detail
  }
]

var router = new VueRouter({
  mode: 'history',
  routes
})

export default router;