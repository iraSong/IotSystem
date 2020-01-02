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
    <!--  水电表表 -->
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
          <div class="sn lable-read"><i class="icon" />
            <div class="label" style="padding-top: 10px;">表盘读数：</div>
            <div>
              <div class="read">
                <span v-for="(i, idx) in deviceInfo.record" :key="idx">{{i}}</span>
                {{unit}}
              </div>
              <div class="time">更新时间：{{deviceInfo.recordTime | formatTime}}</div>
            </div>
          </div>
        </div>
        <div class="info">
          <div class="sn"><i class="icon" />本月累计：{{totalUse}}{{unit}}</div>
        </div>

        <div class="wrap-lineChart">
          <div class="linechart-title">
            <div>用{{name}}量统计：</div>
            <div class="menu-tab">
              <div 
                :class="[{'active': lineType == 0}, 'menu-item']" 
                @click="changeLineChart(0)">
                  <span></span>&nbsp;天
              </div>
              <div
                :class="[{'active': lineType == 1}, 'menu-item']" 
                @click="changeLineChart(1)">
                  <span></span>&nbsp;月
              </div>
            </div>
          </div>
          <div class="lineChart" ref="lineChart" />
        </div>
      </div>

      <div class="left">
        <div class="title-table">
          <div class="wrap-tab">
            <div :class="[{'active' : tableTab == 'event' }, 'item-tab border-left']" @click="getEventLogList('event')">事件记录</div>
            <div :class="[{'active' : tableTab == 'read' }, 'item-tab']" @click="getEventLogList('read')">读表数据</div>
            <div :class="[{'active' : tableTab == 'use' }, 'item-tab border-right']" @click="getUse">用{{name}}数据</div>
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
        <table class="table" v-show="tableTab == 'read'">
          <thead>
            <tr>
              <th>时间</th>
              <th>读数</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(it, idx) in recordList" :key="idx">
              <td >{{it.recordTime | formatTime}}</td>
              <td >{{it.readRecord}}</td>
            </tr>
          </tbody>
        </table>
        <table class="table" v-show="tableTab == 'use'">
          <thead>
            <tr>
              <th>用{{name}}时间</th>
              <th>用{{name}}量</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(it, idx) in list" :key="idx + '3'">
              <td >{{it.readDate}}</td>
              <td >{{it.useRecord}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>

import { mapState, mapGetters, mapMutations } from 'vuex'
import echarts from 'echarts'
import moment from 'moment'

import { mixAttention } from '../../../../mixins/attention.js'
export default {
  mixins: [mixAttention],
  props: ['deviceInfo','refesh', 'hideBack'],
  data() {
    return {
      showPanel: false,
      hasMoniter: false,
      tableTab: 'event', // event read use

      recordList: [],
      labelList: [],
      dataList:[],
      lineType: 0,
      list: [],
      lineChartData: {},

      totalUse: '--'
    }
  },
  computed: {
    ...mapState(['rank', 'rankName']),
    ...mapGetters(['projectId', 'focusList']),
    name() {
      return this.deviceInfo.deviceProperties.type == 'elec' ? '电': '水'
    },
    unit() {
      return this.deviceInfo.deviceProperties.type == 'elec' ? 'kW‧h': 'm³'
    },
    focus() {
      // if(this.deviceInfo.deviceProperties.other) {
      //   return this.deviceInfo.deviceProperties.other.focus 
      // } else {
      //   return '0'
      // }
      return this.deviceInfo.deviceProperties.other.focus 
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
      if(this.tableTab == 'event') { 
        // 事件记录
        if(deviceType == 'elec') { 
          type = 'gy_sys_elec_status'
        } else if (deviceType == 'water' || deviceType == 'hotwater') {
          type = 'gy_sys_water_status'
        }
      } else if( this.tableTab == 'read') {
        // 读表数据
        if(deviceType == 'elec') { 
          type = 'gy_sys_elec_data'
        } else if (deviceType == 'water' || deviceType == 'hotwater') {
          type = 'gy_sys_water_data'
        }
      }
      return type
    },
    getEventLogList(tab) {
      this.tableTab = tab
      let logType = this.getLogType()
      this.$http({
        method:'post',
        url:'/api/json/deviceLogApi/getDeviceLog',
        data:{
          projectId: this.projectId,
          sn: this.deviceInfo.deviceSn,
          mac: this.deviceInfo.deviceMac,
          beginDate: moment().subtract(2,'years').format('YYYY-MM-DD'),
          endDate: moment().format('YYYY-MM-DD'),
          index: logType,
          pageNo: '1',
          pageSize: '10',
        }
      })
        .then((res) => {
          this.recordList = res.data.recordList
        })
    },
    getRead() {
      this.tableTab = 'read'
    },
    getUse() {
      this.tableTab = 'use'
      this.$http({
        method:'post',
        url:'/api/json/gyLogApi/getWaterElecRecord',
        data:{
          sn: this.deviceInfo.deviceSn,
          mac: this.deviceInfo.deviceMac,
          beginDate: moment().subtract(2,'years').format('YYYY-MM-DD'),
          endDate: moment().format('YYYY-MM-DD'),
          pageNo: '1',
          pageSize: '10',
        }
      })
        .then((res) => {
          this.list = res.data.list
        })
    },
    getTotalUse() {
      this.$http({
        method:'post',
        url:'/api/json/gyLogApi/getWaterElecCumulativeRecordCurrentMonth',
        data:{
          sn: this.deviceInfo.deviceSn,
          mac: this.deviceInfo.deviceMac,
        }
      })
        .then((res) => {
          this.totalUse = res.data.cumulativeRecord
        })
    },
    getLineChart() {
      this.$http({
        method:'post',
        url:'/api/json/ufoIndicesApi/waterElecRecordIndicesData',
        data:{
          sn: this.deviceInfo.deviceSn,
          mac: this.deviceInfo.deviceMac,
          indicesNameEn: 'smartElectricMeterKWH',
        }
      })
        .then((res) => {
          this.lineChartData = res
          this.dealData(res, 0)
          this.initChart()
        })
    },
    changeLineChart(idx) {
      this.lineType = idx
      this.dealData(this.lineChartData, idx)
      this.initChart()
    },
    dealData(res, idx) {
      let list = res.data.list[idx].groupData[0].indicesData
      let dataList = []
      let labelList = []

      if(list && list.length > 0) {
        list.forEach(el => {
          dataList.push(el.value)
          labelList.push(el.key)
        })
      }
      this.dataList = dataList
      this.labelList  = labelList
    },
    close() {
      this.$emit('close', false)
    },
    back() {
      this.$emit('doShowList')
    },
    initChart() {
      var myChart = echarts.init(this.$refs.lineChart)
      var option = {
        color: ['#00B7FF', '#F37D2C'],
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: '26%',
          left: '0',
          right: '0',
          bottom: '0',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.labelList,
          // splitNumber: 24,
          axisTick: {
            show: true,
            inside: true,
            interval: 0,
          },
          axisLabel: {
            showMinLabel: false,
            showMaxLabel: false,
            // interval:5,
            color: 'rgba(255,255,255,0.3)',
          },
          axisLine:{
            show: true,
            lineStyle:{
              color: 'rgba(255,255,255,0.1)',  //坐标轴的颜色
            },
          },
          splitLine: {
            show: true,
            lineStyle:{
              color: 'rgba(255,255,255,0.1)',
            }
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            show: false,
          },
          axisTick: {
            show: true,
            inside: true,
            interval: 0,
          },
          splitLine: {
            show: false
          },
          axisLine:{
            show: true,
            lineStyle:{
              color: 'rgba(255,255,255,0.1)',  //坐标轴的颜色
            },
          },
        },
        series: [
          {
            name: '用量',
            type: 'line',
            symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
            symbolSize: 1,
            lineStyle: {
              width: 1,
              type: 'solid',
              shadowBlur: 10,
              shadowColor: '#00B7FF',
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              opacity: 1,
            },
            data: this.dataList,
            areaStyle: {
              normal: {
              //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ 
                    offset: 0,
                    color: 'rgba(0, 183, 255, 0)'
                },{
                    offset: 1,
                    color: 'rgba(0, 183, 255, 0.12)'
                }]),
                origin: 'end'
              }
            },
          },
        ]
      }
      myChart.clear()
      myChart.setOption(option)
    },
    setAttention(focusDevice) {
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
    }
  },
  watch: {
    refesh() {
      this.getTotalUse()
      this.getEventLogList('event')
      this.getLineChart()
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
.wrap-lineChart{
  margin-bottom:32px;
  .linechart-title{
    display: flex;
    justify-content: space-between;
    .menu-tab{
      display: flex;
      justify-content: flex-end;

      font-size: 12px;
      margin-right:24px;
      span{
        display: inline-block;
        width:14px;
        height:14px;
        border:1px solid rgba(255,255,255,0.2);
        border-radius: 50%;
      }
      .menu-item {
        cursor: pointer;
        display: flex;
        align-items: center;
        margin-left:20px;
        &.active{
          span{
            position: relative;
            border:1px solid rgba(0,183,255,1);
            &::after{
              content: '';
                border-radius: 50%;
              display: inline-block;
              width:8px;
              height: 8px;
              background: #00B7FF;
              margin: auto;

              position: absolute;
              top:50%;
              left:50%;
              transform: translate(-50%, -50%);
            }
          }
        }
      }

    }
  }

  .lineChart {
    width: 416px;
    height: 150px;
  }
}

.read{
  span{
    text-align: center;
    margin: 2px;
    display: inline-block;
    width:30px;
    // height:36px;
    // line-height: 1;
    line-height: 36px;
    background:rgba(255,255,255,0.8);
    border-radius:2px;

    font-size:25px;
    color:rgba(31,46,59,1);
  }
}
.time{
  font-size: 12px;
  color:rgba(255,255,255,0.4);
}

.sn{
  &.lable-read{
    align-items: flex-start !important;
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
