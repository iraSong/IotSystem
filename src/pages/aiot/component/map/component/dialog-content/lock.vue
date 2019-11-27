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
    <!--  门锁设备 -->
    <div class="dialog-content">
      <div class="right">
        <div class="info">
          <div class="sn"><i class="icon" />设备编号：{{deviceInfo.deviceSn}}</div>
          <div class="status"><i class="icon" /> 设备状态：{{deviceInfo.deviceStatus | deviceStatus}}</div>
        </div>
        <div class="info">
          <div class="sn"><i class="icon" />设备标记：
            <template v-if="Array.isArray(deviceInfo.deviceProperties.location)">
              {{deviceInfo.deviceProperties.location[0].roomName}}
            </template>
            <template v-else>
              {{deviceInfo.deviceProperties.location.roomName}}
            </template>
          </div>
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
            信号强度：{{deviceInfo.deviceProperties.other.rssi | rssi}}（{{deviceInfo.deviceProperties.other.rssiUpdateTime | formatTime}}}）
          </div>
        </div>
        <div class="info">
          <div class="sn">
            <button @click="showLockPassWord">下发新密码</button>
          </div>
        </div>
      </div>

      <div class="left">
        <div class="title-table">
          <div class="wrap-tab">
            <div :class="[{'active' : tableTab == 'event' }, 'item-tab']" @click="changeTab('event')">事件记录</div>
            <div :class="[{'active' : tableTab == 'open' }, 'item-tab']" @click="changeTab('open')">开门记录</div>
            <div :class="[{'active' : tableTab == 'pwd' }, 'item-tab']" @click="changeTab('pwd')">密码详情</div>
          </div>
        </div>
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
              <td >{{it.status}}</td>
              <td >{{it.alarmLvl}}</td>
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
            <tr v-for="(it, idx) in openList" :key="idx">
              <td >{{it.userId}}</td>
              <td >{{it.openType}}</td>
              <td >{{it.time}}</td>
      
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
              <td >{{it.pwdType}}</td>
              <td >{{it.validStartTime}}-{{it.validStartTime}}</td>
              <td >{{it.remark}}</td>
              <td >{{it.pwdStatus}}</td>
              <td >{{it.createrName}}</td>
              <td class="btns" >
                <el-button type="text" @click="showLockPassWord({pwdDetail: it, dialogType: 'modify'})">修改</el-button>
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
                <el-button type="text" @click="showConfirm = true">删除</el-button>
                <div  class="confirmDialog" v-if="showConfirm">
                  <div class="panel-arrow"></div>
                  <div class="title"><div class="icon">!</div><div class="txt">要删除该密码？</div></div>
                  <div class="footer">
                    <button class="cancel footer" @click="showConfirm = false">取消</button>
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

export default {
  props: ['deviceInfo', 'type','refesh'],
  data() {
    return {
      showPanel: false,
      hasMoniter: false,
      tableTab: 'event', // access 通行记录 event 事件记录

      recordList: [],
      openList: [],
      pwdList:[],
      showConfirm:false,
    }
  },
  computed: {
    ...mapState(['rank', 'rankName']),
    ...mapGetters(['projectId']),
  },
  components: {
  },
  mounted() {
    this.getEventLogList()
  },
  methods: {
    ...mapMutations(['toggleLockPasword']),
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
          sn: this.deviceInfo.deviceSn,
          mac: this.deviceInfo.deviceMac,
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
        .then(() => {
          this.getPwdLogList()
          this.showConfirm = false
          this.$Message.success('操作成功！')
        })
    },

    close() {
      this.$emit('close', false)
    },
    back() {
      this.$emit('doShowList')
    },
    changeTab(tab) {
      this.tableTab = tab
      if(tab == 'event' || tab == 'open') {
        this.getEventLogList()
      } else if(tab == 'pwd') {
        this.getPwdLogList()
      }
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

</style>
