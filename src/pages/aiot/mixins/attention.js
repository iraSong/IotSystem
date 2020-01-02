export const mixAttention = {
  data() {
    return {
      noShowFlag: window.localStorage.getItem('aiot-attention-first'),
      deviceIdList: [],
      isTooMuch: false,
    }
  },
  computed: {
    isAttention() {
      let deviceType = this.deviceInfo.crtTabDeviceType
      // 通行记录
      if( deviceType == 'facesentry') {
        // 人脸门禁 
        return true
      } else if(deviceType == 'doorctl') {
        // 四代门禁,
        return true
      } else if(deviceType == 'doorctl_v2') {
        // 二代门禁
        return true
      } else if(deviceType == 'facegate') {
        // 人脸门口机
        return true
      } else if(deviceType == 'unitdoorwaymacchine') {
        // 单元门口机
        return true
      } else if(deviceType == 'villadoorwaymacchine') {
        // 别墅门口机
        return true
      } else if(deviceType == 'facedoorwaymachine') {
        // 围墙人脸门口机
        return true
      } else if(deviceType == 'fencingdoorwaymacchine') {
        // 围墙门口机
        return true
      } else if(deviceType == 'video') {
        // 视频监控
        return true
      } else if(deviceType == 'lift') {
        // 梯控
        return true
      } else if(deviceType == 'park') {
        // 车闸
        return true
      } else if(deviceType == 'eyecloud') {
        // 千里眼
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    setAttention(focusDevice, attentionType) {
      let params = {
        projectId: this.projectId,
        buildId: this.deviceInfo.crtTabBuildId || '',
        focusDevice,
      }
      if(attentionType === 'cancelAttention'){
        // 达到上限后取消关注
        params.deviceId = this.deviceIdList
      } else {
        params.deviceId = [this.deviceInfo.id]
      }

      if(params.deviceId.length == 0) return this.isTooMuch= false
      this.$http({
        method:'post',
        url:'/api/json/platformDeviceApi/setFocusDevice',
        data: params
      })
        .then((res) => {
          console.log('then--------')
          if(res.data.result === '9000002') {
            // 关注设备达到限制
            this.isTooMuch = true
          } else {
            this.isTooMuch= false
            this.toggleRefreshBuild()
            this.deviceInfo.deviceProperties.other.focus = focusDevice
            this.deviceInfo = Object.assign({}, this.deviceInfo)
          }
        })
    },
    handleNoShow() {
      window.localStorage.setItem('aiot-attention-first', true)
      this.noShowFlag = true
    },
    confirmNoShow() {
      this.noShowFlag = true
    },
    jugeId(id) {
      return this.deviceIdList.includes(id)
    },
    handleFocus(device, val){
      let setArr = new Set(this.deviceIdList)
      if(val === '1') {
        setArr.add(device.id)
      } else {
        setArr.delete(device.id)
      }
      this.deviceIdList = [...setArr]
      console.log(this.deviceIdList)
      // this.focusList = Object.assign({}, this.focusList)
    }
  },
  watch: {
    isTooMuch(val) {
      if(val) {
        this.deviceIdList = []
      }
    }
  }
}

