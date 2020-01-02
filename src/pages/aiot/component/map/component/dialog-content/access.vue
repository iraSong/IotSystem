<template>

  <div class="dialog-main detail" @click="showPanel = false; isfirst = false">
    <div class="dialog-title">
      <div class="name">
        {{deviceInfo.deviceProperties.location | parseLocation}}
        {{deviceInfo.deviceName}}
        {{deviceInfo.crtTabDeviceType | typeToName}}

        <div v-if="isAttention" class="attention">

          <img v-if="focus === '1'"
            @click="setAttention('0')" class="attention-img"
            src="~@assets/img/demo/attention.png" />

          <img v-else  
            @click="setAttention('1')" 
            class="attention-img" 
            src="~@assets/img/demo/notAttention.png" />

          <div
            v-if="!noShowFlag"
            class="open-panel">
            <div class="panel-arrow"></div>
            <div class="item">
              被标记的设备将会出现在首页。
            </div>
            <div class="item">
              <div class="footer">
                <div class="footer-txt" @click="handleNoShow">不再提示</div>
                <button class="confirm" @click="confirmNoShow">确定</button>
              </div>
            </div>
          </div>
          <!-- 关注上限 -->
          <div
            v-else-if="isTooMuch"
            class="open-panel">
            <div class="panel-arrow"></div>
            <div class="item">
              <p>每栋楼最多可标记 3 台设备，</p>
              <p>可取消以下设备标记来完成本次操作。</p>
            </div>
            <div class="item list">
              <template v-for="typeItem in focusList">
                <div class="device-item" 
                  v-for="device in typeItem.list"
                  :key="device.id + 'public'" >
                  <i class="point" />
                  <div class="device-name">
                    {{device.deviceProperties.location | parseLocation}}
                    {{device.deviceName}}
                    {{device.deviceProperties.type | typeToName}}
                  </div>

                  <img
                    v-if="jugeId(device.id)"
                    @click.stop="handleFocus(device, '0')" 
                    class="attention-img" 
                    src="~@assets/img/demo/notAttention.png" />

                  <img v-else  @click.stop="handleFocus(device, '1')"
                   class="attention-img" 
                   src="~@assets/img/demo/attention.png" />
                </div>
              </template>
            </div>

            <div class="footer">
              <button class="cancel footer" @click.stop>取消</button>
              <button class="confirm" @click="setAttention('0', 'cancelAttention')">完成</button>
            </div>
          </div>
        
        
        </div>


      </div>
      <div class="back" @click.stop="back" v-if="!hideBack"></div>
      <div class="close" @click.stop="close" />
    </div>
    <!--  有监控配置 -->
    <div v-if="hasMoniter" class="dialog-content">
      <div class="right">
        <!-- 今日通行 -->
        <div class="info">
          <div class="sn pass-title">
            <div class="txt">今日通行次数：</div>
            <div class="yantramanav num" >
              {{passCount}}
            </div>
          </div>
        </div>
        <!-- 设备编号 -->
        <div class="info">
          <div class="sn" v-if="isDoorctl">设备编号：{{deviceInfo.deviceMac}}</div>
          <div class="sn" v-else>设备编号：{{deviceInfo.deviceSn}}</div>
          <div class="status"> 设备状态：{{deviceInfo.deviceStatus | deviceStatus}}</div>
        </div>
        <!-- 设备标记 -->
        <div class="info" v-if="deviceInfo.deviceName">
          <div class="sn">设备标记：{{deviceInfo.deviceName}}</div>
        </div>

        <div class="title-table">
          <div class="wrap-tab">
           <div :class="[{'active' : tableTab == 'access' }, 'item-tab border-left']" @click="changeTab('access')">通行记录</div>
            <div :class="[{'active' : tableTab == 'event' }, 'item-tab border-right']" @click="changeTab('event')">事件记录</div>
          </div>
        </div>
        <!-- 通行记录 -->
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
        <!-- 事件记录 -->
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
              <td >{{it.status}}</td>
              <!-- <td >{{it.alarmLvl}}</td> -->
            </tr>
          </tbody>
        </table>
      </div>

      <div class="left">
        <div class="device-name">
          <i class="icon" />门禁周边监控：
          <div class="select-panel">
            <span @click.stop="showPanel = true" class="txt-select">1 楼大堂监控</span>
            <i class="i-arrow ps-arrow"/>
            <div v-show="showPanel" @click.stop class="open-panel">
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
        <div class="info">
          <div class="sn pass-title">
            <div class="txt">今日通行次数：</div>
            <div class="yantramanav num" >
              {{passCount}}
            </div>
          </div>
        </div>
        <div class="info">
          <div class="sn" v-if="isDoorctl">设备编号：{{deviceInfo.deviceMac}}</div>
          <div class="sn" v-else>设备编号：{{deviceInfo.deviceSn}}</div>
          <div class="status"> 设备状态：{{deviceInfo.deviceStatus | deviceStatus}}</div>
        </div>

        <div class="info" v-if="deviceInfo.deviceName">
          <div class="sn">设备标记：{{deviceInfo.deviceName}}</div>
        </div>
      </div>

      <div class="left">
        <div class="title-table">
          <div class="wrap-tab" v-if="isPass">
            <div :class="[{'active' : tableTab == 'access' }, 'item-tab border-left']" @click="changeTab('access')">通行记录</div>
            <div :class="[{'active' : tableTab == 'event' }, 'item-tab border-right']" @click="changeTab('event')">事件记录</div>
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
                <td >{{it.status}}</td>
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
import { mapState, mapGetters, mapMutations } from 'vuex'
import moment from 'moment'

