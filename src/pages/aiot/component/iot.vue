<template>
  <div class="right">
    <!-- 设备总数统计 -->
    <div class="iot">
      <div class="title-overview">
        <div class="left"><i />物联设备总数：<span class="yantramanav">{{currentData.total}}</span></div>
        <div class="v-hide">今日新增：<span class="yantramanav">{{currentData.new}}</span></div>
      </div>
      <div class="body">
        <div class="pieFault">
          <div class="rate flex-center">
            <div>在线</div>
            <div class="num yantramanav">{{currentData.onLine}}%</div>
          </div>
          <div ref="pieFault"
            class="chart"></div>
        </div>
        <div class="offLine">
          <div class="rate flex-center">
            <div>离线</div>
            <div class="num yantramanav">{{currentData.offLine}}%</div>
          </div>
          <div ref="offLine"
            class="chart"></div>
        </div>
        <div class="over">
          <div class="rate flex-center">
            <div>故障</div>
            <div class="num yantramanav">{{currentData.fault}}%</div>
          </div>
          <div ref="over"
            class="chart"></div>
        </div>
      </div>
    </div>
    <!-- 设备列表 -->
    <div class="device-list">
      <div class="title-overview">
        <div class="left"><i />设备统计</div>
      </div>
      <div class="body">
        <div class="head">
          <div class="row">
              <div class="flex-1 device-type">设备类型</div>
              <div class="flex-1">总数</div>
              <div class="flex-1">在线</div>
              <div class="flex-1">离线</div>
              <div class="flex-1">故障</div>
              <div style="width: 6px" />
          </div>
        </div>
        <div class="list" v-if="list && list.length > 0">
          <div
            class="item"
            v-for="(it, idx) in list"
            :key="idx"
            :class="{'active': it.isActive}"
          >
            <div
              class="row"
              @click="toggleItem(idx)"
            >
              <div class="flex-1 device-type" :title="it.device">{{it.device}}</div>
              <div class="flex-1">{{it.total}}</div>
              <div class="col-offline flex-1">{{it.onLine}}</div>
              <div class="col-offline flex-1">{{it.offLine}}</div>
              <div class="col-fault flex-1">{{it.fault}}</div>
              <div class="arrow" />
            </div>
            <div class="open" v-if="currentIndex == idx">
              <div class="pie">
                <div class="wrap-chart pieFault">

                  <div class="rate flex-center">
                    <div>在线</div>
                    <div class="num yantramanav">{{ perOnLine }}%</div>
                  </div>

                  <div :id="'pieFault'+ idx" class="chart"></div>
                </div>
                <div class="wrap-chart offLine">
                  <div class="rate flex-center">离线<div class="num">{{ perOffLine }}%</div></div>
                  <div :id="'offLine' + idx" class="chart"></div>
                </div>
                <div class="wrap-chart over">
                  <div class="rate flex-center">故障<div class="num">{{ perFault }}%</div></div>
                  <div :id="'over' + idx" class="chart"></div>
                </div>
              </div>

              <div class="line">
                <div class="menu-tab" v-show="isSmallscreen || list.length >=5 ">
                  <div :class="[{'active': lineType == 'day'}, 'menu-item']" @click="handelMenu(idx,'day')"><span></span>&nbsp;天</div>
                  <div :class="[{'active': lineType == 'month'}, 'menu-item']" @click="handelMenu(idx,'month')"><span></span>&nbsp;月</div>
                </div>
                <div class="lineChart" :id="'lineChart' + idx" />
              </div>

              <div class="line v-hide" v-show="list.length < 5">
                <div class="lineChart" :id="'lineChart' + idx + '-2'" />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import { mapState, mapGetters } from 'vuex'

