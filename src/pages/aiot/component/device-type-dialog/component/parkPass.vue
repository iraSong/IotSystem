<template>
  <div class="dialog-content">
    <div class="left">
      <div class="section">
        <div class="title-people">
          <i />今日出场车次：<span class="yantramanav">{{currentDayOut}}</span>
        </div>
      </div>

      <div class="section">
        <div class="title-people">
          <i />车流统计
        </div>
        <div class="body">
          <div class="menu-tab">
            <div :class="[{'active': memberType == 'hour'}, 'menu-item']" @click="getMemBerLineChart('hour')">
              <span></span>&nbsp;小时
            </div>
            <div :class="[{'active': memberType == 'day'}, 'menu-item']" @click="getMemBerLineChart('day')">
              <span></span>&nbsp;天
            </div>
            <div :class="[{'active': memberType == 'month'}, 'menu-item']" @click="getMemBerLineChart('month')">
              <span></span>&nbsp;月
            </div>
          </div>
          <div class="lineChart"
            ref="lineChart1" />
        </div>
      </div>
      <div class="section">
        <div class="title-people">
          <i />出场方式统计
        </div>
        <div class="body">
          <div class="menu-tab">
            <div :class="[{'active': modeType == 'hour'}, 'menu-item']" @click="getModeLineChart('hour')">
              <span></span>&nbsp;小时
            </div>
            <div :class="[{'active': modeType == 'day'}, 'menu-item']" @click="getModeLineChart('day')">
              <span></span>&nbsp;天
            </div>
            <div :class="[{'active': modeType == 'month'}, 'menu-item']" @click="getModeLineChart('month')">
              <span></span>&nbsp;月
            </div>
          </div>
          <div class="lineChart"
            ref="lineChart2" />
        </div>
      </div>
      <div class="section">
        <div class="title-people">
          <i />车位个数：<span class="yantramanav">{{sum}}</span>
        </div>
        <div class="pieChart">
          <div ref="pieChart1" id="pieChart1" class="pieChart"></div>
          <div class="rate">
            空置率
            <div class="num yantramanav">{{ parData.carRate}}%</div>
            <div class="label-line">
              <div>
                <span class="line line1" />
                <span class="line line2" />
                <div class="item">占用车位：<span class="yantramanav">{{parData.use}}%</span></div>
              </div>

              <div>
                <span class="line line1 yell" />
                <span class="line line2 yell" />
                <div class="item">空闲车位：<span class="yantramanav">{{parData.free}}%</span></div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="center">
      <div class="title-people">
        <i />实时车流
      </div>
      <div class="section">
        <!-- 离线 -->
        <!-- <div class="card">
          <div class="card-title">
              北门门禁
            <div class="top first"><i />置顶</div>
          </div>
          <div class="card-content">
            <div class="col">09.24  19:58:00</div>
            <div class="col">
              <div class="col-item">张萌萌</div>
              <div class="col-item">业主（A1 904）</div>
              <div class="col-item last">刷卡通行（9394950594）</div>
            </div>
            <div class="col">
              <div class="wrap-img">
                <img class="card-img"
                  src="~@assets/img/face1.jpg" />
                <div>登记照片</div>
              </div>
              <div class="wrap-img">
                <img class="card-img"
                  src="~@assets/img/face2.jpg" />
                <div>抓拍</div>
              </div>
            </div>
          </div>
        </div> -->

        <div class="card" v-for="(it, idx) in deviceList" :key="idx +'card'">
          <div class="card-title">
              {{it.deviceProperties.location | parseLocation}}
            <!-- <div class="top" @click="toTop(it)"><i />置顶</div> -->
          </div>
          <div class="card-content">
            <div class="col">
              <div class="col-item">
                <div class="label">车牌号</div>
                <div class="val">{{it.carNo}}</div>
              </div>
              <div class="col-item">
                <div class="label">进场时间</div>
                <div class="val">{{it.deviceUpdateTime}}</div>
              </div>
            </div>
            <div class="col">
              <div class="col-item">
                <div class="label">卡号</div>
                <div class="val">{{it.cardNo}}</div>
              </div>
              <div class="col-item">
                <div class="label">卡类型</div>
                <div class="val">{{it.cardType}}</div>
              </div>
            </div>
            <div class="col">
              <div class="col-item" v-if="it.passType">
                <div class="label">放行类型</div>
                <div class="val">{{it.passType}}</div>
              </div>
              <div class="col-item" v-if="it.money">
                <div class="label">收费</div>
                <div class="val">{{it.money}}</div>
              </div>
            </div>
            <div class="col">
              <div class="wrap-img">
                <img class="card-img"
                  :src="it.url" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="right">
      <div class="section">
        <div class="title-people">
          <i />收费
        </div>
        <div class="money">
          <div class="col">
            <div class="col-item">
              <div class="label">今日会员收费：</div>
              <div class="val yantramanav">0</div>
            </div>
            <div class="col-item">
              <div class="label">本月累计会员收费：</div>
              <div class="val yantramanav">0</div>
            </div>
          </div>
          <div class="col">
            <div class="col-item">
              <div class="label">今日临停收费：</div>
              <div class="val yantramanav">0</div>
            </div>
            <div class="col-item">
              <div class="label">本月累计临停收费：</div>
              <div class="val yantramanav">0</div>
            </div>
          </div>
        </div>
        <div class="body">
          <div class="menu-tab">
            <div :class="[{'active': moneyType == 'day'}, 'menu-item']" @click="getMoneyLineChart('day')">
              <span></span>&nbsp;天
            </div>
            <div :class="[{'active': moneyType == 'month'}, 'menu-item']" @click="getMoneyLineChart('month')">
              <span></span>&nbsp;月
            </div>
          </div>
          <div class="lineChart"
            ref="lineChart3" />
        </div>
      </div>
      <div class="section">
        <div class="title-people">
          <i />出场记录
        </div>
        <div class="body">
          <table class="table">
            <thead>
              <tr>
                <th>时间</th>
                <th>车牌</th>
                <th>卡类型</th>
                <th>放行方式</th>
                <th>收费</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(it, idx) in recordList" :key="idx">
                <td>{{it.recordTime}}</td>
                <td>{{it.carNo}}</td>
                <td>{{it.passType}}</td>
                <td>{{it.money}}</td>
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
      currentDayOut: '', // 今日出场车次
      sum: '0', // 车位数
      // pie
      parDayData: {
        owner: '0.0',
        visitor: '0.0',
      },
      parDaysData: {
        owner: '0.0',
        visitor: '0.0',
      },
      parMonthsData: {
        owner: '0.0',
        visitor: '0.0',
      },
      deviceList: [],

      memberType: 'hour',
      modeType: 'hour',
      moneyType: 'day',
      parData: {
        carRate: "0.0",
        use: "0.0",
        free: "0.0",
        unit: ""
      },
      recordList: []
    }
  },
  computed: {
    ...mapState(['deviceInfo', 'rank']),
    ...mapGetters(['projectId']),
  },
  mounted() {
    this.init()
    this.getListData()
    this.getCurrentDayOut()
    this.getLogList()
  },
  methods: {
    ...mapMutations(['hide']),
    init() {
      this.getMemBerLineChart()
      this.getModeLineChart()
      this.getMoneyLineChart()
      // 饼图
      this.initParChart({
        ref: 'pieChart1',
        data: this.parData,
      })
    },
    getLogList() {
      this.$http({
        method:'post',
        url:'/api/json/deviceLogApi/getDeviceLog',
        data:{
          projectId: this.projectId,
          sn: this.deviceInfo.deviceSn,
          mac: this.deviceInfo.deviceMac,
          index: 'qdh_park_park_data',
          pageNo: '1',
          pageSize: '10',
        }
      })
        .then((res) => {
          this.recordList = res.data.recordList
        })
    },
    getCurrentDayOut() {
      this.$http({
        method: "post",
        url: "/api/json/ufoXcApi/getVehicleFlowStatistic",
        data: {
          projectId: this.projectId,
          statisticType: 'hour',
          statisticMode: 'direction',
          startTime: moment().subtract(2,'years').format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
      }).then(res => {
        this.currentDayOut = this.dealOutData(res)
      })
    },
    getMemBerLineChart(type = this.memberType) {
      this.memberType = type
      // 是否会员
      this.getChartData({
        statisticMode: 'member',
        statisticType: this.memberType,
      })
        .then((res) => {
          let dataObj = this.dealData({
            arr1: res.data.member || res.data.auto || res.data.vechicleIn,
            arr2: res.data.temp || res.data.manual || res.data.vechicleOut,
          })
          this.initChart({
            ref: 'lineChart1',
            legend: [{
              name: '会员车',
              icon: 'circle',
            }, {
              name: '临停车',
              icon: 'circle',
            }],
            data: dataObj
          })
        })

    },
    getModeLineChart(type = this.modeType) {
      this.modeType = type
      // 放行方式
      this.getChartData({
        statisticMode: 'passmode',
        statisticType: this.modeType,
      })
        .then((res) => {
          let dataObj = this.dealData({
            arr1: res.data.auto || res.data.vechicleIn || res.data.member,
            arr2: res.data.manual || res.data.vechicleOut || res.data.temp,
          })
          this.initChart({
            ref: 'lineChart2',
            legend: [{
              name: '正常放行',
              icon: 'circle',
            }, {
              name: '手动放行',
              icon: 'circle',
            }],
            data: dataObj
          })
        })

    },
    getMoneyLineChart(type = this.moneyType) {
      this.moneyType = type
      this.getChartData({
        statisticMode: 'member',
        statisticType: this.moneyType,
      })
        .then((res) => {
          let dataObj = this.dealData({
            arr1: res.data.auto || res.data.vechicleIn || res.data.member,
            arr2: res.data.manual || res.data.vechicleOut || res.data.temp,
          })
          this.initChart({
            ref: 'lineChart3',
            legend: [{
              name: '会员收费',
              icon: 'circle',
            }, {
              name: '临停收费',
              icon: 'circle',
            }],
            data: dataObj
          })
        })

    },
    toTop(it) {
      this.$http({
        method:'post',
        url:'/api/json/platformDeviceApi/setTopDevice',
        data:{
          projectId: this.projectId,
          deviceType: it.deviceProperties.type,
          deviceId: it.id,
        }
      })
        .then((res) => {
          this.$message({
            message: '置顶成功',
            type: res || 'success'
          })
        })
    },
    getListData() {
      this.$http({
        method:'post',
        url:'/api/json/platformDeviceApi/getDeviceList',
        data:{
          projectId: this.projectId,
          sysType: this.deviceInfo.deviceType,
          pageNo: '1',
          pageSize: '1000',
        }
      })
        .then((res) => {
          this.deviceList = res.data.deviceList
        })
    },
    getChartData(params) {
      return this.$http({
        method: "post",
        url: "/api/json/ufoXcApi/getVehicleFlowStatistic",
        data: {
          cityCode: this.cityCode,
          projectId: this.projectId,
          statisticMode: params.statisticMode,
          statisticType: params.statisticType,
          startTime: moment().subtract(2,'years').format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
      })
    },
    dealData(arrObj) {
      let {arr1, arr2} = arrObj
      let inList = []
      let outList = []
      let labelList = []

      arr1.forEach(el => {
        inList.push(el.flowData)
        labelList.push(el.statisticDate)
      })

      arr2.forEach(el => {
        outList.push(el.flowData)
      })

      return {
        inList,
        outList,
        labelList,
      }
    },
    dealOutData(res) {
      let outArr = res.data.vechicleOut
      let out = 0
      outArr.forEach(el => {
        out += +el.flowData
      })
      return out
    },
    initChart(params) {
      var myChart = echarts.init(this.$refs[params.ref])
      var option = {
        color: ['#00B7FF', '#F37D2C'],
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
          data: params.legend,
        },
        grid: {
          top: '40',
          left: '0',
          right: '0',
          bottom: '0',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: params.data.labelList,
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
            name: params.legend[0].name,
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
            data: params.data.inList,
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
            name: params.legend[1].name,
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
            data: params.data.outList,
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
    initParChart(params) {
      let chart = echarts.init(this.$refs[params.ref])
      let option = {
        color: ['#F37D2C','#00B7FF' ],
        grid: {
          left: '0',
          right: '0',
          top: '0',
          bottom: '0',
          containLabel: true
        },
        // calculable: true,
        series: [{
            name: '车位数量',
            type: 'pie',
            radius: [40, 42],
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
            data: [
              { value: params.data.use, name: `占用车位 ${params.data.use}%` },
              { value: params.data.free, name: `空闲车位 ${params.data.free}%` }
            ]
          }
        ]
      }
      chart.clear()
      chart.setOption(option)
      //设置默认选中高亮部分
      chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: 0
      })
    },
  },
  watch: {
  }
}
</script>

<style lang="less" scoped>
.dialog-content {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  .left {
    padding: 20px 80px 0;
    width: 344px;
    box-sizing: content-box;
    .pieChart{
      width: 344px;
      height: 126px;
      position: relative;
      .rate{
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
            width: 10px;
            height: 1px;
            background: #00B7FF;
            position: absolute;
          }
          .line1{
            transform: rotate(-45deg);
            left: -38px;
            top: 41%;
            &.yell{
              transform: rotate(45deg);
              left: -36px;
              top: 82%;
              background: #F37D2C;
            }
          }
          .line2{
            top: 36%;
            left: -30px;
            width: 20px;
            &.yell{
              top: 87%;
              left: -29px;
              width: 26px;
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
      width: 344px;
      height: 120px;
    }

    .section{
      margin-bottom: 29px;
      .title-people{
        font-size: 14px;
        .yantramanav{
          font-size: 20px;
        }
        i {
          vertical-align: sub;
          display: inline-block;
          width: 18px;
          height: 18px;
          margin-right: 3px;
          background: url("~@assets/img/demo/icon-peo.png");
          background-size: 100% 100%;
        }
      }
      .body{
        position: relative;
        .chart-title{
          font-size: 12px;
          color:rgba(255,255,255,0.8);
        }
      }
    }
  }
  .center {
    display: flex;
    flex-direction: column;
    font-size: 12px;
    flex: 1;
    .title-people{
      font-size: 14px;
      margin-bottom: 17px;
      i {
        vertical-align: sub;
        display: inline-block;
        width: 18px;
        height: 18px;
        margin-right: 3px;
        background: url("~@assets/img/demo/icon-peo.png");
        background-size: 100% 100%;
      }
    }
    .section{
      display: flex;
      flex-wrap: wrap;

      .card{
        font-size: 12px;
        color:rgba(255,255,255,0.8);
        width: 400px;
        height: 352px;
        background:rgba(255,255,255,0.08);
        border-radius:2px;

        margin-bottom: 33px;
        margin-right: 32px;
        .card-title{
          font-size: 14px;
          height:39px;
          border-radius:1px 1px 0px 0px;
          background:rgba(255,255,255,0.02);

          text-align: center;
          line-height: 39px;

          position: relative;
          .top{
            cursor: pointer;
            height: 39px;
            line-height: 39px;
            position: absolute;
            right: 24px;
            top: 0;
            &.first{
              color:rgba(255,255,255,0.3);
            }
            i{
              vertical-align: middle;
              display: inline-block;
              width: 15px;
              height: 15px;
              margin-right: 3px;
              background: url("~@assets/img/demo/icon-peo.png");
              background-size: 100% 100%;
            }
            font-size: 12px;
          }
        }
        .card-content{
          padding: 8px 24px;
          .col{
            min-height: 18px;
            display: flex;
            margin-bottom:5px;
            .wrap-img{
              color:rgba(255,255,255,0.4);
              margin: 24px 12px 4px 0;
              .card-img{
                width: 352px;
                height: 180px;
              }
            }
            .col-item{
              flex: 1;
              margin-right: 16px;
              display: flex;
              .label{
                color:rgba(255,255,255,0.4);
                margin-right: 8px;
              }
              .val{
                color:rgba(255,255,255,0.8);
              }
              &.last{
                margin-right: 0;
              }
            }
          }
        }
      }
    }
  }
  .right {
    padding: 20px 28px 0 110px;
    width: 384px;
    box-sizing: content-box;
    .pieChart{
      width: 384px;
      height: 126px;
      position: relative;
      .rate{
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
            width: 10px;
            height: 1px;
            background: #00B7FF;
            position: absolute;
          }
          .line1{
            transform: rotate(-45deg);
            left: -38px;
            top: 41%;
            &.yell{
              transform: rotate(45deg);
              left: -36px;
              top: 82%;
              background: #F37D2C;
            }
          }
          .line2{
            top: 36%;
            left: -30px;
            width: 20px;
            &.yell{
              top: 87%;
              left: -29px;
              width: 26px;
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
      width: 384px;
      height: 120px;
    }

    .section{
      margin-bottom: 29px;
      .title-people{
        font-size: 14px;
        .yantramanav{
          font-size: 20px;
        }
        i {
          vertical-align: sub;
          display: inline-block;
          width: 18px;
          height: 18px;
          margin-right: 3px;
          background: url("~@assets/img/demo/icon-peo.png");
          background-size: 100% 100%;
        }
      }
      .money{
        margin: 16px 0;
      }
      .col{
        min-height: 18px;
        display: flex;
        margin-bottom:5px;
        .col-item{
          flex: 1;
          margin-right: 16px;
          display: flex;
          font-size: 12px;
          align-items: center;
          .label{
            color:rgba(255,255,255,0.8);
            margin-right: 8px;
          }
          .val{
            font-size: 20px;
            color:rgba(255,255,255,1);
            height: 30px;
            line-height: 1;
          }
          &.last{
            margin-right: 0;
          }
        }
      }

      .body{
        position: relative;
        .chart-title{
          font-size: 12px;
          color:rgba(255,255,255,0.8);
        }
        .table{
          margin-top: 18px;
          font-size: 14px;
          width: 100%;
          thead{
            tr{
              height: 24px;
              color:rgba(255,255,255,0.4);
              border-bottom: 1px solid rgba(255,255,255,0.16);
            }
          }
          tbody{
            tr{
              color:rgba(255,255,255,0.8);
              height: 48px;
            }
          }
        }
      }
    }
  }
  .sub-title {
    font-size: 14px;
    color: #fff;
  }

  .menu-tab {
    position: absolute;
    right: 0;
    top: 4px;
    display: flex;
    justify-content: flex-end;

    font-size: 12px;
    z-index: 9;
    span {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
    }
    .menu-item {
      cursor: pointer;
      display: flex;
      align-items: center;
      margin-left: 20px;
      &.active {
        span {
          position: relative;
          border: 1px solid rgba(0, 183, 255, 1);
          &::after {
            content: "";
            border-radius: 50%;
            display: inline-block;
            width: 8px;
            height: 8px;
            background: #00b7ff;
            margin: auto;

            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
    }
  }
}

.wrap-page {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
}
.page {
  margin-top: 12px;
  text-align: center;
  /deep/ .ivu-page-next,
  /deep/ .ivu-page-prev,
  /deep/ .ivu-page-item {
    background: transparent;
  }
}

// 小屏幕适配
@media screen and (max-height: 800px) {
 .dialog-content {
  .left {
    padding: 20px 40px;
  }
 }
}
</style>