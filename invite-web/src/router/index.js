import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Liquality',
    component:  () => import(/* webpackChunkName: "about" */ '../views/LiqualityDig.vue')
  },
  {
    path: '/invite',
    name: 'Invite',
    component:  () => import(/* webpackChunkName: "about" */ '../views/Invite.vue')
  },
  {
    path: '/dealpool',
    name: 'DealPool',
    component:  () => import(/* webpackChunkName: "about" */ '../views/DealPool.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
