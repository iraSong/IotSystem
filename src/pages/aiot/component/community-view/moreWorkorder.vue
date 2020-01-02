<template>
  <div class="qdDialog flex-center" @click.self="hide" v-show="showMoreWorkorder">
    <div class="dialog-main">
      <div class="dialog-title">
        <div class="name">工单</div>
        <div class="close" @click.stop="hide" />
      </div>
      <div class="dialog-content">
        <div class="left">
          <div><i class="icon" />工单</div>
          <div class="lineChart"
            ref="lineChart1" />

          <div class="sub-title"><i class="icon" />告警类型</div>

          <div class="pieChart">
            <div ref="pieChart1" id="pieChart1" class="pieChart"></div>
            <div class="rate">
              告警</br>类型
              <div class="label-line">
                <div v-if="this.typeData[0]">
                  <span class="line line1" />
                  <span class="line line2" />
                  <div class="item" 
                    v-if="this.typeData[0]">{{this.typeData[0].type | businessType}}
                    <span class="yantramanav">
                      {{this.typeData[0].value}}
                    </span>
                  </div>
                </div>

                <div v-if="this.typeData[1]" class="f-mgt18">
                  <span class="line line1 yell" />
                  <span class="line line2 yell" />
                  <div class="item" 
                    v-if="this.typeData[1]">{{this.typeData[1].type | businessType}}
                    <span class="yantramanav">
                      {{this.typeData[1].value}}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div class="sub-title"><i class="icon" />紧急程度</div>
          <div class="pieChart">
            <div ref="pieChart2" id="pieChart2" class="pieChart"></div>
            <div class="rate">
              紧急</br>程度
              <!-- <div class="urgency">
                <p class="low">低</p>
                <p class="middle">中</p>
                <p class="high">高</p>
              </div> -->
            </div>
          </div>

        </div>

        <div class="right">
          <div class="sub-title"><i class="icon" />工单信息</div>
          <div class="wrap-head">
            <div class="table-head">
              <div class="name">工单编号</div>
              <div class="time">报单时间</div>
              <div class="rank">紧急程度</div>
              <div class="type">类型</div>
              <div class="status">状态</div>
            </div>
            <div class="info-block"></div>
          </div>

          <div class="record-list">
            <div class="table-list">
              <div v-for="(it,idx) in listRecord" :key="idx" @click="changeCurrentItem(it,idx)" :class="[{'active': idx == currentIdx}, 'col-table']">
                <div class="name">{{it.crmOrderId}}</div>
                <div class="time">{{it.informTime | formatTime2}}</div>
                <div class="rank">{{it.orderLvl | waringRank}}</div>
                <div class="type">{{it.businessType | businessType}}</div>
                <div class="status">{{it.orderStatus | orderStatus }}</div>
              </div>

              <!--分页-->
              <div class="wrap-page">
                <Page 
                  @on-change="pageNoChange" 
                  :total="+totalCnt" 
                  :current="+pageNo" 
                  :page-size="10" 
                  size="small" 
                  class-name="page"/>
              </div>
            </div>

            <div class="info">
              <div class="orderInfo">
                <div class="item">
                  <div>原因类型</div>
                  <div v-if="currentDetail.orderInfo" class="txt">{{currentDetail.orderInfo.orderType}}</div>
                </div>
                <div class="item">
                  <div>报事叙述</div>
                  <div v-if="currentDetail.orderInfo" class="txt">{{currentDetail.orderInfo.orderDesc}}</div>
                </div>
              </div>

              <div class="orderDetail" v-if="currentDetail.orderDetail">
                <div class="line"></div>
                <div class="item" v-for="(it, idx) in currentDetail.orderDetail" :key="idx">
                  <div class="lable"><span></span></div>
                  <div class="content">{{it.step}}:<br />{{it.time}}</div>
                </div>
                <!-- <div class="item current">
                  <div class="lable"><span></span></div>
                  <div class="content">接单处理:<br />08:00:24</div>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import echarts from 'echarts'
import { mapState, mapGetters, mapMutations} from 'vuex'

