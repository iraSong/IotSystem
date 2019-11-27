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
    <!--  有监控配置 -->
    <div v-if="hasMoniter" class="dialog-content">
      <div class="right">
        <div class="info">
          <div class="sn">
            <i class="icon" />
            今日通行次数：
            <span class="yantramanav"> 1,002</span>
          </div>
        </div>
        <div class="info">
          <div class="sn"><i class="icon" />设备编号：{{deviceInfo.deviceSn}}</div>
          <div class="status"><i class="icon" /> 设备状态：{{deviceInfo.deviceStatus | deviceStatus}}</div>
        </div>

        <div class="title-table">
          <div class="wrap-tab">
           <div :class="[{'active' : tableTab == 'access' }, 'item-tab']" @click="changeTab('access')">通行记录</div>
            <div :class="[{'active' : tableTab == 'event' }, 'item-tab']" @click="changeTab('event')">事件记录</div>
          </div>

        </div>

        <table class="table" v-show="tableTab == 'access'">
          <thead>
            <tr>
              <th>时间</th>
              <th>通行人员</th>
              <th>身份</th>
              <th>通行类型</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(it, idx) in recordList" :key="idx">
              <td >{{it.recordTime}}</td>
              <td >
                  {{it.userName}}{{it.phone}}
              </td>
              <td >{{it.personLabel}}</td>
              <td >
                {{it.passType}}
                <template v-if="it.cardNo && it.cardNo != '0'">
                  ({{it.cardNo}})
                </template>
              </td>
            </tr>
          </tbody>
        </table>

        <table class="table" v-show="tableTab == 'event'">
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
              <td >{{it.operationType}}</td>
              <td >{{it.alarmLvl}}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="left">
        <div class="device-name">
          <i class="icon" />门禁周边监控：
          <div class="select-panel">
            <span @click="showPanel = true" class="txt-select">1 楼大堂监控</span>
            <i class="i-arrow ps-arrow"/>
            <div v-show="showPanel" class="open-panel">
              <div class="panel-arrow"></div>
              <div class="panel-item">
                <div class="content">监控 4</div>
              </div>
              <div class="panel-item">
                <div class="content">监控 4</div>
              </div>
              <div class="panel-item active">
                <div class="content">监控 4</div>
              </div>
              <div class="panel-item">
                <div class="content">监控 4</div>
              </div>
              <div class="panel-item">
                <div class="content">监控 4</div>
              </div>
            </div>
          </div>
        </div>
        <div class="wrap-video">
          <div class="play-mask"></div>
          <video id="video1">
            <source src="~@public/video.mp4" />
          </video>
        </div>
      </div>

    </div>
    <!--  无监控配置 -->
    <div v-else class="dialog-content">
      <div class="right">
        <!-- <div class="info">
          <div class="sn pass-title">
            <div class="txt">今日通行次数：</div>
            <div class="yantramanav num" 
              v-if="recordList && recordList.length > 0">
              {{recordList[recordList.length - 1].total}}
            </div>
          </div>
        </div> -->
        <div class="info">
          <div class="sn"><i class="icon" />设备编号：{{deviceInfo.deviceSn}}</div>
          <div class="status"><i class="icon" /> 设备状态：{{deviceInfo.deviceStatus | deviceStatus}}</div>
        </div>
      </div>

      <div class="left">
        <div class="title-table">
          <div class="wrap-tab" v-if="isPass">
            <div :class="[{'active' : tableTab == 'access' }, 'item-tab']" @click="changeTab('access')">通行记录</div>
            <div :class="[{'active' : tableTab == 'event' }, 'item-tab']" @click="changeTab('event')">事件记录</div>
          </div>
          <div class="wrap-tab" v-else>
            事件记录
          </div>
        </div>

        <div class="wrap-table">
          <table class="table" v-show="tableTab == 'access'">
            <thead>
              <tr>
                <th>时间</th>
                <th>通行人员</th>
                <th>身份</th>
                <th>通行类型</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(it, idx) in recordList" :key="idx">
                <td >{{it.recordTime}}</td>
                <td >
                    {{it.userName}}{{it.phone}}
                </td>
                <td >{{it.personLabel}}</td>
                <td >
                  {{it.passType}}
                  <template v-if="it.cardNo && it.cardNo != '0'">
                    ({{it.cardNo}})
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="table" v-show="tableTab == 'event'">
            <thead>
              <tr>
                <th>时间</th>
                <th>事件类型</th>
                <!-- <th>事件等级</th> -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="(it, idx) in recordList" :key="idx + '2'">
                <td >{{it.recordTime}}</td>
                <td >{{it.operationType}}</td>
                <!-- <td >{{it.alarmLvl}}</td> -->
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'

export default {
  props: ['deviceInfo','refesh'],
  data() {
    return {
      showPanel: false,
      hasMoniter: false,
      tableTab: 'access', // access 通行记录 event 事件记录
      isPass: true,

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
      let type = ''
      let deviceType = this.deviceInfo.deviceProperties.type
      if(this.tableTab == 'access') {
        // 通行记录
        if( deviceType == 'doorctl_v2') { 
          // 二代门禁
          this.isPass = true
          type = 'brake_pass_v2'
        } else if(deviceType == 'doorctl') {
          // 四代门禁
          this.isPass = true
          type = 'qdh_sentry_brake_pass'
        } else {
          // 对讲机
          this.isPass = false
          type = 'cloud_talk_unlock_record,qdmgr_local3_unlock_record'
        }
      } else if(this.tableTab == 'event'){
        type = 'qdh_gy_locker_locker_operation'
        // 事件记录
      }
      return type
    },
    getLogList() {
      let logType = this.getLogType()
      this.$http({
        method:'post',
        url:'/api/json/deviceLogApi/getDeviceLog',
        data:{
          projectId: this.projectId,
          sn: this.deviceInfo.deviceSn,
          mac: this.deviceInfo.deviceMac,
          index: logType, // 门锁
          pageNo: '1',
          pageSize: '10',
        }
      })
        .then((res) => {
          this.recordList = res.data.recordList
        })
    },
    changeTab(tab) {
      this.tableTab = tab
      this.getLogList()
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
      console.log('------------change')
      this.getLogList()
    }
  }
}
</script>
<style lang="less" scoped>
.yantramanav{
  font-size:20px;
}
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
