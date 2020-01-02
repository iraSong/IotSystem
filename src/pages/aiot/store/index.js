/**
 * @author songwh
 * 
 * Created at     : 2019-08-05 11:32:49
 * Last modified  : 2019-12-31 16:25:32
 */
import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)

let storeRank = ''
let storeRankObj = ''
// try {
//   storeRank = window.localStorage.getItem('aiot-rank')
//   storeRankObj= JSON.parse(window.localStorage.getItem('aiot-rank-obj'))
// }
// catch(err){
//   console.log(err)
// }

const store = new Vuex.Store({
  state: {
    showPiePanel: false,
    showMask: false, // 高德地图mask
    rank: storeRank || 'country', // 当前视角 country city community
    rankObj: storeRankObj || {name: '全国'},
    refresh: false, // rankObj改变 需重新加载数据
    refreshBuild: false,


    showMoreExceptions: false,
    showMoreWorkorder: false,
    showMoreWarning: false,
    showModifyPassword: false, // 账户修改密码

    confirmDevice: '',
    showConfirm: false,

    showLockPasword: false, // 门锁下发密码弹框
    dialogType: '', // new 新增 modify 修改
    pwdDetail: '', // 修改的密码详情
    lockDeviceInfo: '',

    showDeviceTypeDialog: false, // 设备类型弹框二级页面
    deviceInfo: '',

    showWarningConfig: false, // 告警信息配置
    showAttentionConfig: false, // 重点关注信息配置

    buildFocusList: [],
    publicFocusList: [],
    focusType: 'build',
    focusBuildId: '',
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
    },
    focusList: state => {
      let list = []
      if(state.focusType == 'build') {
        state.buildFocusList.forEach(el => {
          el.buildList.forEach(it => {
            if(it.buildId == state.focusBuildId) {
              list = it.deviceTypeList
            }
          })
        })
      } else {
        list = state.publicFocusList
      }
      return list
    },
  },
  mutations: {
    setFocusType(state, type) {
      state.focusType = type
    },
    setBuildFocusList(state, list) {
      state.buildFocusList = list
    },
    setPublicFocusList(state, list) {
      state.publicFocusList = list
    },
    setFocusBuildId(state, id) {
      state.focusBuildId = id
    },
    toggleRefreshBuild(state) {
      state.refreshBuild = !state.refreshBuild
    },
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
    toggleShowConfirm(state , device) {
      state.confirmDevice = device
      state.showConfirm = !state.showConfirm
    },
    toggleDeviceTypeDialog(state, deviceInfo) {
      state.deviceInfo = deviceInfo
      state.showDeviceTypeDialog = !state.showDeviceTypeDialog
    },
    toggleWarningConfig(state) {
      state.showWarningConfig = !state.showWarningConfig
    },
    toggleAttentionConfig(state) {
      state.showAttentionConfig = !state.showAttentionConfig
    },

    setMask(state, val) {
      state.showMask = val
    },
    setRank(state, val) {
      window.localStorage.setItem('aiot-rank', val)
      state.rank = val
    },
    setRankObj(state, val) {
      window.localStorage.setItem('aiot-rank-obj', JSON.stringify(val))
      state.refresh = !state.refresh
      state.rankObj = val
    },
    hide(state) {
      state.showMoreExceptions = false
      state.showMoreWorkorder = false
      state.showMoreWarning = false

      state.showDeviceTypeDialog = false
      state.showWarningConfig = false
      state.showAttentionConfig = false
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
    toggleLockPasword(state, { pwdDetail = '', dialogType ='new', lockDeviceInfo = '' }) {
      state.dialogType = dialogType
      state.pwdDetail = pwdDetail
      state.lockDeviceInfo = lockDeviceInfo
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
