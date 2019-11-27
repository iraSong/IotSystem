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
    <!--  水电表表 -->
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
          <div class="sn"><i class="icon" />
            表盘读数：
            <div>
              <div class="read">
                <span v-for="(i, idx) in deviceInfo.record" :key="idx" class="yantramanav">{{i}}</span>
                m³
              </div>
              <div class="time">更新时间：{{deviceInfo.recordTime | formatTime}}</div>
            </div>
          </div>
        </div>
        <div class="info">
          <div class="sn"><i class="icon" />本月累计：{{totalUse}}m³</div>
        </div>

        <div class="wrap-lineChart">
          <div class="linechart-title">
            <div>用水量统计：</div>
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
            <div :class="[{'active' : tableTab == 'event' }, 'item-tab']" @click="getEventLogList('event')">事件记录</div>
            <div :class="[{'active' : tableTab == 'read' }, 'item-tab']" @click="getEventLogList('read')">读表数据</div>
            <div :class="[{'active' : tableTab == 'use' }, 'item-tab']" @click="getUse">用{{name}}数据</div>
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
              <th>时间</th>
              <th>用量</th>
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

import { mapState, mapGetters } from 'vuex'
import echarts from 'echarts'

export default {
  props: ['deviceInfo','refesh'],
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
    ...mapGetters(['projectId']),
    name() {
      return this.deviceInfo.deviceProperties.type == 'elec' ? '电': '水'
    },
  },
  components: {
  },
  mounted() {
  },
  methods: {
    getLogType() {
      let type = ''
      let deviceType = this.deviceInfo.deviceProperties.type
      if(this.tableTab == 'event') { 
        // 事件记录
        if(deviceType == 'elec') { 
          type = 'gy_sys_elec_status'
        } else if (deviceType == 'water' || deviceType == 'hotwate') {
          type = 'gy_sys_water_status'
        }
      } else if( this.tableTab == 'read') {
        // 事件记录
        if(deviceType == 'elec') { 
          type = 'gy_sys_elec_data'
        } else if (deviceType == 'water' || deviceType == 'hotwate') {
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
          beginDate: '-1',
          endDate: '-1',
          pageNo: '1',
          pageSize: '1000',
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

      list.forEach(el => {
        dataList.push(el.value)
        labelList.push(el.key)
      })
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
    height:36px;
    line-height: 30px;
    background:rgba(255,255,255,0.8);
    border-radius:2px;

    font-size:28px;
    color:rgba(31,46,59,1);
  }
}
.time{
  font-size: 12px;
  color:rgba(255,255,255,0.4);
}
</style>
