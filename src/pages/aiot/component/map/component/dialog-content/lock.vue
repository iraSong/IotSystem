<template>

  <div class="dialog-main detail">
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
      <div class="back" v-if="!hideBack"  @click.stop="back" ></div>
      <div class="close" @click.stop="close" />
    </div>
    <!--  门锁设备 -->
    <div class="dialog-content">
      <div class="right">
        <div class="info">
          <div class="sn"><i class="icon" />设备编号：{{deviceInfo.deviceSn}}</div>
          <div class="status"><i class="icon" /> 设备状态：{{deviceInfo.deviceStatus | deviceStatus}}</div>
        </div>
        <div class="info" v-if="deviceInfo.deviceName">
          <div class="sn"><i class="icon" />设备标记：{{deviceInfo.deviceName}}</div>
        </div>
        <div class="info">
          <div class="sn">
            <i class="icon" />
            电量：{{deviceInfo.deviceProperties.other.battery}}%（{{deviceInfo.deviceProperties.other.batteryUpdateTime | formatTime}}）
          </div>
        </div>
        <div class="info">
          <div class="sn">
            <i class="icon" />
            信号强度：{{deviceInfo.deviceProperties.other.rssi}}（{{deviceInfo.deviceProperties.other.rssiUpdateTime | formatTime}}}）
          </div>
        </div>
        <div class="info">
          <div class="sn">
            <button @click="showLockPassWord({lockDeviceInfo: deviceInfo})">下发新密码</button>
          </div>
        </div>
      </div>

      <div class="left">
        <div class="title-table">
          <div class="wrap-tab">
            <div :class="[{'active' : tableTab == 'event' }, 'item-tab border-left']" @click="changeTab('event')">事件记录</div>
            <div :class="[{'active' : tableTab == 'open' }, 'item-tab']" @click="changeTab('open')">开门记录</div>
            <div :class="[{'active' : tableTab == 'pwd' }, 'item-tab border-right']" @click="changeTab('pwd')">密码详情</div>
          </div>
        </div>
        <table class="table" v-show="tableTab == 'event'">
          <thead>
            <tr>
              <th>时间</th>
              <th>事件类型</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(it, idx) in recordList" :key="idx + '2'">
              <td >{{it.recordTime}}</td>
              <td >{{it.status}}</td>
            </tr>
          </tbody>
        </table>
        <table class="table" v-show="tableTab == 'open'">
          <thead>
            <tr>
              <th>用户</th>
              <th>开门方式</th>
              <th>开门时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(it, idx) in recordList" :key="idx">
              <td >{{it.userName}}</td>
              <td >{{it.opType}}</td>
              <td >{{it.recordTime}}</td>
            </tr>
          </tbody>
        </table>
        <table class="table" v-show="tableTab == 'pwd'">
          <thead>
            <tr>
              <th>被授权人</th>
              <th>密码</th>
              <th>密码类型</th>
              <th>密码时效</th>
              <th>备注</th>
              <th>密码状态</th>
              <th>下发人</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(it, idx) in pwdList" :key="idx + '3'">
              <td >{{it.userName}}</td>
              <td >{{it.password}}</td>
              <td >{{it.pwdType | pwdType}}</td>
              <td >{{it.validStartTime | formatTime}}-{{it.validStartTime | formatTime}}</td>
              <td >{{it.remark}}</td>
              <td >{{it.pwdStatus | pwdStatus}}</td>
              <td >{{it.createrName}}</td>
              <td class="btns" >
                <el-button type="text" @click="showLockPassWord({pwdDetail: it, dialogType: 'modify', lockDeviceInfo: deviceInfo})">修改</el-button>
                <el-button type="text" 
                  v-if="it.pwdStatus === '11' && it.pwdType !== 'offlinePwd'" 
                  @click="operatePwd(it, 'frozen')">
                  冻结
                </el-button>
                <el-button type="text" 
                  v-if="it.pwdStatus === '12' && it.pwdType !== 'offlinePwd'" 
                  @click="operatePwd(it, 'unfrozen')">
                  启用
                </el-button>
                <el-button type="text" @click="showConfirmDialog(it)">删除</el-button>
                <div  class="confirmDialog" v-if="it.showConfirm">
                  <div class="panel-arrow"></div>
                  <div class="title"><div class="icon">!</div><div class="txt">要删除该密码？</div></div>
                  <div class="footer">
                    <button class="cancel footer" @click="hideConfirmDialog(it)">取消</button>
                    <button class="confirm" @click="operatePwd(it, 'delete')">删除</button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

