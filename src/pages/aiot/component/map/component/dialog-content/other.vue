<template>
  <div class="dialog-main detail">
    <div class="dialog-title">
      <div class="name" v-if="deviceInfo">
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
              <button class="cancel footer" @click.stop="isTooMuch = false">取消</button>
              <button class="confirm" @click="setAttention('0', 'cancelAttention')">完成</button>
            </div>
          </div>
        
        
        </div>

      </div>
      <div class="back" v-if="!hideBack"  @click.stop="back" ></div>
      <div class="close" @click.stop="close" />
    </div>
    <!--  有监控配置 -->
    <div v-if="hasMoniter" class="dialog-content">
      <div class="right">
        <div class="info">
          <div class="sn pass-title">
            <div class="txt">今日通行次数：</div>
            <div class="yantramanav num" 
              v-if="recordList && recordList.length > 0">
              {{recordList[recordList.length - 1]}}
            </div>
          </div>
        </div>
        <div class="info">
          <div class="sn"><i class="icon" />设备编号：{{deviceInfo.deviceSn}}</div>
          <div class="status"><i class="icon" /> 设备状态：{{deviceInfo.deviceStatus | deviceStatus}}</div>
        </div>

        <div class="title-table">
          通行记录
        </div>
        <table class="table" v-show="tableTab == 'access'">
          <thead>
            <tr>
              <th>进场时间</th>
              <th>类型</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(it, idx) in recordList" :key="idx">
              <td >{{it.recordTime}}</td>
              <td >
                {{it.passType}}
                <template v-if="it.cardNo && it.cardNo != '0'">
                  ({{it.cardNo}})
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="left">
        <div class="device-name">
          最新进场车辆照片
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
          <div class="sn"><i class="icon" />设备编号：{{deviceInfo.deviceSn}}</div>
          <div class="status"><i class="icon" /> 设备状态：{{deviceInfo.deviceStatus | deviceStatus}}</div>
        </div>
        <div class="info" v-if="deviceInfo.deviceName">
          <div class="sn"><i class="icon" />设备标记：
            <template v-if="deviceType =='lockergateway'">
              {{deviceInfo.desc}}
            </template>
            {{deviceInfo.deviceName}}
         </div>
        </div>
      </div>
      <div class="left">
        <div class="title-table">
          <div class="wrap-tab">
            事件记录
          </div>

        </div>
        <table class="table" >
          <thead>
            <tr>
              <th>时间</th>
              <th>事件类型</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(it, idx) in recordList" :key="idx">
              <td>{{it.recordTime}}</td>
              <td>
                {{it.status}}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
//  没有绑定楼栋设备 弹框
import { mapState, mapGetters, mapMutations } from 'vuex'

import { mixAttention } from '../../../../mixins/attention.js'
export default {
  mixins: [mixAttention],
  props: ['deviceInfo', 'refesh', 'hideBack'],
  data() {
    return {
      showPanel: false,
      hasMoniter: false,
      tableTab: 'access', // access 通行记录 event 事件记录

      isPass: true, // 是否通行设备

      recordList: [],

    }
  },
  computed: {
    ...mapState(['rank', 'rankName']),
    ...mapGetters(['projectId', 'focusList']),
    deviceType() {
      return this.deviceInfo.deviceProperties.type
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
      let deviceType = this.deviceInfo.deviceProperties.type
      // 事件记录
      if(deviceType == 'lockergateway') {
        // 门锁网关
        type = 'qdh_gy_locker_locker_gateway_status'
      } else if(deviceType == 'gateway') {
        // 水电表网关
        type = 'gy_sys_gateway_status'
      } else {
        // 对讲机
        type = 'cloud_talk_unlock_record,qdmgr_local3_unlock_record'
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
    close() {
      this.$emit('close', false)
    },
    back() {
      this.$emit('doShowList')
    },
    // setAttention(focusDevice) {
    //   this.$http({
    //     method:'post',
    //     url:'/api/json/platformDeviceApi/setFocusDevice',
    //     data:{
    //       projectId: this.projectId,
    //       buildId: this.deviceInfo.crtTabBuildId || '',
    //       deviceId: this.deviceInfo.id,
    //       focusDevice,
    //     }
    //   })
    //     .then(() => {
    //       this.toggleRefreshBuild()
    //       this.deviceInfo.deviceProperties.other.focus = focusDevice
    //       this.deviceInfo = Object.assign({}, this.deviceInfo)
    //     })
    // }
  },
  watch: {
    refesh() {
      console.log('-----refesh')
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
