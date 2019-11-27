// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import '../../mock/index.js' // mock 方式，正式发布时，注释掉该处即可

window.localStorage.setItem('token', 'v1_UU5LQm56KzdLYnJSL0V2WFQ4eUQyS2hIU0RZeDNZMlRzRVNKem04VDBKeUhBNjlUcWIvU0tiQlRSM2hNVGwvNWdWVlBFZUxEbGRWa2JydnFoSC85anMrMmtLYThmZ29oejFBczdNKzE0aXMvWVNnditRUFRCa3ZWMnE1R1dzenRJYnZKSGlNQXh5NFpWU3ozZ2twekFvb2FYaDZ6N2xRanBLenVZYktqY2ZDNE05R1hRanhVRlJCY0U2U09nOXI4R3VjVFBwZDJnM0xWanV1Q3FrTnJCalA3ejJnck5aZEF5VDZxai9TcWFMTT0dgGelPqVUNdEogO3KsDMn1PQvXBj2_bIGrCOSeneA36fk_U_j5HLomJfB-zITx7KISp_k1nDRFMPYXHfTlnlbswnC5s0mznp1adrXjhbjCVvRhc2jTG5s8A-9MU60uLwnW2p-euVcCUAcI46xR_Ue4x9UG3ORmUo--ORiGf7J8g..')


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

// permission control
import './permission.js'
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