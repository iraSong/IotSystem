<template>
  <!-- 视频监控列表 -->
  <div class="dialog-main">
    <!-- 标题 -->
    <div class="dialog-title">
      <div class="name">{{selectDevice.buildName}}设备</div>
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
      <!-- 水电表--> 
      <template v-if="listType == 'waterWatt'">
        <!-- 公区水电表--> 
        <template v-if="publicList && publicList.length > 0">
          <div class="sub-title">公区{{name}}表</div>
          <div class="wrap-item" v-if="publicList && publicList.length > 0">
            <div 
              v-for="(it, idx) in publicList"
              :key="idx"
              :class="[{'red': it.deviceStatus === '0'}, 'room item']"
              @click="changeDialog(it)">
                <div>
                  {{it.deviceProperties.location | parseWaterWattLocation}}
                </div>
                <span v-if="it.deviceStatus === '0'">离线</span>
            </div>
          </div>
        </template>
        <!-- 房屋水电表--> 
        <template v-if="roomList && roomList.length > 0">
          <div class="sub-title">房屋{{name}}表</div>
          <div class="wrap-item">
            <div 
              v-for="(it, idx) in roomList"
              :key="idx"
              :class="[{'red': it.deviceStatus === '0'}, 'room item']"
              @click="changeDialog(it)">
                <div>
                  {{it.deviceProperties.location | parseWaterWattLocation}}
                </div>
                <span v-if="it.deviceStatus === '0'">离线</span>
            </div>
          </div>
        </template>
      </template>
      <!-- 房间设备 显示房间号 -->
      <div
          v-else-if="listType == 'roomDevice'"
          class="wrap-item">
        <div 
          v-for="(it, idx) in accessList"
          :key="idx"
          :class="[{'red': it.deviceStatus === '0'}, 'room item']"
          @click="changeDialog(it)">
            <div v-if="Array.isArray(it.deviceProperties.location)" >
              {{it.deviceProperties.location[0].roomName}}
            </div>
            <div v-else>
              {{it.deviceProperties.location.roomName}}
            </div>
            <span v-if="it.deviceStatus === '0'">离线</span>
        </div>
      </div>
      <!-- 其他  显示location + 设备名称-->
      <div
          v-else
          class="wrap-item">
        <div 
          v-for="(it, idx) in accessList"
          :key="idx"
          :class="[{'red': it.deviceStatus === '0'}, 'item']"
          @click="changeDialog(it)">
            <div>
              <template v-if="selectDevice.deviceType =='lockergateway'">
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
  props: ['selectDevice'],
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
    name() {
      /* eslint-disable no-unreachable */
      switch(this.cutTab.deviceType) {
        // 通行设备
        case 'elec':
          return '电'
          break
        case 'hotwater':
          return '水'
          break
        case 'water':
          return '水'
          break
        default:
          return ''
      }
    },
    listType(){
      if(this.cutTab.deviceType == 'elec'
          || this.cutTab.deviceType == 'hotwater'
          || this.cutTab.deviceType == 'water') {
          // 水电表列表需要显示公区和房间水电表
        return 'waterWatt'
      } else if(this.cutTab.deviceType == 'roommastermachhine'
          || this.cutTab.deviceType == 'roompad'
          || this.cutTab.deviceType == 'roomslavermachine'
          || this.cutTab.deviceType == 'locker'
        ) {
          // 这些设备显示房间号
        return 'roomDevice'
      } else {
        return 'other'
      }
    },
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
          buildId: this.selectDevice.buildId
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
                if(this.listType == 'waterWatt') {
                  // 水电表 需要区分房屋和公区
                  this.dealListData(this.accessList)
                } 
              })
          }
        })
    },
    changeTab(tab) {
      this.getDeviceList(tab)
        .then((res) => {
          this.cutTab = tab // tab 对象
          this.accessList = res.data.deviceList
          if(this.listType == 'waterWatt') {
           // 水电表 需要区分房屋和公区
            this.dealListData(this.accessList)
          } 
        })
    },
    getDeviceList(tab) {
      return this.$http({
        method:'post',
        url:'/api/json/platformDeviceApi/getDeviceList',
        data:{
          projectId: this.projectId,
          buildId: this.selectDevice.buildId,
          sysType: tab.deviceType,
          pageNo: '1',
          pageSize: '1000',
        }
      })
    },
    dealListData(list) {
      let roomList = [] // 房屋水电表
      let publicList = [] // 公区水电表
      if(list && list.length > 0){
        list.forEach(el => {
          let location = el.deviceProperties.location
          if(Array.isArray(location)){
            location = location[0]
          }
          if(location.roomName){
            roomList.push(el)
          } else {
            publicList.push(el)
          }
        })
      }
      console.log(roomList)
      this.roomList = roomList
      this.publicList = publicList
    },
    changeDialog(val) {
      let deviceInfo  = Object.assign({}, val, {crtTabDeviceType: this.cutTab.deviceType}, {crtTabBuildId: this.selectDevice.buildId})
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
