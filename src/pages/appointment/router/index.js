import Vue from 'vue'
import Router from 'vue-router'

import Index from '../views/index.vue'
import History from '../views/history.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      meta: { title: '家居购买'}
    },
    {
      path: '/history',
      name: 'history',
      component: History,
      meta: { title: '预订历史'}
    }
  ]
})
