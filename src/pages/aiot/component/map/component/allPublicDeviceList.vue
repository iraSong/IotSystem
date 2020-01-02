<template>
  <!-- 全部公区设备 -->
  <div class="dialog-main">
    <!-- 标题 -->
    <div class="dialog-title">
      <div class="name">全部公区设备</div>
      <div class="tab flex-center">
        <div 
          v-for="it in deviceTypeList" :key="it.deviceType"
          :class="[{ 'active': cutTab.deviceType == it.deviceType }, 'tab-item']" 
          @click="changeTab(it)">
            {{it.deviceName}}
        </div>
      </div>
      <div class="close" @click.stop="close" />
    </div>
    <!-- 列表 -->
    <div v-if="accessList && accessList.length >0" class="dialog-content" >
      <div class="wrap-item">
        <div 
          v-for="(it, idx) in accessList"
          :key="idx"
          :class="[{'red': it.deviceStatus === '0'}, 'item']"
          @click="changeDialog(it)">
            <div>
              <template v-if="it.deviceProperties.type =='lockergateway'">
                {{it.desc}}
              </template>
              {{it.deviceProperties.location | parseLocation}}
              {{it.deviceName}}
            </div>
            <span v-if="it.deviceStatus === '0'">离线</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'

export default {
  data() {
    return {
      cutTab: '', // 当前tab 值为 deviceType
      deviceTypeList: [], // tab list
      accessList: [],
      publicList: [], // 公共区
      roomList: [], // 房屋
    }
  },
  computed: {
    ...mapState(['rank', 'rankName']),
    ...mapGetters(['projectId']),
  },
  mounted() {
    this.getDeviceTypeList() // 获取楼栋设备列表
  },
  methods: {
    getDeviceTypeList() {
      this.$http({
        method:'post',
        url:'/api/json/platformDeviceApi/getDeviceTypeList',
        data:{
          projectId: this.projectId,
          buildId: ''
        }
      })
        .then((res) => {
          this.deviceTypeList = res.data.mapInfo
          // 设备类型存在，就获取第一个设备类型列表
          if(this.deviceTypeList.length > 0) {
            this.getDeviceList(this.deviceTypeList[0])
              .then((res) => {
                this.cutTab = this.deviceTypeList[0]
                this.accessList = res.data.deviceList
              })
          }
        })
    },
    changeTab(tab) {
      this.getDeviceList(tab)
        .then((res) => {
          this.cutTab = tab // tab 对象
          this.accessList = res.data.deviceList
        })
    },
    getDeviceList(tab) {
      return this.$http({
        method:'post',
        url:'/api/json/platformDeviceApi/getDeviceList',
        data:{
          projectId: this.projectId,
          buildId: '',
          sysType: tab.deviceType,
          pageNo: '1',
          pageSize: '1000',
        }
      })
    },
    changeDialog(val) {
      let deviceInfo  = Object.assign({}, val, {crtTabDeviceType: this.cutTab.deviceType})
      this.$emit('changeDialog',deviceInfo)
    },
    close() {
      this.$emit('close', false)
    }
  },
  watch: {
  }
}
</script>
<style lang="less" scoped>
</style>