import { mixAttention } from '../../../../mixins/attention.js'
export default {
  mixins: [mixAttention],
  props: ['deviceInfo', 'type','refesh', 'hideBack'],
  data() {
    return {
      showPanel: false,
      hasMoniter: false,
      tableTab: 'event', // access 通行记录 event 事件记录

      recordList: [],
      openList: [],
      pwdList:[],
    }
  },
  computed: {
    ...mapState(['rank', 'rankName']),
    ...mapGetters(['projectId', 'focusList']),
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
    this.getEventLogList()
  },
  methods: {
    ...mapMutations(['toggleLockPasword', 'toggleRefreshBuild']),
    getLogType() {
      let type = ''
      if(this.tableTab == 'event') { 
        // 事件记录
        type = 'qdh_gy_locker_locker_status'
      } else if(this.tableTab == 'open') {
        // 开门记录
        type = 'qdh_gy_locker_locker_operation'
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
          index: logType, // 门锁
          pageNo: '1',
          pageSize: '10',
        }
      })
        .then((res) => {
          this.recordList = res.data.recordList
        })
    },
    getPwdLogList() {
      this.$http({
        method:'post',
        url:'/api/json/gyLockApi/getLockPwdList',
        data:{
          lockSn: this.deviceInfo.deviceSn,
          mac: this.deviceInfo.deviceMac,
          manufacturerId:this.deviceInfo.manufacturerId,
        }
      })
        .then((res) => {
          this.pwdList = res.data.content
        })
    },
    showLockPassWord(params) {
      this.toggleLockPasword(params)
    },
    operatePwd(item, operation) {
      this.$http({
        method:'post',
        url:'/api/json/gyLockApi/statusPassword',
        data: {
          manufacturerId: this.deviceInfo.manufacturerId,
          pwdId: item.pwdId,
          operation: operation,
        }
      })
        .then((res) => {
          this.getPwdLogList()
          item.showConfirm = false
          if (res.data && res.data.result === "1001") {
            this.$Message.success('操作成功！')
          } else {
            this.$Message.error(res.msg || '操作失败')
          }
        })
    },

    close() {
      this.$emit('close', false)
    },
    back() {
      this.$emit('doShowList')
    },
    changeTab(tab) {
      console.log(tab)
      this.tableTab = tab
      if(tab == 'event' || tab == 'open') {
        this.getEventLogList()
      } else if(tab == 'pwd') {
        this.getPwdLogList()
      }
    },

    setAttention(focusDevice) {
      console.log(this.deviceInfo)
      this.$http({
        method:'post',
        url:'/api/json/platformDeviceApi/setFocusDevice',
        data:{
          projectId: this.projectId,
          buildId: this.deviceInfo.crtTabBuildId || '',
          deviceId: this.deviceInfo.id,
          focusDevice,
        }
      })
        .then(() => {
          this.toggleRefreshBuild()
          this.deviceInfo.deviceProperties.other.focus = focusDevice
          this.deviceInfo = Object.assign({}, this.deviceInfo)
        })
    },
    showConfirmDialog(it) {
      it.showConfirm = true
      this.pwdList = Object.assign({}, this.pwdList)
    },
    hideConfirmDialog(it) {
      it.showConfirm = false
      this.pwdList = Object.assign({}, this.pwdList)
    },
  },
  watch: {
    refesh() {
      this.getEventLogList()
    }
  },
  filters: {
    pwdStatus(status) {
      /* eslint-disable no-unreachable */
      switch(status) {
        case '01':
          return '启用中'
          break
        case '02':
          return '禁用中'
          break
        case '03':
          return '删除中'
          break
        case '11':
          return '已启用'
          break
        case '12':
          return '已禁用'
          break
        case '13':
          return '已删除'
          break
        case '21':
          return '启用失败'
          break
        case '22':
          return '禁用失败'
          break
        case '23':
          return '删除失败'
          break
        default:
          return '未知状态'
      }
    },
    pwdType(type) {
      /* eslint-disable no-unreachable */
      switch(type) {
        case 'offlinePwd':
          return '离线密码'
          break
        case 'timesPwd':
          return '一次性密码'
          break
        case 'managerPwd':
          return '管理密码'
          break
        case 'tenantPwd':
          return '房客密码'
          break
        case 'cleanPwd':
          return '保洁密码'
          break
        case 'maintainPwd':
          return '维修密码'
          break
        case 'checkPwd':
          return '看房密码'
          break
        case 'otherPwd':
          return '其他密码'
          break
        default:
          return '未知状态'
      }

    }
  }
}
</script>
<style lang="less" scoped>
.info{
  button{
    outline: none;
    border:1px solid rgba(255,255,255,0.4);
    background: transparent;
    width:109px;
    height:32px;
    border-radius:2px;

    font-size:14px;
    color:rgba(255,255,255,0.8);
  }
}
.btns{
  position: relative;
  .confirmDialog{
    position: absolute;
    right: 20px;
    bottom: 35px;
    background: #3b4a55;
    z-index: 9999;

    width: 344px;
    height:135px;

    padding: 12px 24px;
    font-size:14px;
    .title{
      line-height: 24px;
      color:rgba(255,255,255,1);
      margin-bottom: 32px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .icon{
        background: #fff;
        color: #000;
        width: 18px;
        height: 18px;
        line-height: 18px;
        border-radius: 50%;
        margin-right: 6px;
        font-size: 16px;
        text-align: center;
      }
    }
    .panel-arrow{
      width: 0;
      height: 0;
      border-width: 8px;
      border-style: solid;
      border-color: #3b4a55 transparent transparent transparent;
      position: absolute;
      bottom: -15px;
      right: 6%;
      transform: translate(-50%, 0);
      z-index: 1;
    }
    .cancel, .confirm{
      width: 56px;
      height: 28px;
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
        width: 94px;
        height: 32px;
        border-radius:2px;
        border:1px solid rgba(255,255,255,0.4);
        color:rgba(255,255,255,0.8);
        background: transparent;
        margin-right: 16px;
        &.footer{
          width: 64px;
        }
      }
      .confirm{
        outline:none;
        border: none;
        width: 64px;
        height: 32px;
        color:rgba(255,255,255,1);
        background:rgba(255,70,70,1);
        border-radius:2px;
      }
    }
  }
}
.dialog-main .dialog-content {
  overflow-y: visible !important;
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