export default {
  data() {
    return {
      currentData: {}, // iot 设备总数统计
      list: [], // 设备列表
      lineType: 'day',

      currentItem: {
        total: 100,
        fault: 1,
        onLine: 90,
        offLine: 9,
      },
      currentIndex: 0, // 当前打开的设备详情
      isSmallscreen: window.screen.availHeight < 800
    }
  },
  computed: {
    ...mapState(['rank', 'refresh']),
    ...mapGetters(['cityCode', 'projectId']),
    perFault() {
      if(!this.currentItem || this.currentItem.total <= 0) return '--' 
      let num = (this.currentItem.fault / this.currentItem.total) * 100
      return num.toFixed(0)
    },
    perOffLine() {
      if(!this.currentItem || this.currentItem.total <= 0) return '--' 
      let num = (this.currentItem.offLine / this.currentItem.total) * 100
      return num.toFixed(0)
    },
    perOnLine() {
      if(!this.currentItem || this.currentItem.total <= 0) return '--' 
      let num = (this.currentItem.onLine / this.currentItem.total) * 100
      return num.toFixed(0)
    },
  },
  mounted() {
    this.getData()

    // 浏览器窗口改变，charts图 需要重绘
    let tid
    window.addEventListener('resize', () => {
      clearTimeout(tid)
      tid = setTimeout(() => {
        this.toggleItem(0)
      }, 300)
    }, false)
  },

  methods: {
    initAll() {
      let cData = this.currentData
      this.initChart({
        per: cData.fault,
        ref: 'pieFault',
        color: '#00B7FF'
      })
      this.initChart({
        per: cData.offLine,
        ref: 'offLine',
        color: '#F37D2C'
      })
      this.initChart({
        per: cData.over,
        ref: 'over',
        color: '#FF4646'
      })
    },
    initChart(params) {
      let chart = echarts.init(this.$refs[params.ref])
      let others = 100 - params.per
      let option = {
        color: [params.color, 'transparent'], //transparent
        grid: {
          left: '0',
          right: '0',
          top: '0',
          bottom: '0',
          containLabel: true
        },
        // calculable: true,
        series: [{
          name: '车位',
          type: 'pie',
          radius: [35, 40],
          center: ['50%', '50%'],
          hoverAnimation: false,

          label: {
            normal: {
              show: false,
            },
          },
          lableLine: {
            normal: {
              show: false,
            },
          },
          data: [
            {
              value: params.per,
              name: '故障',
              itemStyle: {
                shadowBlur: 10,
                shadowColor: params.color,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                opacity: 1,
              },
            },
            { value: others, name: '非故障' }
          ]
        }
        ]
      }
      chart.clear()
      chart.setOption(option)
    },

    initDeviceChart(params) {
      let chart = echarts.init(document.getElementById(params.ref))
      let others = 100 - params.per
      let option = {
        color: [params.color, 'transparent'], //transparent
        grid: {
          left: '0',
          right: '0',
          top: '0',
          bottom: '0',
          containLabel: true
        },
        // calculable: true,
        series: [{
            name: '车位',
            type: 'pie',
            radius: [35, 40],
            center: ['50%', '50%'],
            hoverAnimation: false, 
            label: {
              normal: {
                show: false,
              },
            },
            lableLine: {
              normal: {
                show: false,
              },
            },
            data: [
              { value: params.per, name: '故障' },
              { value: others, name: '非故障' }
            ]
          }
        ]
      }
      chart.clear()
      chart.setOption(option)
    },
    initLineChart(idx, data) {
      var myChart = echarts.init(document.getElementById(`lineChart${idx}`))
      let { offLineList, faultList, labelList } = data
      var option = {
        color: ['#F37D2C','#FF4646'],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          align: 'left',
          left: 0,
          padding: [10, 0],
          textStyle: {
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 12,
          },
          itemWidth: 8,
          data: [{
            name: '离线率',
            icon: 'circle',
          },{
            name: '故障率',
            icon: 'circle',
          }],
        },
        grid: {
          top: '26%',
          left: '2.5%',
          right: '2.5%',
          bottom: '5',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: labelList,
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
            color: 'rgba(255,255,255,0.4)',
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
          axisLine:{
            show: true,
            lineStyle:{
              color: 'rgba(255,255,255,0.1)',  //坐标轴的颜色
            },
          },
          splitLine: {
            show: false
          },
        },
        // backgroundColor: 'rgba(255, 255, 255, 0.7);',
        series: [
          {
            name: '离线率',
            type: 'line',
            symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
            symbolSize: 1,
            data: offLineList,
            lineStyle: {
              width: 1,
              type: 'solid',
              shadowBlur: 10,
              shadowColor: '#F37D2C',
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              opacity: 1,
            },
            areaStyle: {
              normal: {
              //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ 
                    offset: 0,
                    color: 'rgba(243, 125, 44, 0)'
                },{
                    offset: 1,
                    color: 'rgba(243, 125, 44, 0.12)'
                }]),
                origin: 'end'
              }
            },
          },
          {
            name: '故障率',
            type: 'line',
            symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
            symbolSize: 1,
            data: faultList,
            lineStyle: {
              width: 1,
              type: 'solid',
              shadowBlur: 10,
              shadowColor: '#00B7FF',
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              opacity: 1,
            },
            areaStyle: {
              normal: {
              //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ 
                    offset: 0,
                    color: 'rgba(255, 73, 73, 0)'
                },{
                    offset: 1,
                    color: 'rgba(255, 73, 73, 0.12)'
                }]),
                origin: 'end'
              }
            },
          }
        ]
      }
      myChart.clear()
      myChart.setOption(option)
    },

    toggleItem(idx){
      if(this.list[idx].isActive) return

      this.currentIndex = idx
      this.list.forEach((val, index) => {
        if (idx !== index ) {
          val.isActive = false
        }
      })

      this.list[idx].isActive = !this.list[idx].isActive
      this.$nextTick(() => {
        this.initPieDevices(idx) //  单类设备饼图
        this.initLines(idx) // 线图
      })
    },
    getData() {
      this.$http({
        method:'post',
        url:'/api/json/ufoXcApi/getDeviceStatusStatistic',
        data:{
          cityCode: this.cityCode,
          projectId: this.projectId,
        }
      })
        .then((res) => {
          this.dealIotData(res) // 处理数据
          this.initAll() // 全部设备 饼图
          if(this.list.length == 0 ) return
          this.$nextTick(() => {
            this.initPieDevices(0) //  单类设备饼图
            this.initLines(0) // 线图
          })
        })
    },
    dealIotData(res) {
      this.currentData.total = res.data.totalDevice
      this.currentData.new = res.data.newDevice
      this.list = res.data.deviceStatusInfo || []
      let totalDevice = 10
      let totalFault = 0
      let totalOffLine = 0
      let totalOnLine = 0
      this.list.forEach((el) => {
        totalDevice += +el.total
        totalFault += +el.fault
        totalOffLine += +el.offLine
        totalOnLine += +el.onLine
      })
      this.currentData.fault = (totalFault / totalDevice * 100).toFixed(1)
      this.currentData.offLine = (totalOffLine / totalDevice * 100).toFixed(1)
      this.currentData.onLine = (totalOnLine / totalDevice * 100).toFixed(1)

      console.log(this.currentData)
      if(this.list && this.list.length > 0) {
        this.list[0].isActive = true
      }
    },
    getLineChartData(statisticType, deviceType) {
     return this.$http({
        method:'post',
        url:'/api/json/ufoXcApi/getDeviceStatusLineChart',
        data:{
          cityCode: this.cityCode,
          projectId: this.projectId,
          statisticType: statisticType,
          deviceType: deviceType,
        }
      })
    },
    dealLineChartData(res) {
      let arrFault = res.data.faultDto
      let arrOffLine = res.data.offlineDto

      let faultList = []
      let offLineList = []
      let labelList = []

      arrFault.forEach(el => {
        faultList.push(el.count)
        labelList.push(el.statisticDate)
      })
 
      arrOffLine.forEach(el => {
        offLineList.push(el.count)
      }) 

      return {
        faultList,
        offLineList,
        labelList
      }
    },
    initPieDevices(idx) {
      this.currentItem = this.list[idx]
      this.initDeviceChart({
        per: this.perOnLine,
        ref: 'pieFault' + idx,
        color: '#00B7FF'
      })
      this.initDeviceChart({
        per: this.perOffLine,
        ref: 'offLine' + idx,
        color: '#F37D2C'
      })
      this.initDeviceChart({
        per: this.perFault,
        ref: 'over' + idx,
        color: '#FF4646'
      })
    },
    initLines(idx) {
      this.getLineChartData('day',this.list[idx].deviceType)
        .then((res) => {
          let lineDate = this.dealLineChartData(res)
          this.initLineChart(idx, lineDate)
        })

      // 不是小屏幕， 并且 list 少于 5个
      if(!this.isSmallscreen && this.list.length < 5) {
        this.getLineChartData('month', this.list[idx].deviceType)
          .then((res) => {
            let lineDate = this.dealLineChartData(res)
            this.initLineChart(idx + '-2', lineDate)
          })
      }
    },
    handelMenu(idx, statisticType) {
      this.lineType = statisticType
      this.getLineChartData(statisticType, this.list[idx].deviceType)
        .then((res) => {
          let lineDate = this.dealLineChartData(res)
          this.initLineChart(idx, lineDate)
        })
    },
  },
  watch: {
    refresh() {
      this.getData()
    }
  }
}
</script>

