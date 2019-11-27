<template>

  <div class="dialog-main detail">
    <div class="dialog-title">
      <div class="name">
        <template v-if="Array.isArray(deviceInfo.deviceProperties.location)">
          <template v-if="deviceInfo.deviceProperties.location[0].groupName">
            {{deviceInfo.deviceProperties.location[0].groupName}}/
          </template>
            <template v-if="deviceInfo.deviceProperties.location[0].unitName">
            {{deviceInfo.deviceProperties.location[0].unitName}}/
          </template>
            <template v-if="deviceInfo.deviceProperties.location[0].gateName">
            {{deviceInfo.deviceProperties.location[0].gateName}}
          </template>
        </template>
        <template v-else>
          {{deviceInfo.deviceProperties.location.groupName}}/
          {{deviceInfo.deviceProperties.location.unitName}}/
          {{deviceInfo.deviceProperties.location.gateName}}

          <template v-if="deviceInfo.deviceProperties.location.groupName">
            {{deviceInfo.deviceProperties.location.groupName}}/
          </template>
            <template v-if="deviceInfo.deviceProperties.location.unitName">
            {{deviceInfo.deviceProperties.location.unitName}}/
          </template>
            <template v-if="deviceInfo.deviceProperties.location.gateName">
            {{deviceInfo.deviceProperties.location.gateName}}
          </template>
        </template>
        {{deviceInfo.deviceTypeName}}
      </div>
      <div class="back" @click.stop="back" ></div>
      <div class="close" @click.stop="close" />
    </div>
    <!--  无监控配置 -->
    <div class="dialog-content">
      <div class="right">
        <div class="info">
          <div class="sn"><i class="icon" />设备编号：{{deviceInfo.deviceSn}}</div>
          <div class="status"><i class="icon" /> 设备状态：{{deviceInfo.deviceStatus | deviceStatus}}</div>
        </div>
      </div>

      <div class="left">
        <div class="title-table">
          事件记录
        </div>
        <table class="table" >
          <thead>
            <tr>
              <th>时间</th>
              <th>事件类型</th>
              <th>事件等级</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(it, idx) in recordList" :key="idx + '2'">
              <td >{{it.recordTime}}</td>
              <td >{{it.status}}</td>
              <td >{{it.alarmLvl}}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'

export default {
  props: ['deviceInfo', 'type','refesh'],
  data() {
    return {
      showPanel: false,
      hasMoniter: false,
      tableTab: 'access', // access 通行记录 event 事件记录

      recordList: [],
    }
  },
  computed: {
    ...mapState(['rank', 'rankName']),
    ...mapGetters(['projectId']),
  },
  components: {
  },
  mounted() {
  },
  methods: {
    getLogType() {
      let type = 'cloud_talk_unlock_record'
      let deviceType = this.deviceInfo.deviceProperties.type
      if(deviceType == 'alarmgateway' || deviceType == 'facegate' || deviceType == 'faceSentry') { 
        type = ''
      } else if(deviceType == 'lockergateway') {
        type = 'qdh_gy_locker_locker_gateway_status'
      } else if(deviceType == 'gateway') {
        type = 'gy_sys_gateway_status'
      }
      return type
    },
    getEventLogList() {
      let logType = this.getLogType()
      this.$http({
        method:'post',
        url:'/api/json/deviceLogApi/getDeviceLog',
        data:{
          projectId: this.projectId,
          sn: this.deviceInfo.deviceSn,
          mac: this.deviceInfo.deviceMac,
          index: logType,
          pageNo: '1',
          pageSize: '10',
        }
      })
        .then((res) => {
          this.recordList = res.data.recordList
        })
    },
    close() {
      this.$emit('close', false)
    },
    back() {
      this.$emit('doShowList')
    }

  },
  watch: {
    refesh() {
      this.getEventLogList()
    }
  }
}
</script>
<style lang="less" scoped>
.select-panel{
  position: relative;
  display: inline-block;
  .txt-select{
    color: #00B7FF;
  }
  .ps-arrow{
    position: relative;
    top:10px;
    left: 4px;
    border-top-color:#00B7FF;
  }
  .open-panel{
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.08);
    position: absolute;
    top: 36px;
    left: 0;
    z-index: 9999;
    .panel-arrow{
      width: 0;
      height: 0;
      border-width: 10px;
      border-style: solid;
      border-color: transparent transparent #575c5e transparent;
      position: absolute;
      top: -19px;
      left: 13%;
      transform: translate(-50%, 0);
      z-index: 1;
    }
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      background: #343434;
      background-size:100% 100%;
      filter: blur(12px);
    }
    .panel-item{
      position: relative;
      background: rgba(136, 135, 135, 0.6);
      width:212px;
      padding:4px 16px;
      .content{
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: rgba(255,255,255,0.8);
      }
      &.active::before{
        font-family: serif;
        position: absolute;
        top: 8px;
        right: 30px;
        content: '√';
        width: 10px;
        height: 10px;
        color: #00B7FF;
        font-size: 18px;
        line-height: 100%;
      }
    }
  }
}
</style>
