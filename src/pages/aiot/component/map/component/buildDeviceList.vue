<template>
  <!-- 视频监控列表 -->
  <div class="dialog-main">
    <div class="dialog-title">
      <div class="name">{{selectDevice.name}}设备</div>
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

    <div v-if="accessList && accessList.length >0" class="dialog-content" >
      <!-- 房间设备 -->
      <div
          v-if="listType == 'roomDevice'"
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
      <!-- 其他 -->
      <div
          v-else
          class="wrap-item">
        <div 
          v-for="(it, idx) in accessList"
          :key="idx"
          :class="[{'red': it.deviceStatus === '0'}, 'item']"
          @click="changeDialog(it)">
            <div v-if="Array.isArray(it.deviceProperties.location)">
              <template v-if="it.deviceProperties.location[0].groupName">
                {{it.deviceProperties.location[0].groupName}}/
              </template>
               <template v-if="it.deviceProperties.location[0].unitName">
                {{it.deviceProperties.location[0].unitName}}/
              </template>
               <template v-if="it.deviceProperties.location[0].gateName">
                {{it.deviceProperties.location[0].gateName}}
              </template>
              {{it.deviceName}}
            </div>
            <div v-else >
              <template v-if="it.deviceProperties.location.groupName">
                {{it.deviceProperties.location.groupName}}/
              </template>
               <template v-if="it.deviceProperties.location.unitName">
                {{it.deviceProperties.location.unitName}}/
              </template>
               <template v-if="it.deviceProperties.location.gateName">
                {{it.deviceProperties.location.gateName}}
              </template>
              {{it.deviceName}}
            </div>
            <span v-if="it.deviceStatus === '0'">离线</span>
        </div>
        <!-- 室内设备 可以定位房间 -->
        <!-- <div 
          v-if="listType == 'roomDevice'"
          v-for="(it, idx) in accessList"
          :key="idx"
          :class="[{'red':!+it.deviceStatus}, 'room item']"
          @click="changeDialog(it)">
            <div v-if="Array.isArray(it.deviceProperties.location)">
              {{it.deviceProperties.location[0].roomName}}
            </div>
            <div v-else>
              {{it.deviceProperties.location.roomName}}
            </div>

            <span v-if="!+it.deviceStatus">离线</span>
        </div> -->
        <!-- 二代门禁 和 四代门禁 -->
        <!-- <div 
          v-if="listType == 'mj'"
          v-for="(it, idx) in accessList"
          :key="idx"
          class="item"
          @click="changeDialog(it)">
            <template v-if="Array.isArray(it.deviceProperties.location)">
              {{it.deviceProperties.location[0].groupName}}/
              {{it.deviceProperties.location[0].unitName}}/
              {{it.deviceProperties.location[0].gateName}}
            </template>
            <template v-else>
              {{it.deviceProperties.location.groupName}}/
              {{it.deviceProperties.location.unitName}}/
              {{it.deviceProperties.location.gateName}}
            </template>
        </div> -->
        <!-- 其他不能定位房间的设备 -->
        <!-- <div 
          v-if="listType == 'other'"
          v-for="(it, idx) in accessList"
          :key="idx"
          class="item"
          @click="changeDialog(it)">
            <template v-if="Array.isArray(it.deviceProperties.location)">
              {{it.deviceProperties.location[0].unitName}}
            </template>
            <template v-else>
              {{it.deviceProperties.location.unitName}}
            </template>
            {{it.deviceName}}
        </div> -->
      </div>
      <!-- 水电表门锁 -->
      <!-- 网关 -->
      <!-- <div class="sub-title">网关</div>
      <div class="wrap-item">
        <div  
          v-for="(it, idx) in accessList" :key="idx"
          class="room item"
          @click="changeDialog(it)">
            {{it.deviceProperties.location[0].gateName}}
        </div>
      </div> -->
      <!-- 公区 水表--> 
      <!-- <template v-if="cutTab.deviceType == 'water' || cutTab.deviceType == 'hotwater'">
        <div class="sub-title">公区水表</div>
        <div class="wrap-item">
          <div  
            v-for="(it, idx) in accessList" :key="idx"
            :class="[{'room': cutTab.deviceType == 'inner'}, 'item']"
            @click="changeDialog(it)">
              {{it.deviceProperties.location[1].gateName}}{{it.deviceProperties.location[1].direction}}
          </div>
        </div>
      </template> -->
      <!-- 房屋 -->
      <!-- <div class="sub-title">房屋{{deviceName}}</div>
      <div v-if="romList && romList.length > 0" class="wrap-item">
        <div  
          v-for="(it, idx) in romList" :key="idx"
          :class="[{'room': cutTab.deviceType == 'inner'}, 'item']"
          @click="changeDialog(it)">
            {{it.deviceProperties.location[2].roomName}}
        </div>
      </div> -->
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

      // 网关
      gateList: [{
        name: '1 楼网关'
      },{
        name: '2 楼网关'
      }],

      // 公共区
      publicList: [{
        name: '1 楼网关'
      }],

      romList: [{
        name: '301'
      },{
        name: '302'
      }],

    }
  },
  computed: {
    ...mapState(['rank', 'rankName']),
    ...mapGetters(['projectId']),
    listType(){
      if(this.cutTab.deviceType == 'roommastermachhine'
          || this.cutTab.deviceType == 'roompad'
          || this.cutTab.deviceType == 'roomslavermachine'
          || this.cutTab.deviceType == 'elec'
          || this.cutTab.deviceType == 'hotwater'
          || this.cutTab.deviceType == 'water'
          || this.cutTab.deviceType == 'locker'
        ) {
        return 'roomDevice'
      } else if(this.cutTab.deviceType == 'doorctl_v2' || this.cutTab.deviceType == 'doorctl') {
        return 'mj'
      }else {
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
          buildId: this.selectDevice.id,
          sysType: tab.deviceType,
          pageNo: '1',
          pageSize: '1000',
        }
      })
    },
    changeDialog(val) {
      let deviceInfo  = Object.assign({}, val, {deviceTypeName: this.cutTab.deviceName})
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
