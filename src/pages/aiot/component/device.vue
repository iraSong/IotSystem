<!-- 和iot 组件一个接口 暂时合并了 -->
<template>
  <div class="overview">
    <div class="title-overview">
      <div class="left"><i />设备统计</div>
    </div>
    <div class="body">
      <div class="head">
        <div class="row">
            <div class="flex-1">设备类型</div>
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
            <div class="flex-1">{{it.device}}</div>
            <div class="flex-1">{{it.total}}</div>
            <div class="col-offline flex-1">{{it.offLine}}</div>
            <div class="col-offline flex-1">{{it.offLine}}</div>
            <div class="col-fault flex-1">{{it.fault}}</div>
            <div class="arrow" />
          </div>
          <div class="open">
            <div class="pie">
              <div class="wrap-chart pieFault">

                <div class="rate flex-center">
                  <div>在线</div>
                  <div class="num yantramanav">{{perfault}}%</div>
                </div>

                <div :id="'pieFault'+ idx" class="chart"></div>
              </div>
              <div class="wrap-chart offLine">
                <div class="rate flex-center">离线<div class="num">{{ peroffLine }}%</div></div>
                <div :id="'offLine' + idx" class="chart"></div>
              </div>
              <div class="wrap-chart over">
                <div class="rate flex-center">故障<div class="num">{{ peroverdue }}%</div></div>
                <div :id="'over' + idx" class="chart"></div>
              </div>
            </div>
            <div class="line">
              <div class="lineChart" :id="'lineChart' + idx" />
            </div>
            <div class="line">
              <div class="lineChart" :id="'lineChart' + idx + '-2'" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import { mapState } from 'vuex'

let timeObj = JSON.parse(window.localStorage.getItem('aiot-time'))
export default {
  data() {
    return {
      dataObj: {
        country: [
          {
            device: '智能门禁',
            total: '58679',
            fault: '879',
            offLine: '5868',
            overdue: '15250',
          },{
            device: '人脸门禁',
            total: '2678',
            fault: '133',
            offLine: '242',
            overdue: '464',
          },{
            device: '可视对讲',
            total: '12864',
            fault: '740',
            offLine: '1409',
            overdue: '3472',
          },{
            device: '智享家',
            total: '23021',
            fault: '649',
            offLine: '2509',
            overdue: '6089',
          }
        ],
        city: [
          {
            device: '智能门禁',
            total: '2250',
            fault: '90',
            offLine: '202.5',
            overdue: '518',
          },{
            device: '人脸门禁',
            total: '134',
            fault: '5',
            offLine: '12.1',
            overdue: '31',
          },{
            device: '可视对讲',
            total: '643',
            fault: '26',
            offLine: '57.9',
            overdue: '148',
          },{
            device: '智享家',
            total: '1151',
            fault: '46',
            offLine: '103.6',
            overdue: '265',
          }
        ],
        community: [
          {
            device: '智能门禁',
            total: '92',
            fault: '4',
            offLine: '8',
            overdue: '21',
          },{
            device: '人脸门禁',
            total: '37',
            fault: '1',
            offLine: '3',
            overdue: '9',
          },{
            device: '可视对讲',
            total: '87',
            fault: '3',
            offLine: '8',
            overdue: '20',
          },{
            device: '智享家',
            total: '180',
            fault: '7',
            offLine: '16',
            overdue: '41',
          }
        ]
      },

      list: [],
      currentItem: {},
    }
  },
  computed: {
    ...mapState(['rank']),
    perfault() {
      let num = (this.currentItem.fault / this.currentItem.total) * 100
      return num.toFixed(1)
    },
    peroffLine() {
      let num = (this.currentItem.offLine / this.currentItem.total) * 100
      return num.toFixed(1)
    },
    peroverdue() {
      let num = (this.currentItem.overdue / this.currentItem.total) * 100
      return num.toFixed(1)
    },
  },
  mounted() {
    this.list = this.getList()
    this.$nextTick(() => {
      this.showPenel(0)
    })
  },
  methods: {
    initChart(params) {
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
      chart.setOption(option)
    },
    initLineChart(idx) {
      var myChart = echarts.init(document.getElementById(`lineChart${idx}`))
      let axisLabelList = this.getAxisLabelList()
      let dataFault = this.getDataFault()
      let dataOffline = this.getDataOffline()

      var option = {
        color: ['#FF4646', '#F37D2C'],
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
            name: '故障率',
            icon: 'circle',
          }, {
            name: '离线率',
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
          data: axisLabelList,
          // splitNumber: 24,
          axisTick: {
            show: true,
            inside: true,
            interval: 0,
          },
          axisLabel: {
            // showMinLabel: false,
            // showMaxLabel: false,
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
            name: '故障率',
            type: 'line',
            symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
            symbolSize: 1,
            data: dataFault,
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
          },
          {
            name: '离线率',
            type: 'line',
            symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
            symbolSize: 1,
            data: dataOffline,
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
          }
        ]
      }
      myChart.setOption(option)
    },
    getAxisLabelList() {
      var list = []
      for(let i = 1; i<= timeObj.d; i++){
        let it = (timeObj.mon + 1) +'.' + i
        list.push(it)
      }
      return list
    },
    toggleItem(idx){
      if(this.list[idx].isActive) return

      this.list.forEach((val, index) => {
        if (idx !== index ) {
          val.isActive = false
        }
      })

      this.list[idx].isActive = !this.list[idx].isActive
      this.$nextTick(() => {
        this.showPenel(idx)
      })
    },
    getList() {
      let list = this.dataObj[this.rank]
      list = list.map(item => { 
        item.isActive = false
        return item
      })
      list[0].isActive = true
      return list
    },
    showPenel(idx) {
      this.currentItem = this.list[idx]
      this.initChart({
        per: 20,
        ref: 'pieFault' + idx,
        color: '#00B7FF'
      })
      this.initChart({
        per: 11,
        ref: 'offLine' + idx,
        color: '#F37D2C'
      })
      this.initChart({
        per: 26,
        ref: 'over' + idx,
        color: '#FF4646'
      })
      this.initLineChart(idx)
      this.initLineChart(idx + '-2')
    },
    getDataFault() {
      let arr = []
      for(let i =1; i< timeObj.d; i++){
        arr.push(this.getRandomInt(0, 5))
      }
      arr.push(this.perfault)
      return arr
    },
    getDataOffline() {
      let arr = []
      for(let i =1; i< timeObj.d; i++){
        arr.push(this.getRandomInt(0, 15))
      }
      arr.push(this.peroffLine)
      return arr
    },
    getRandomInt(min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min + 1)) + min
    },
  },
  watch: {
    rank() {
      this.list = this.getList()
      this.showPenel(0)
    }
  }
}
</script>

<style lang="less" scoped>
.overview{
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
      width: 22px;
      height: 22px;
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
      .flex-1{
        flex:1;
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
      margin: 8px 0;
      .item {
        // * {
        //   transition: all .3s ease-in-out;
        // }
        .open {
          display: none;
          height: 421px;
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
              margin: 0 50px;
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
</style>