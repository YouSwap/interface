import Vue from 'vue'
import VueRouter from 'vue-router'
import Mining from '../pages/Mining'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Mining
  },
  {
    path: '/mining',
    component: Mining
  }
]

var router = new VueRouter({
  mode: 'history',
  routes
})

export default router;