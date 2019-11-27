// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import page from './map.vue'
import '../../assets/css/reset.css'
import '../../assets/css/base.less'
import { hideLoading } from '@assets/js/loading.js'

import '../../assets/css/reset.css'

Vue.config.productionTip = false


new Vue({
  el: '#app',
  components: {
    page
  },
  template: '<page/>',
  created() {
    hideLoading()
  }
})