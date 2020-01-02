// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// import '../../mock/aiot/second.js' // mock 方式，正式发布时，注释掉该处即可

window.localStorage.setItem('token', 'v1_UU5LQm56KzdLYnAvZnpmNFdaUXBFVTFiZ3JaT24yWDhuNFAzQXRaVFlMVVZTUVl5QjFDNFpEV094cVNFSG1PN2dWVlBFZUxEbGRVZjhPVUxwTDFJc09XK0dJMUxRVXhtejFBczdNKzE0aXMvWVNnditRUFRCaStBR3U5NDRBeEVKUXNOdHpmYTRUZ1pWU3ozZ2twekFvb2FYaDZ6N2xRanBLenVZYktqY2ZDc0NRdlFtc2E3YjR6MmJMUkJ3bzZncXc1VTJJcC9QcjR2bGN6bURmZDZORWNPTUFBbXpNcktSTStvcTd1SVN1UT09hssOeOtI6Pko-4aKHqvbcuA-pW2Ezo36GBmzeOS3UzTMfQZq9oblil0vMy3NZz93wQRq1SUfkmZN_Csy11ieo2jzrj111qboMlTWoRLmg4VGfSjhqxRSO2H4p3HoVymLHv871pcud_kf0shrVUjRbbjOoWyIgLtr-kZqiPru-w..')


import request from '@assets/js/request.js' // axios

import Vue from 'vue'
import page from './aiot.vue'
import { hideLoading } from '@assets/js/loading.js'
import ViewUI from 'view-design'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import style
import 'view-design/dist/styles/iview.css'
import store from './store/index.js'

import '@assets/css/reset.css'
import '@assets/css/base.less'
import '@assets/css/element.less' // 重置element 默认样式
import '@assets/css/iview.less' // 重置iview 默认样式


// permission control
// import './permission.js'

// global filters
import * as filters from './filters.js' 
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.config.productionTip = false
Vue.use(ViewUI)
Vue.use(ElementUI)

Vue.mixin({
  data() {
    return {
      $http: '', // 服务
    }
  },
  methods: {
  },
  created() {
    this.$http = request
  }
})

new Vue({
  el: '#app',
  components: {
    page
  },
  store,
  template: '<page/>',
  created() {
    hideLoading()
  }
})