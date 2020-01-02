<template>
  <div class="overview">
    <div class="title-people">
      <div><i />工单信息</div>
      <div class="wrap-more" @click="showMore">更多<i class="more" /></div>

    </div>
    <div class="body">
      <div class="wrap-chart">
        <div class="rate">总计<div class="num">{{chartData[0].total}}</div></div>
        <div class="chart" ref="chart"></div>
      </div>
      <div class="table">
        <table class="head">
          <thead>
            <tr>
              <th class="flex-2">报单时间</th>
              <th class="flex-2">紧急程度</th>
              <th class="flex-2">类型</th>
              <th class="flex-1">状态</th>
            </tr>
          </thead>
        </table>
        <!--滚动 内容 -->
        <div class="scroll-box">
          <table ref="scorllTable">
              <tbody>
                <tr v-for="(it, idx) in list" :key="idx">
                  <td class="flex-2">{{it.informTime | formatTime2}}</td>
                  <td class="flex-2">{{it.orderLvl}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                  <td class="flex-2">{{it.deviceType | typeToName}}</td>
                  <td class="flex-1">{{it.businessType| businessType}}</td>
                </tr>
              </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import echarts from 'echarts'
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  data() {
    return {
      isSmallscreen: document.documentElement.clientHeight < 800,
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
    ...mapState(['refresh']),
    ...mapGetters(['projectId']),
  },
  mounted() {
    this.getData()
  },

  methods: {
    ...mapMutations(['showWorkorder']),
    iniChart() {
      let chart = echarts.init(this.$refs.chart)

      let legendAndSearies = this.getLegendAndSearies()

      console.log(legendAndSearies)
      let option = {
        color: ['#13E38D', '#00B7FF', '#F37D2C'],
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
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
          bottom: 15,
          padding: [10, 0],
          textStyle: {
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 12,
          },
          itemWidth: 8,
          data: legendAndSearies.legend,
        },
        // calculable: true,
        series: [{
            name: '工单',
            type: 'pie',
            radius: [36, 40],
            center: this.isSmallscreen ? ['32%', '50%'] : ['32%', '30%'],
            hoverAnimation: false,
            clockwise: false,
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
            data: legendAndSearies.searies
          }
        ]
      }
      this.carRate = '1020'
      chart.setOption(option)

      //设置默认选中高亮部分
      // chart.dispatchAction({
      //   type: 'highlight',
      //   seriesIndex: 0,
      //   dataIndex: 2
      // })
    },
    initScorll() {
      let intv = null
      if(intv!=null){
        clearInterval(interval)
        intv=null
      }
      var sTab = this.$refs.scorllTable//要滚动的表
      var tbody = sTab.getElementsByTagName('tbody')[0]//要滚动表格的内容
      sTab.appendChild(tbody.cloneNode(true))//追加一次滚动内容,以防滚动后可视区域无内容
      var speed = sTab.getElementsByTagName('tr')[0].offsetHeight//每次滚动的距离
      var tbdh = tbody.offsetHeight//整个表的高度,是因为上边的边不算滚动
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
      intv = setInterval(scrollTop, 1500)
    },
    getLegendAndSearies() {
      let colorList = ['#13E38D', '#00B7FF', '#F37D2C']
      let searies = []
      let legend = []
      this.chartData[0].statusList.forEach((el, idx) => {

        let legIt = {
          name: '',
          icon: 'circle',
        }
        let item = { 
          value: '',
          name: '',
          itemStyle: {
            borderColor: "#13E38D",
            borderWidth: 5 - idx * 2,
          }
        }

        let itemName = this.statusToName(el.status)
        console.log(itemName)
        item.name = itemName
        item.value = el.count
        legIt.name = itemName
        item.itemStyle.borderColor = colorList[idx]

        searies.push(item)
        legend.push(legIt)
      })

      return {
        legend,
        searies,
      }
    },
    statusToName(status) {
      /* eslint-disable no-unreachable */
      switch(status) {
        // 通行设备
        case '1':
          return '待分派'
          break
        case '2':
          return '已接单'
          break
        case '3':
          return '处理中'
          break
        case '4':
          return '已完成'
          break
        case '5':
          return '已评价'
          break
        case '6':
          return '超时'
          break
        case '7':
          return '待评价'
          break
        default:
          return status
      }
    },
    showMore() {
      this.showWorkorder()
    },
    getData() {
      // 获取滚动表格数据
      this.$http({
        method:'post',
        url:'/api/json/workOrderApi/getOrderRecord',
        data:{
          projectId: this.projectId,
          pageNo: '1',
          pageSize: '10',
          startTime: moment().subtract(2,'years').format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
      })
        .then((res) => {
          this.list = res.data.orderRecordList.slice(0,10)
          if(this.list.length > 3){
            this.$nextTick(() => {
              this.initScorll()
            })
          }
        })
      // 获取饼图数据
      this.$http({
        method:'post',
        url:'/api/json/workOrderApi/getOrderInfoStatistic',
        data:{
          projectId: this.projectId,
          cityCode: '',
          startTime: moment().subtract(2,'years').format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          pageNo: '1',
          pageSize: '1000',
        }
      })
        .then((res) => {
          if(res.data.orderInfo && res.data.orderInfo.length > 0 ){
            this.chartData = res.data.orderInfo
          } else {
            // 默认值
            this.chartData = [{
              'id': '',
              'total': 0,
              'wait': 0,
              'dealing': 0,
              'done':0
            }]
          }
          this.iniChart()
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
.overview{
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  .title-people {
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
      background: url("~@assets/img/demo/mul-order.png");
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
        display: flex;
        align-items: center;
      }
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
      .table{
        flex: 1;
        height: 120px;
        overflow: auto;
        &::-webkit-scrollbar {
          width: 0;
        }
        .head-img{
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }
        table{
          thead tr{
            color:rgba(255,255,255,0.4);
            height: 24px;
          }
          tbody{
            tr{
              color:rgba(255,255,255,0.6);
              height: 32px;
            }
            .red{
              color: #FF4646;
            }
          }
        }
      }
    }
  }
}
</style>