export default {
  data() {
    return {
      pageNo: '1',
      pageSize: '10',
      totalCnt: '',

      labelList: [],// x轴 lable
      dataArr: [], // line 数组

      listRecord: [], 
      currentDetail: {}, // 当前选择记录
      currentIdx: 0,
      // pie
      parData: {
        carRate: '0.0',
        use: '0.0',
        free: '0.0',
        unit: ''
      },
      // pie
      typeData: [{
        type: '重点关注',
        name: '重点关注',
        value: '0',
      }, {
        type: '设备告警',
        name: '设备告警',
        value: '0',
      }],
      lvlData: [{
        type: '高',
        name: '高',
        value: '0',
      },{
        type: '中',
        name: '中',
        value: '0',
      },{
        type: '低',
        name: '低',
        value: '0',
      }],
    }
  },
  computed: {
    ...mapState(['showMoreWorkorder', 'rank']),
    ...mapGetters(['projectId']),
  },
  mounted() {
  },
  methods: {
    ...mapMutations(['hide']),
    init() {
      this.getLineData()
      // 获取告警类型数据
      this.getStatisticData('alarmType')
        .then((res) => {
          if(res.data.orderStatistic && res.data.orderStatistic.length > 0) {
            this.typeData = res.data.orderStatistic.map(el => {
              let name = el.businessName
              let value = el.orderCount
              let type = el.businessType
              return {
                type,
                name,
                value
              }
            })
          } else {
            this.typeData = [{
              type: '重点关注',
              name: '重点关注',
              value: '0',
            }, {
              type: '设备告警',
              name: '设备告警',
              value: '0',
            }]
          }

          this.initParChart({
            type: '告警类型',
            ref: 'pieChart1',
            legend: {
              show: true,
              data: []
            },
            color: ['#00B7FF', '#F37D2C'],
            data: this.typeData
          })
        })

      // 获取紧急程度数据
      this.getStatisticData('alarmLvl')
        .then((res) => {
          let legendData = []
          if(res.data.orderStatistic && res.data.orderStatistic.length > 0) {
            this.lvlData = res.data.orderStatistic.map(el => {
              let name = el.businessName
              let value = el.orderCount
              let type = el.businessType

              legendData.push({
                name: name,
                icon: 'circle'
              })

              return {
                type,
                name,
                value
              }
            })
          } else {
            this.lvlData = [{
              type: '高',
              name: '高',
              value: '0',
            },{
              type: '中',
              name: '中',
              value: '0',
            },{
              type: '低',
              name: '低',
              value: '0',
            }]
          }
          this.initParChart({
            type: '紧急程度',
            ref: 'pieChart2',
            legend: {
              show: true,
              data: legendData
            },
            color: ['#F3EB2C', '#F37D2C', '#FF4646'],
            data: this.lvlData
          })
        })
      this.getRecordData()
    },
    getLineData() {
      // 获取折线图数据
      this.$http({
        method:'post',
        url:'/api/json/workOrderApi/getOrderStatisticCurrentDay',
        data:{
          projectId: this.projectId,
          startTime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        }
      })
        .then((res) => {
          this.dealData(res)
          this.initChart({
            ref: 'lineChart1'
          })
        })
    },
    getRecordData(pageNo = this.pageNo) {
      // 获取列表数据
      this.$http({
        method:'post',
        url:'/api/json/workOrderApi/getOrderRecord',
        data:{
          projectId: this.projectId,
          pageNo: pageNo,
          pageSize: this.pageSize,
          startTime: moment().subtract(2,'years').format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
      })
        .then((res) => {
          this.totalCnt = res.data.totalCnt
          this.listRecord = res.data.orderRecordList.slice(0,10)
          if(this.listRecord && this.listRecord.length > 0) {
            this.getOrderDetail(this.listRecord[this.currentIdx].crmOrderId)
          } else {
            // 没有工单记录
            this.currentDetail = {}
          }

        })
    },
    getOrderDetail(crmOrderId) {
      this.$http({
        method:'post',
        url:'/api/json/workOrderApi/getOrderDetail',
        data:{
          crmOrderId
        }
      })
        .then((res) => {
          this.currentDetail = res.data.orderInfo
        })
    },
    getStatisticData(statisticMode) {
      return this.$http({
        method:'post',
        url:'/api/json/workOrderApi/getOrderTypeStatisticCurrentDay',
        data:{
          projectId: this.projectId,
          statisticMode,
          startTime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        }
      })
    },
    dealData(res) {
      this.dataArr = []
      this.labelList = []
      if(res.data.orderStatusList && res.data.orderStatusList.length > 0) {
        res.data.orderStatusList.forEach((el) => {
          let arr = el.timeStatisticTimeList

          let monitorName = this.statusToName(el.status)

          let arrList = []
          let labelList = []

          arr.forEach(el => {
            arrList.push(el.orderCount)
            labelList.push(el.time)
          })
  
          this.dataArr.push({
            name: monitorName,
            dataList: arrList
          })

          this.labelList = labelList
        })
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
    getSeriesAndLegend() {
      let series = []
      let legend = []

      let color =  [{
          start: 'rgba(0, 220, 255, 0)',
          end: 'rgba(0, 220, 255, 0.12)'
        },{
          start: 'rgba(19, 227, 141, 0)',
          end: 'rgba(19, 227, 141, 0.12)'
        },{
          start: 'rgba(243, 125, 44, 0)',
          end: 'rgba(243, 125, 44, 0.12)'
        },{
          start: 'rgba(0, 183, 255, 0)',
          end: 'rgba(0, 183, 255, 0.12)'
        },{
          start: 'rgba(255, 0, 79, 0)',
          end: 'rgba(255, 0, 79, 0.12)'
        }
      ]

      this.dataArr.forEach((el, idx) => {
        let serie =  {
          name: el.name,
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
          data: el.dataList,
          areaStyle: {
            normal: {
            //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: color[idx].start
              },{
                  offset: 1,
                  color: color[idx].end
              }]),
              origin: 'end'
            }
          },
        }
        series.push(serie)
        legend.push({
          name: el.name,
          icon: 'circle',
        })
      })
      return {
        series,
        legend
      }
    },

    initChart(params) {
      var myChart = echarts.init(this.$refs[params.ref])
      let seriesAndLegend = this.getSeriesAndLegend()
      let {series, legend } = seriesAndLegend
      var option = {
        color: [ '#F37D2C', '#00B7FF', '#13E38D','#FF4949', '#FF004F'],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          align: 'left',
          show: true,
          left: 0,
          padding: [10, 0],
          textStyle: {
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 12,
          },
          itemWidth: 8,
          data: legend,
        },
        grid: {
          top: '38',
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
        series: series
      }

      myChart.clear()
      myChart.setOption(option)
    },
    initParChart(params) {
      let chart = echarts.init(this.$refs[params.ref])
      let option = {
        color: params.color,
        grid: {
          left: '0',
          right: '0',
          top: '0',
          bottom: '0',
          containLabel: true
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          show: params.legend.show,
          orient: 'vertical',
          align: 'left',
          left: 120,
          top: 15,
          padding: [10, 0],
          textStyle: {
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 12
          },
          itemWidth: 8,
          data: params.legend.data
        },
        // calculable: true,
        series: [{
            name: params.type,
            type: 'pie',
            radius: [39, 42],
            center: ['45', '52'],
            // roseType: 'radius',
            startAngle: 0,
            hoverOffset: 2,
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
                length2: 12,
                lineStyle: {
                },
              },
            },
            emphasis: {
              itemStyle: {
              }
            },
            itemStyle: {
              shadowBlur: 10,
              shadowColor: '#00B7FF',
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              opacity: 1,
            },
            data: params.data
          }
        ]
      }
      chart.clear()
      chart.setOption(option)
      //设置默认选中高亮部分
      // chart.dispatchAction({
      //   type: 'highlight',
      //   seriesIndex: 0,
      //   dataIndex: 2
      // })
    },
    changeCurrentItem(item, idx) {
      this.currentIdx = idx
      this.getOrderDetail(item.crmOrderId)
    },
    pageNoChange(pageNo) {
      this.getRecordData(pageNo)
    }
  },
  watch: {
    showMoreWorkorder(val) {
      if(val){
        this.currentIdx = 0,
        this.init()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.qdDialog{
  color: #fff;
  &::before{
    content: "";
    position: fixed;
    z-index: 99;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,16,31,0.8);
  }
  .dialog-main{
    position: absolute;
    top:50%;
    left:50%;
    z-index: 999;
    transform: translate(-50%, -50%);

    background:rgba(0,16,31,0.8);
    border-radius:2px;
    border:1px solid rgba(255,255,255,0.08);

    display: flex;
    flex-direction: column;

    height: 700px;
    .dialog-title{
      background: #273641;
      .name{
        font-size:20px;
        font-weight:600;
        text-align: center;
        padding: 17px 0;
      }
      .close{
        cursor: pointer;
        position: absolute;
        top: 24px;
        right: 24px;
        width: 14px;
        height: 15px;
        background: url("~@assets/img/demo/city/close.png");
        background-size: 100% 100%;
      }
    }
    .dialog-content{
      opacity: .8;
      background: #1f2d39;
      flex: 1;
      display: flex;
      justify-content: flex-start;
      .left{
        padding: 24px 0 0 24px;
        background:rgba(12,28,42,0.6);
        width: 319px;
        font-size:14px;
        .sub-title{
          margin-top: 32px;
        }
        .pieChart{
          width: 270px;
          height: 100px;
          position: relative;
          .rate{
            pointer-events: none;
            text-align: center;
            position: absolute;
            top: 12px;
            left: 45px;
            transform: translate(-50%, 0);
            font-size: 12px;
            width: 82px;
            height: 82px;
            background: rgba(0, 183, 255, 0.2);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;

            .label-line{
              position: absolute;
              left: 120px;
              top:0;
              .line{
                display: inline-block;
                width: 14px;
                height: 1px;
                background: #00B7FF;
                position: absolute;
              }
              .line1{
                transform: rotate(-45deg);
                left: -37px;
                top: 20px;
                &.yell{
                  transform: rotate(45deg);
                  left: -37px;
                  top: 59px;
                  background: #F37D2C;
                }
              }
              .line2{
                top: 15px;
                left: -25px;
                width: 20px;
                &.yell{
                  top: 64px;
                  // left: -29px;
                  // width: 26px;
                  background: #F37D2C;
                }
              }


              .item{
                white-space: nowrap;
                span{
                  font-size:20px;
                  color: #fff;
                }
              }
            }

            color:rgba(255,255,255,.5);
            .num{
              font-size: 20px;
              color: #fff;
            }
          }
        }
        .lineChart {
          width: 270px;
          height: 150px;
        }
      }
      .right{
        display: flex;
        flex-direction: column;

        font-size:12px;
        padding: 24px 0 0 24px;
        flex:1;
        .sub-title{
          font-size: 14px;
        }
        .wrap-head{
          width: 828px;
          border-bottom: 1px solid rgba(255,255,255,0.16);
          display: flex;
          .table-head{
            flex: 1;
            margin-top:12px;
            display: flex;
            align-items: center;
            height: 24px;
            justify-content: space-between;
            color:rgba(255,255,255,0.4);
            padding-right:24px;
          }
          .info-block{
            width: 252px;
          }
        }

        .record-list{
          flex: 1;
          display: flex;
          .table-list{
            overflow-y: scroll;
            padding-right:24px;
            flex: 1;
            .col-table{
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              &.active{
                background:rgba(255,255,255,0.04);
              }
            }
          }
          .info{
            font-size:12px;
            color:rgba(255,255,255,0.4);
            border-left: 1px solid rgba(255,255,255,0.16);
            padding: 20px 24px 24px;
            width: 252px;
            position: relative;
            i{
              vertical-align: text-bottom;
              display: inline-block;
              width: 13px;
              height: 17px;
              margin-right: 3px;
              background: url("~@assets/img/demo/city/info.png");
              background-size: 100% 100%;
            }
            .head{
              margin: 19px 0;
              display: flex;
              justify-content: space-around;
              align-items: center;
              .head-img{
                width: 60px;
                height: 60px;
                border-radius: 50%;
              }
              .vs{
                width: 15px;
                height: 10px;
              }
            }
            .title{
              margin-bottom:23px;
            }
            .item{
              margin-bottom: 22px;
              color:rgba(255,255,255,0.4);
              font-size:12px;
              display: flex;
              align-items: baseline;
              .lable{
                width: 10px;
                height: 10px;
                margin-right: 7px;
                border-radius: 50%;
                background: rgba(255,255,255,0.4);
                position: relative;
              }
              .content{
                line-height:24px;
                flex:1;
              }
              &.current{
                color: rgba(255,255,255,0.8);
                .lable{
                  background: rgba(255,255,255,0.8);
                }
              }
            }
            .orderInfo{
              .item{
                line-height:28px;
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid rgba(255,255,255,0.08);
                .txt{
                  line-height:20px;
                  text-align: right;
                  width: 124px;
                  color:rgba(255,255,255,1);
                }
              }
            }
            .orderDetail{
              position: relative;
              .line{
                position: absolute;
                top: 10px;
                left: 5px;
                width: 1px;
                height: calc(100% - 50px);
                background: #33454E;
              }
            }
          }
        }

        .name{
          width: 160px;
        }
        .type{
          width: 100px;
        }
        .rank{
          width: 80px;
        }
        .time{
          width: 100px;
        }
        .status{
          width: 100px;
        }
      }
    }
  }
}

.wrap-page{
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
}
.page{
  margin-top:12px;
  text-align: center;
  /deep/ .ivu-page-next, /deep/ .ivu-page-prev, /deep/ .ivu-page-item {
    background: transparent;
  }
}

.f-mgt18 {
  margin-top: 18px;
}
.urgency {
  position: absolute;
  left: 100px;
  top: 4px;
  font-size: 12px;
  line-height: 20px;
  color: rgba(255,255,255,0.8);

  p {
    margin: 4px 0;
    white-space: nowrap;
    
    &:before {
      float: left;
      margin: 6px 2px 0;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      content: '';
    }

    &.low:before {
      background: #F3EB2C;
    }
    &.middle:before {
      background: #F37D2C;
    }
    &.high:before {
      background: #FF4645;
    }
  }
}
</style>