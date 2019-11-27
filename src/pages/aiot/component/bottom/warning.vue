<template>
  <div class="overview">
    <div class="title-people">
      <div><i />告警</div>
      <div class="wrap-more" @click="showMore">更多<i class="more" /></div>
    </div>
    <div class="body">
      <div class="wrap-chart">
        <div class="rate">
          <div>总计</div>
          <div class="num yantramanav">{{chartData[0].total}}</div>
        </div>
        <div class="chart" ref="chart"></div>
      </div>
      <div class="table">
        <table>
          <thead class="head">
            <tr>
              <th class="time">告警时间</th>
              <th class="lvl v-hide">紧急程度</th>
              <th class="location">位置</th>
              <th class="type">告警类型</th>
              <th class="status">状态</th>
            </tr>
          </thead>
        </table>
        <!--滚动 内容 -->
        <div class="scroll-box">
          <table ref="scorllTable">
            <tbody>
              <tr v-for="(it, idx) in list" :key="idx">
                <td class="time">{{it.alarmTime | formatTime2}}</td>
                <td class="lvl v-hide">{{it.alarmLvl | waringRank}}</td>
                <td class="location">{{it.location}}</td>
                <td class="type">{{it.alarmType}}</td>
                <td class="status">{{it.dealStatus| dealStatus}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import { mapGetters, mapMutations } from 'vuex'

export default {
  data() {
    return {
      isSmallscreen: window.screen.availHeight < 800,
      list: [],
      chartData: [{
        'id': '',
        'total': 0,
        'wait': 0,
        'dealing': 0,
        'done':0
      }]
    }
  },
  computed: {
    ...mapGetters(['projectId']),
  },
  mounted() {
    this.getData()
  },
  methods: {
    ...mapMutations(['showWarning']),
    iniChart() {
      let chart = echarts.init(this.$refs.chart)
      let option = {
        color: ['#13E38D', '#00B7FF', '#FF4646'],
        grid: {
          left: '0',
          right: '0',
          top: '0',
          bottom: '0',
          containLabel: true
        },
        legend: {
          show: !this.isSmallscreen,
          align: 'left',
          left: 0,
          bottom: 20,
          padding: [10, 0],
          textStyle: {
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 12,
          },
          itemWidth: 8,
          data: [{
            name: '已处理',
            icon: 'circle',
          }, {
            name: '处理中',
            icon: 'circle',
          }, {
            name: '待处理',
            icon: 'circle',
          }],
        },
        // calculable: true,
        series: [{
            name: '车位',
            type: 'pie',
            radius: [36, 40],
            center: this.isSmallscreen ? ['32%', '50%'] : ['32%', '30%'],
            hoverOffset: 3,
            label: {
              normal: {
                show: false,
                formatter: function(val) {   //让series 中的文字进行换行
                  return val.name.split(" ").join("\n\n")
                }
              },
            },
            labelLine: {
              normal: {
                show: false,
                length: 6,
                length2: 12
              },
            },
            data: [
              { value: this.chartData[0].done, name: '已处理' },
              { value: this.chartData[0].dealing, name: '处理中' },
              { value: this.chartData[0].wait, name: '待处理' }
            ]
          }
        ]
      }
      this.carRate = '22'
      chart.setOption(option)
      //设置默认选中高亮部分
      chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: 2
      })
    },
    initScorll() {
      var sTab = this.$refs.scorllTable//要滚动的表
      var tbody = sTab.getElementsByTagName('tbody')[0]//要滚动表格的内容
      sTab.appendChild(tbody.cloneNode(true))//追加一次滚动内容,以防滚动后可视区域无内容
      var speed = sTab.getElementsByTagName('tr')[0].offsetHeight//每次滚动的距离
      var tbdh = tbody.offsetHeight//整个表的高度,是因为上边的边不算滚动
      console.log(tbdh)
      console.log(speed)
      function scrollTop() {
        var t = sTab.offsetTop//获取要滚动表的位置
        if (-tbdh > t) {//比较  滚动的距离等于整个表的高度   即第一个表完全看不见
          sTab.style.transition = '0s'//过渡动画设为0秒
          sTab.style.top = 0//位置设为初始位置
          scrollTop()//因为偷梁换柱消耗了一次过程,所以把这一次过程补回来
        }else{
          sTab.style.transition = '1s'
          sTab.style.top = t - speed + 'px'
        }
      }
      setInterval(scrollTop, 1500)
    },
    showMore() {
      this.showWarning()
    },
    getData() {
      this.$http({
        method:'post',
        url:'/api/json/ufoXcApi/getAlarmMonitorRecord',
        data:{
          projectId: this.projectId
        }
      })
        .then((res) => {
          this.list = res.data.ufoDeviceAlarmRecordList || []
          if(this.list.length > 3){
            this.$nextTick(() => {
              this.initScorll()
            })
          }
        })

      this.$http({
        method:'post',
        url:'/api/json/ufoXcApi/getAlarmInfoStatistic',
        data:{
          projectId: this.projectId
        }
      })
        .then((res) => {
          if(res.data.alarmInfo && res.data.alarmInfo.length > 0 ){
            this.chartData = res.data.alarmInfo
          }
          this.iniChart()
        })
    },
  }
}
</script>

