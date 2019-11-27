// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import page from './document.vue'
import '../../assets/css/reset.css'
import '../../assets/css/base.less'
import { hideLoading } from '@assets/js/loading.js'

import ViewUI from 'view-design'
// import style
import 'view-design/dist/styles/iview.css'
Vue.use(ViewUI)

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