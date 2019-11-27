/**
 *
 * Created at     : 2019-08-05 11:32:49
 * Last modified  : 2019-11-27 12:05:19
 */
import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)

let storeRank = window.localStorage.getItem('aiot-rank')
let storeRankObj= window.localStorage.getItem('aiot-rank-obj')

const store = new Vuex.Store({
  state: {
    showPiePanel: false,
    showMask: false, // 高德地图mask
    rank: storeRank || 'country', // 当前视角 country city community
    rankObj: storeRankObj || {name: '全国'},
    refresh: false, // rankObj改变 需重新加载数据

    showMoreExceptions: false,
    showMoreWorkorder: false,
    showMoreWarning: false,
    showModifyPassword: false, // 账户修改密码

    showLockPasword: false, // 门锁下发密码弹框
    dialogType: '', // new 新增 modify 修改
    pwdDetail: '', // 修改的密码详情

  },
  getters: {
    isDim: state => {
      return state.showMoreExceptions || state.showMoreWorkorder || state.showMoreWarning
    },
    cityCode: state => {
      if(state.rank == 'community') {
        return state.rankObj.cityCode || ''
      } else if(state.rank == 'city') {
        return state.rankObj.cityCode || state.rankObj.id || ''
      } else {
        return ''
      }
    },
    projectId: state => {
      if(state.rank == 'community') {
        return state.rankObj.id || ''
      } else {
        return ''
      }
    }
  },
  mutations: {
    togglePiePanel(state, { show }) {
      if(show == 'toggle') {
        state.showPiePanel = !state.showPiePanel
      } else {
        state.showPiePanel = false
      }
    },
    toggleModifyPassword(state) {

      state.showModifyPassword = !state.showModifyPassword
    },
    setMask(state, val) {
      state.showMask = val
    },
    setRank(state, val) {
      window.localStorage.getItem('aiot-rank', val)
      state.rank = val
    },
    setRankObj(state, val) {
      window.localStorage.getItem('aiot-rank-obj', val)
      state.refresh = !state.refresh
      state.rankObj = val
    },
    hide(state) {
      state.showMoreExceptions = false
      state.showMoreWorkorder = false
      state.showMoreWarning = false
    },
    showExceptions(state) {
      state.showMoreExceptions = true
    },
    showWorkorder(state) {
      state.showMoreWorkorder = true
    },
    showWarning(state) {
      state.showMoreWarning = true
    },
    toggleLockPasword(state, { pwdDetail = '', dialogType ='new' }) {
      state.dialogType = dialogType
      state.pwdDetail = pwdDetail
      state.showLockPasword = !state.showLockPasword
    },
  },

  actions: {
    // 获取属性
    getInfo({ commit }) {
      return new Promise(() => {
        commit()
      })
    },
  }
})

export default store