<style lang="less" scoped>
.overview{
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  .title-people {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.16);
    margin-bottom: 8px;
    i {
      vertical-align: sub;
      display: inline-block;
      width: 18px;
      height: 18px;
      margin-right: 3px;
      background: url("~@assets/img/demo/mul-alarm.png");
      background-size: 100% 100%;
      &.more {
        width: 4px;
        height: 6px;
        background: url("~@assets/img/demo/icon-arr.png");
        background-size: 100% 100%;
        margin-left:5px;
      }
    }
    .wrap-more{
      cursor: pointer;
      color: #00B7FF;
      i{
        vertical-align: middle;
      }
    }
  }

  .body{
    display: flex;
    font-size: 12px;
    .wrap-chart{
      position: relative;
      width: 135px;
      height: 172px;
      .chart{
        width: 135px;
        height: 172px;
      }
      .rate{
        text-align: center;
        position: absolute;
        top: 10px;
        left: 0;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.4);
        width: 80px;
        height: 80px;
        border-radius: 50%;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .num{
          font-size: 18px;
          color: #fff;
        }
      }
    }

    .table{
      flex: 1;
      height: 172px;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0;
      }
      .head-img{
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      .head{
        border-bottom: 1px solid rgba(255, 255, 255, 0.16);
        tr{
          display: flex;
          align-items: center;
        }
      }
      table{
        width: 100%;
        table-layout: auto;
        white-space: nowrap;
        thead tr{
          color:rgba(255,255,255,0.4);
          height: 24px;
        }
        tbody{
          tr{
            color:rgba(255,255,255,0.6);
            height: 40px;
          }
          .red{
            color: #FF4646;
          }
        }

      }
    }
  }

  .scroll-box{
    height: 120px;
    overflow: hidden;
    position: relative;
    table{
      position: absolute;
      left: 0;
      top: 0;
      tr{
        white-space: nowrap;
        display: flex;
        align-items: center;




      }
    }
  }
  
  table{
    tr{
      justify-content: space-between;
      td{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .time{
      width: 90px;
    }
    .lvl{
      width: 50px;
    }
    .location{
      width: 100px;
    }
    .type{
      width: 60px;
    }
    .status{
      width: 50px;
    }
  }
}

// 小屏幕适配
@media screen and (max-height: 800px) {
  .overview {
    margin-top: 0;
    .body {
      .wrap-chart{
        width: 95px;
        height: 120px;
        .chart{
          height: 120px;
        }
        .rate{
          top: 20px;
          left: 3px;
        }
      }
      .table{
        flex: 1;
        height: 120px;
        table{
          tbody{
            tr{
              height: 32px;
            }
          }
        }
      }

      .table-row{
        height: 32px !important;
        line-height: 32px !important;
        &.border-line{
          height: 24px !important;
          line-height: 24px !important;
        }
        .table-col.chart{
          padding-bottom: 12px !important;
          span{
            top: -25px !important;
          }
        }
      }
    }
  }
}
</style>