<style lang="less" scoped>
.right {
  position: relative;
  z-index: 9;
  width: 360px;
}

.iot {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  .title-overview {
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.16);
    margin-bottom: 4px;
    i {
      vertical-align: sub;
      display: inline-block;
      width: 18px;
      height: 18px;
      margin-right: 3px;
      background: url("~@assets/img/demo/icon-iot.png");
      background-size: 100% 100%;
    }
    .left {
      margin-right: 40px;
    }
    span {
      color: #fff;
      font-size: 20px;
    }
  }
  .body {
    display: flex;
    padding: 8px 10px 28px;
    div {
      position: relative;
      box-sizing: border-box;
      &.pieFault {
        border-radius: 50%;
        border: 1px solid rgba(0, 183, 255, 0.4);
        .rate {
          background: rgba(0, 183, 255, 0.2);
        }
      }
      &.offLine {
        margin: 0 45px;
        border-radius: 50%;
        border: 1px solid rgba(243, 125, 44, 0.4);
        .rate {
          background: rgba(243, 125, 44, 0.2);
        }
      }
      &.over {
        border-radius: 50%;
        border: 1px solid rgba(255, 70, 70, 0.4);
        .rate {
          background: rgba(255, 70, 70, 0.2);
        }
      }
    }
    .rate {
      width: 82px;
      height: 82px;

      text-align: center;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, 0);
      font-size: 12px;
      color: rgba(255, 255, 255, 0.4);

      border-radius: 50%;
      flex-direction: column;
      .num {
        font-size: 18px;
        color: #fff;
      }
    }
    .chart {
      width: 80px;
      height: 80px;
    }
  }
}

