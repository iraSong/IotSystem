<template>
  <div class="people">
    <div class="title-people" @click.stop="togglePieChart">
      <div><i />人流量</div>
      <!-- <i class="more"/>
      <qd-pie-chart ref ="pieChart" /> -->
    </div>
    <div class="body">
      <div class="menu-tab">
        <div :class="[{'active': lineType == 'hour'}, 'menu-item']" @click="getData('hour')"><span></span>&nbsp;小时</div>
        <div :class="[{'active': lineType == 'day'}, 'menu-item']" @click="getData('day')"><span></span>&nbsp;天</div>
        <div :class="[{'active': lineType == 'month'}, 'menu-item']" @click="getData('month')"><span></span>&nbsp;月</div>
      </div>
      <div class="lineChart"
        ref="lineChart" />
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import qdPieChart from './pieChart.vue'
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  data() {
    return {
      ownerList: [],
      visitorList: [],
      labelList: [],
      lineType: 'hour'
    }
  },
  components: {
    qdPieChart
  },
  computed: {
    ...mapState(['rank', 'refresh']),
    ...mapGetters(['cityCode', 'projectId']),
  },
  mounted() {
    this.getData()
    // 浏览器窗口改变，charts图 需要重绘
    let tid
    window.addEventListener('resize', () => {
      clearTimeout(tid)
      tid = setTimeout(() => {
        this.$refs.lineChart.removeAttribute("_echarts_instance_")
        this.initChart()
      }, 300)
    }, false)
  },

  methods: {
    ...mapMutations(['togglePiePanel']),
    getData(type='hour') {
      this.lineType = type
      this.$http({
        method:'post',
        url:'/api/json/ufoXcApi/getPassingStatistic',
        data:{
          cityCode: this.cityCode,
          projectId: this.projectId,
          statisticType: this.lineType,
        }
      })
        .then((res) => {
          this.dealData(res)
          this.initChart()
        })
    },
    dealData(res) {
      let arrOwner = res.data.owner
      let arrVisitor = res.data.visitor

      let ownerList = []
      let visitorList = []
      let labelList = []

      arrOwner.forEach(el => {
        ownerList.push(el.passingData)
        labelList.push(el.statisticDate)
      })
 
      arrVisitor.forEach(el => {
        visitorList.push(el.passingData)
      }) 

      this.ownerList = ownerList
      this.visitorList = visitorList
      this.labelList  = labelList
    },
    initChart() {
      var myChart = echarts.init(this.$refs.lineChart)
      var option = {
        color: ['#00B7FF', '#F37D2C'],
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
            name: '业主',
            icon: 'circle',
          }, {
            name: '访客',
            icon: 'circle',
          }],
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
            name: '业主',
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
            data: this.ownerList,
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
          {
            name: '访客',
            type: 'line',
            symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
            symbolSize: 1,
            lineStyle: {
              width: 1,
              type: 'solid',
              shadowBlur: 10,
              shadowColor: '#F37D2C',
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              opacity: 1,
            },
            data: this.visitorList,
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

      myChart.clear()
      myChart.setOption(option)
    },
    togglePieChart() {
      this.togglePiePanel({
        show: 'toggle'
      })
    }
  },
  watch: {
    refresh() {
      this.getData()
    }
  }
}
</script>

<style lang="less" scoped>
.people {
  margin-top: 30px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  .body{
    position: relative;
  }
  .title-people {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.16);
    margin-bottom: 4px;
    i {
      vertical-align: sub;
      display: inline-block;
      width: 18px;
      height: 18px;
      margin-right: 3px;
      background: url("~@assets/img/demo/icon-peo.png");
      background-size: 100% 100%;
      &.more {
        width: 15px;
        height: 3px;
        background: url("~@assets/img/demo/icon-more.png");
        background-size: 100% 100%;
      }
    }
  }

  .menu-tab{
    position: absolute;
    right: 0;
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
  .lineChart {
    width: 340px;
    height: 124px;
  }
}

// 小屏幕适配
@media screen and (max-height: 800px) {
  .people {
    margin-top: 16px;
    .lineChart {
      width: 300px;
      height: 114px;
    }
  }
}
</style>