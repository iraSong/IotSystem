/**
 *
 * Created at     : 2019-08-05 11:32:49
 * Last modified  : 2019-09-30 09:55:23
 */
import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    showPiePanel: false,
  },
  mutations: {
    togglePiePanel(state) {
      state.showPiePanel = !state.showPiePanel
    }
  },

  actions: {
    // 获取设备属性
    getDeviceInfo({ commit }) {
      return new Promise(() => {
        commit()
      })
    },
  }
})

export default store