.device-list{
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  .title-overview{
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(255,255,255,0.16);
    margin-bottom:4px;
    i{
      vertical-align: sub;
      display: inline-block;
      width: 18px;
      height: 18px;
      margin-right: 3px;
      background: url('~@assets/img/demo/icon-dev.png');
      background-size: 100% 100%;
    }
    .left{
      margin-right: 40px;
    }
    span{
      color:#fff;
      font-size: 20px;
    }
  }
  .body{
    .row {
      position: relative;
      height: 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      font-size: 12px;
      color:rgba(255,255,255,0.8);
      padding: 0 10px;
      div{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .flex-1{
        flex:1;
        &.device-type {
          flex: none;
          width: 88px;
        } 
      }
      .arrow{
        flex: none;
        width:6px;
        height: 4px;
        background: url('~@assets/img/demo/arrow.png');
        background-size: cover;
      }
      .col-fault{
        color: #FF4646;
      }
      .col-offline{
        color: #F37D2C;
      }
    }
    .head .row{
      color:rgba(255,255,255,0.4);
    }
    .list {
      height: 538px;
      overflow: auto;

      margin: 8px 0;
      .item {
        // * {
        //   transition: all .3s ease-in-out;
        // }
        .open {
          display: none;
          // height: 421px;
          background:rgba(255,255,255,0.06);

          .pie{
            display: flex;
            padding: 8px 10px;
            .wrap-chart{
              position: relative;
              box-sizing: border-box;
              width: 82px;
              height: 82px;
            }
            .pieFault{
              border-radius: 50%;
              border:1px solid rgba(0,183,255,0.4);
              .rate{
                background: rgba(0,183,255,0.2);
              }
            }
            .offLine{
              margin: 0 45px;
              border-radius: 50%;
              border:1px solid rgba(243,125,44,0.4);
              .rate{
                background: rgba(243,125,44,0.2);
              }
            }
            .over{
              border-radius: 50%;
              border:1px solid rgba(255,70,70,0.4);
              .rate{
                background: rgba(255,70,70,0.2);
              }
            }
          }
          .rate{
            width: 82px;
            height: 82px;
            text-align: center;
            position: absolute;
            top: 0;
            left: 50%;
            transform: translate(-50%, 0);
            font-size:12px;
            color:rgba(255,255,255,0.4);

            border-radius:50%;
            flex-direction: column;
            .num{
              font-size: 18px;
              color: #fff;
            }
          }
          .chart{
            width: 80px;
            height: 80px;
          }

          .line{
            position: relative;
            .menu-tab{
              position: absolute;
              right: 15px;
              top: 4px;
              display: flex;
              justify-content: flex-end;

              font-size: 12px;
              z-index: 9;
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
            margin: 0 auto;
            width: 340px;
            height: 160px;
          }
        }
        &.active .open {
          display: block;
        }
        &.active .row {
          background:rgba(255,255,255,0.04);
        }
      }
    }
  }
}

// 小屏幕适配
@media screen and (max-height: 800px) {
  .right {
    width: 316px;
    max-height: 540px;
  }
  .iot {
    .body {
      padding: 8px 10px;
    }
  }

  .lineChart {
    width: 300px !important;
    height: 120px !important;
  }
  .offLine {
    margin: 0 25px !important;
  }
  .device-list{
    .list {
      height: 310px !important;
      overflow: auto !important;
    }
  }
}
</style>