import { mixAttention } from '../../../../mixins/attention.js'
export default {
  mixins: [mixAttention],
  props: ['deviceInfo','refesh', 'hideBack'],
  data() {
    return {
      showPanel: false,
      hasMoniter: false,
      tableTab: 'access', // access 通行记录 event 事件记录
      isPass: true,

      recordList: [],
      passCount: 0, // 通行次数
    }
  },
  computed: {
    ...mapState(['rank', 'rankName']),
    ...mapGetters(['projectId', 'focusList']),
    isDoorctl() {
      let deviceType = this.deviceInfo.crtTabDeviceType
      return deviceType == 'doorctl_v2' || deviceType == 'doorctl'
    },
    focus() {
      if(this.deviceInfo.deviceProperties.other) {
        return this.deviceInfo.deviceProperties.other.focus 
      } else {
        return '0'
      }
    },
    isRomm() {
      let location = this.deviceInfo.deviceProperties.location
      if(Array.isArray(location)){
        location = location[0]
      }
      if(location.roomName){
        return true
      } else {
        return false
      }
    }
  },
  components: {
  },
  mounted() {
    if(!this.deviceInfo.deviceProperties.other) {
      this.deviceInfo.deviceProperties.other = {}
    }
  },
  methods: {
    ...mapMutations(['toggleRefreshBuild']),
    getLogType() {
      let type = ''
      // let deviceType = this.deviceInfo.deviceProperties.type
      let deviceType = this.deviceInfo.crtTabDeviceType
      
      if(this.tableTab == 'access') {
        // 通行记录
        if( deviceType == 'doorctl_v2') { 
          // 二代门禁
          type = 'brake_pass_v2'
        } else if(deviceType == 'doorctl') {
          // 四代门禁
          type = 'qdh_sentry_brake_pass'
        } else if(deviceType == 'facegate') {
          // 人脸门口机
          type = 'face_sentry_face_pass'
        } else {
          // 对讲机
          type = 'cloud_talk_unlock_record,qdmgr_local3_unlock_record'
        }
      } else if(this.tableTab == 'event'){
        // 事件记录
        if(deviceType == 'facegate') {
          // 人脸门口机
          type = 'face_sentry_face_alert'
        } else {
          type = 'qdh_gy_locker_locker_status'
        }
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
          console.log(res)
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
    },
    getCurrentDayPassCount() {
      let logType = this.getLogType()
      this.$http({
        method:'post',
        url:'/api/json/deviceLogApi/getDeviceLog',
        data:{
          projectId: this.projectId,
          sn: this.deviceInfo.deviceSn,
          mac: this.deviceInfo.deviceMac,
          index: logType,
          beginTime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
          pageNo: '1',
          pageSize: '10000',
        }
      })
        .then((res) => {
          this.passCount = res.data.totalCnt
        })
    },

  },
  watch: {
    refesh() {
      this.getLogList()
      // 获取当日通行次数
      this.getCurrentDayPassCount()
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
    background:#3c4247;
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
      border-color: transparent transparent #3c4247 transparent;
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

      background: #3c4247;
      background-size:100% 100%;
      filter: blur(12px);
    }
    .panel-item{
      position: relative;
      background: #3c4247;
      width:212px;
      padding:4px 16px;
      .content{
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: rgba(255,255,255,0.8);
      }
      &.active::before{
        position: absolute;
        top: 18px;
        right: 30px;
        content: "";
        width: 18px;
        height: 12px;
        background: url("~@assets/img/demo/right.png");
        background-size: 100% 100%;
        color: #00b7ff;
      }
    }
  }
}


.open-panel {
  opacity: 1;
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: absolute;
  top: 38px;
  left: 160px;
  z-index: 999;
  transform: translate(-50%, 0);
  background: #3b4a55;
  border-radius: 5px;
  padding: 15px 24px;
  .panel-arrow {
    width: 0;
    height: 0;
    border-width: 12px;
    border-style: solid;
    border-color: transparent transparent #3b4a55 transparent;
    position: absolute;
    top: -23px;
    left: 25px;
    transform: translate(-50%, 0);
  }

  .item {
    position: relative;
    height: auto;
    width: 304px;
    color: rgba(255, 255, 255, 0.8);
    line-height: 40px;
    text-align: left;
    line-height:24px;
    font-size:14px;
    &.list{
      max-height: 350px;
      overflow: auto;
    }
    .device-item{
      margin: 16px 0;
      display: flex;
      align-items: center;
      i{
        display: inline-block;
        width: 6px;
        height:6px;
        border-radius: 50%;
        background:rgba(255,255,255,0.8);
        margin-right: 8px;
      }
      .device-name{
        color: rgba(255, 255, 255, 0.6);
        font-size: 12px;
        width: 240px;
        margin-right: 16px;
      }
    }
  }

  .footer{
    position: relative;
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right:16px;
    font-size: 14px;
    .cancel{
      outline:none;
      border-radius:2px;
      border:1px solid rgba(255,255,255,0.4);
      color:rgba(255,255,255,0.8);
      background: transparent;
      margin-right: 16px;
      &.footer{
        width: 56px;
        height: 28px;
      }
    }
    .confirm{
      outline:none;
      border: none;
      color:rgba(255,255,255,1);
      background:#00B7FF;
      border-radius:2px;
      &[disabled] {
        color:rgba(255,255,255,.6);
        background: #419dc1;
      }
    }
    .footer-txt{
      color:rgba(255,255,255,0.8);
      margin-right: 16px;
    }
  }
}
</style>
