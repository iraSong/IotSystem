<template>
  <!-- 社区设备列表 -->
  <div class="dialog-main">
    <div class="dialog-title">
      <div class="name">{{selectDevice.deviceName}}</div>
      <div class="close" @click.stop="close" />
    </div>
    <div  v-if="accessList && accessList.length >0" class="dialog-content">
      <!-- v-if="listType == 'mj'"  -->
      <div 
        class="wrap-item" >
        <!-- 二代门禁 和 四代门禁 -->
        <div 
          v-for="(it, idx) in accessList"
          :key="idx"
          :class="[{'red': it.deviceStatus === '0'}, 'item']"
          @click="changeDialog(it)">
            <div v-if="Array.isArray(it.deviceProperties.location)" >
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
      </div>

      <!-- 其他设备 -->
      <!-- <div v-if="listType == 'other'" class="wrap-item">
        <div 
          v-for="(it, idx) in accessList"
          :key="idx"
          class="item"
          @click="changeDialog(it)">
            {{it.deviceProperties.location[0].unitName}}
            <template v-if="Array.isArray(it.deviceProperties.location)">
              {{it.deviceProperties.location[0].unitName}}
            </template>
            <template v-else>
              {{it.deviceProperties.location.unitName}}
            </template>
            {{it.deviceName}}
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
      accessList: [],
    }
  },
  computed: {
    ...mapState(['rank', 'rankName']),
    ...mapGetters(['projectId']),
    listType(){
      if(this.selectDevice.deviceType == 'doorctl_v2' || this.selectDevice.deviceType == 'doorctl') {
        return 'mj'
      } else {
        return 'other'
      }
    },
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$http({
        method:'post',
        url:'/api/json/platformDeviceApi/getDeviceList',
        data:{
          projectId: this.projectId,
          buildId: '',
          sysType: this.selectDevice.deviceType,
          pageNo: '1',
          pageSize: '1000',
        }
      })
        .then((res) => {
          this.accessList = res.data.deviceList
          console.log(this.accessList)
        })
    },
    changeDialog(val) {
      let deviceInfo  = Object.assign({}, val, {deviceTypeName: this.selectDevice.deviceName})
      this.$emit('changeDialog', deviceInfo)
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
