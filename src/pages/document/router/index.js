import Vue from 'vue'
import Router from 'vue-router'
import Index from '../views/index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      meta: { 
        title: '虚拟体验',
        keepAlive: true
      }
    }
  ]
})
