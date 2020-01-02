<template>
  <div class="dialog-content">
    <div class="left">
      <div class="section">
        <div class="title-people">
          <i :class="deviceInfo.deviceType" />
          {{deviceInfo.deviceType == "lift" ? '今日电梯运行次数：' : '社区今日人流量：' }}
          <span class="yantramanav">{{sum}}</span>
        </div>

        <div v-if="deviceInfo.deviceType == 'lift'" class="pieChart">
          <div ref="pieChart1" id="pieChart1" class="pieChart"></div>
          <div class="rate">
            用梯人员分布
            <div class="label-line">
              <div>
                <span class="line line1" />
                <span class="line line2" />
                <div class="item">业主:
                  <span class="yantramanav">{{parDayData.owner}}</span>%
                  <span class="yantramanav">{{parDayData.numOwner}}</span>次
                </div>
              </div>

              <div>
                <span class="line line1 yell" />
                <span class="line line2 yell" />
                <div class="item">访客:
                  <span class="yantramanav">{{parDayData.visitor}}</span>%
                  <span class="yantramanav">{{parDayData.numVisitor}}</span>次
                </div>
              </div>

            </div>
          </div>
        </div>


      </div>

      <div class="section">
        <div class="title-people">
          <i class="pass" />
          人流统计
        </div>
        <div class="body">
          <div class="legend">
            <div class="legend-item"><span class="lable1"></span>业主</div>
            <div class="legend-item"><span class="lable2"></span>访客</div>
          </div>
          <!-- 当日 -->
          <div class="chart-title">今天</div>
          <div class="lineChart"
            ref="lineChart1" />
          <div class="pieChart" v-if="deviceInfo.deviceType != 'lift'">
            <div ref="pieChart1" id="pieChart1" class="pieChart"></div>
            <div class="rate">
              {{deviceInfo.deviceType == "lift" ? '人员分布' : '人流分布' }}
              <div class="label-line">
                <div>
                  <span class="line line1" />
                  <span class="line line2" />
                  <div class="item">业主:<span class="yantramanav">{{parDayData.owner}}%</span></div>
                </div>

                <div>
                  <span class="line line1 yell" />
                  <span class="line line2 yell" />
                  <div class="item">访客:<span class="yantramanav">{{parDayData.visitor}}%</span></div>
                </div>

              </div>
            </div>
          </div>
          <!-- 15天 -->
          <div class="chart-title" :class="deviceInfo.deviceType">最近 15 天</div>
          <div class="lineChart"
            ref="lineChart2" />
          <div class="pieChart" v-if="deviceInfo.deviceType != 'lift'">
            <div ref="pieChart2" id="pieChart2" class="pieChart"></div>
            <div class="rate">
              {{deviceInfo.deviceType == "lift" ? '人员分布' : '人流分布' }}
              <div class="label-line">
                <div>
                  <span class="line line1" />
                  <span class="line line2" />
                  <div class="item">业主:<span class="yantramanav">{{parDaysData.owner}}%</span></div>
                </div>

                <div>
                  <span class="line line1 yell" />
                  <span class="line line2 yell" />
                  <div class="item">访客:<span class="yantramanav">{{parDaysData.visitor}}%</span></div>
                </div>

              </div>
            </div>
          </div>
          <!-- 12个月 -->
          <div class="chart-title" :class="deviceInfo.deviceType">最近 12 个月</div>
          <div class="lineChart"
            ref="lineChart3" />
          <div class="pieChart" v-if="deviceInfo.deviceType != 'lift'">
            <div ref="pieChart3" id="pieChart3" class="pieChart"></div>
            <div class="rate">
              {{deviceInfo.deviceType == "lift" ? '人员分布' : '人流分布' }}
              <div class="label-line">
                <div>
                  <span class="line line1" />
                  <span class="line line2" />
                  <div class="item">业主:<span class="yantramanav">{{parMonthsData.owner}}%</span></div>
                </div>

                <div>
                  <span class="line line1 yell" />
                  <span class="line line2 yell" />
                  <div class="item">访客:<span class="yantramanav">{{parMonthsData.visitor}}%</span></div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="right">
      <div class="title-people">
        <i class="now"/>
        {{deviceInfo.deviceType == "lift" ? '实时用梯' : '实时通行信息' }}
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
          <div class="card-title" :class="[{'offline': it.deviceStatus === '0'}]" >
              {{it.deviceProperties.location | parseLocation}}
            <div class="top" :class="[{'first': idx == 0}]" @click="toTop(it, idx)"><i />置顶</div>
          </div>
          <div class="card-content offline" v-if="it.deviceStatus === '0'" >
            <img class="offline-img"
              src="~@assets/img/demo/community/device-icon/offline.png" />
            <div class="offline-txt">设备离线</div>
          </div>
          <div class="card-content" v-else>
            <div class="col" v-if="it.logInfo">{{it.logInfo.recordTime}}</div>
            <div class="col" v-if="it.logInfo">
              <div class="col-item">{{it.logInfo.userName}}</div>
              <div class="col-item">
                {{it.logInfo.userType}}
                <template v-if="it.logInfo.unitName || it.logInfo.roomName">
                  ({{it.logInfo.unitName}}
                  {{it.logInfo.roomName}})
                </template>
              </div>
              <div class="col-item last">
                {{it.logInfo.passType}}
                <template v-if="it.logInfo.cardNo">
                  ({{it.logInfo.cardNo}})
                </template>

              </div>
            </div>
            <div class="col">
              <div class="wrap-img">
                <img v-if="it.url1" class="card-img"
                  :src="it.url" />
                <div v-else class="wrap-card-img">
                  <img  class="card-img"
                  src="~@assets/img/demo/community/default.png" />
                </div>
                <div>登记照片</div>
              </div>
              <div class="wrap-img">
                <img v-if="it.url" class="card-img"
                  :src="it.url2"  />
                <div v-else class="wrap-card-img">
                  <img  class="card-img"
                  src="~@assets/img/demo/community/default.png" />
                </div>

                <div>抓拍</div>
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
import { mapState, mapGetters, mapMutations } from 'vuex'
import { websocket } from '../../../mixins/websocket'

export default {
  mixins: [websocket],
  data() {
    return {
      sum: '', // 今日人流量
      // pie
      parDayData: {
        owner: '0.0',
        visitor: '0.0',
        numOwner:'0',
        numVisitor: '0',
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
    }
  },
  computed: {
    ...mapState(['deviceInfo', 'rank']),
    ...mapGetters(['projectId']),
  },
  mounted() {
    if(this.deviceInfo.deviceType !== 'lift') {
      this.init()
    } else {
      let dataObj = {
        ownerList: [],
        visitorList: [],
        labelList: [],
        sumOwner: 0,
        sumVisitor: 0,
      }
      this.initChart({
        ref: 'lineChart1',
        data: dataObj
      })
      this.initChart({
        ref: 'lineChart2',
        data: dataObj
      })
      this.initChart({
        ref: 'lineChart3',
        data: dataObj
      })
    }
    this.getListData()
  },
  methods: {
    ...mapMutations(['hide']),
    getLogType() {
      let type = ''
      let deviceType = this.deviceInfo.deviceType
      // 事件记录
      if(deviceType == 'lockergateway') {
        // 门锁网关
        type = 'qdh_gy_locker_locker_gateway_status'
      } else if(deviceType =="locker") {
        // 门锁
        type = 'qdh_gy_locker_locker_status'
      } else if(deviceType == 'elec') { 
        // 电表
        type = 'gy_sys_elec_status'
      } else if (deviceType == 'water' || deviceType == 'hotwater') {
        // 水表
        type = 'gy_sys_water_status'
      } else if(deviceType == 'gateway') {
        // 水电表网关
        type = 'gy_sys_gateway_status'
      } else if(deviceType == 'lift') {
        // 电梯
        type = ''
      } else if(deviceType == 'monitor') {
        // 监控
        type = ''
      }  else {
        // 对讲机
        type = 'cloud_talk_unlock_record,qdmgr_local3_unlock_record'
      }
      return type
    },
    init() {
      // 当天
      this.getChartData({
        type: 'hour',
        startTime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      })
        .then((res) => {
          let dataObj = this.dealData(res)
          let parData = { owner: '0.0',visitor: '0.0' }
          this.sum = dataObj.sumOwner + dataObj.sumVisitor

          if(this.sum) {
            parData.owner = (dataObj.sumOwner / this.sum *100).toFixed(1)
            parData.visitor = (dataObj.sumVisitor / this.sum *100).toFixed(1)
            parData.numOwner = dataObj.sumOwner
            parData.numVisitor = dataObj.sumVisitor 
          }
          this.parDayData = parData
          this.initChart({
            ref: 'lineChart1',
            data: dataObj
          })
          this.initParChart({
            ref: 'pieChart1',
            data: parData,
          })
        })

      // 15 天数据
      this.getChartData({
        type: 'day',
        startTime: moment().subtract(15,'days').format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      })
        .then((res) => {
          let dataObj = this.dealData(res)
          let parData = { owner: '0.0',visitor: '0.0' }
          let sum = dataObj.sumOwner + dataObj.sumVisitor
          if(sum) {
            parData.owner = (dataObj.sumOwner / sum*100).toFixed(1)
            parData.visitor = (dataObj.sumVisitor / sum*100).toFixed(1)
          }
          this.parDaysData = parData
          this.initChart({
            ref: 'lineChart2',
            data: dataObj
          })

          if(this.deviceInfo.deviceType != 'lift') {
            this.initParChart({
              ref: 'pieChart2',
              data: parData,
            })
          }
        })

      // 12 月数据
      this.getChartData({
        type: 'month',
        startTime: moment().subtract(12,'months').format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      })
        .then((res) => {
          let dataObj = this.dealData(res)
          let parData = { owner: '0.0',visitor: '0.0' }
          let sum = dataObj.sumOwner + dataObj.sumVisitor
          if(sum) {
            parData.owner = (dataObj.sumOwner / sum*100).toFixed(1)
            parData.visitor = (dataObj.sumVisitor / sum*100).toFixed(1)
          }
          this.parMonthsData = parData
          this.initChart({
            ref: 'lineChart3',
            data: dataObj
          })
          if(this.deviceInfo.deviceType != 'lift') {
            this.initParChart({
              ref: 'pieChart3',
              data: parData,
            })
          }
        })
    },
    toTop(it, idx) {
      if(idx == 0) return 
      this.$http({
        method:'post',
        url:'/api/json/platformDeviceApi/setTopDevice',
        data:{
          projectId: this.projectId,
          sysType: it.deviceProperties.type,
          deviceId: it.id,
          topDevice: '1',
        }
      })
        .then((res) => {
          this.$message({
            message: '置顶成功',
            type: res || 'success'
          })
          this.getListData()
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
          if(this.deviceList &&  this.deviceList.length > 0) {
             let snsArr = this.deviceList.map(el => {
              return el.deviceSn
            })
            this.socketSend(snsArr)
          }
        })
    },
    getChartData(params) {
      return this.$http({
        method:'post',
        url:'/api/json/ufoXcApi/getPassingStatistic',
        data:{
          cityCode: this.cityCode,
          projectId: this.projectId,
          statisticType: params.type,
          deviceType: this.deviceInfo.deviceType,
          startTime: params.startTime,
          endTime: params.endTime,
        }
      })
    },
    dealData(res) {
      let arrOwner = res.data.owner
      let arrVisitor = res.data.visitor

      let ownerList = []
      let visitorList = []
      let labelList = []
      let sumOwner = 0
      let sumVisitor = 0
      arrOwner.forEach(el => {
        ownerList.push(el.passingData)
        labelList.push(el.statisticDate)
        sumOwner += +el.passingData
      })
 
      arrVisitor.forEach(el => {
        visitorList.push(el.passingData)
        sumVisitor += +el.passingData 
      }) 

      return {
        ownerList,
        visitorList,
        labelList,
        sumOwner,
        sumVisitor,
      }
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
          show: false,
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
          top: '8',
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
            data: params.data.ownerList,
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
            data: params.data.visitorList,
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
            name: this.deviceInfo.deviceType == "lift" ? '人员分布' : '人流分布',
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
              { value: params.data.owner, name: `业主 ${params.data.owner}%` },
              { value: params.data.visitor, name: `访客 ${params.data.visitor}%` }
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

    // websocket send msg
    socketSend(snsArr) {
      console.log('socketSend')
      let params = {
        index: this.getLogType()
      }
      if(Array.isArray(snsArr)) {
        params.sns = snsArr.join()
      } else {
        params.sns = ''
      }
      // let params = {"index":"gy_sys_elec_data","sns":"AB019032500022"}
      console.log(params)
      this.sendSocketMsg(params)
      
    },
    socketReceive(evt) {
      console.log('-----------socketReceive')
      let data = JSON.parse(evt.data)
      console.log(data)
      this.deviceList = this.deviceList.map(el => {
         data.forEach(it => {
          if(it.sn && el.deviceSn == it.sn) {
            el = Object.assign({}, el, {logInfo: it})
          }
        })
        return el
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
  overflow: hidden !important;
  .left {
    padding: 20px 80px 0 118px;
    width: 344px;
    box-sizing: content-box;
    .pieChart{
      width: 344px;
      height: 126px;
      position: relative;
      .rate{
        padding: 0 12px;
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
          &.pass{
            background: url("~@assets/img/demo/pass.png");
            background-size: 100% 100%;
          }
          &.now{
            background: url("~@assets/img/demo/now.png");
            background-size: 100% 100%;
          }
          &.lift{
            background: url("~@assets/img/demo/lift.png");
            background-size: 100% 100%;
          }
        }
      }
      .body{
        .legend{
          display: flex;
          margin-top: 6px;
          margin-bottom: 20px;
          .legend-item{
            margin-right: 16px;
            font-size: 12px;
            color:rgba(255,255,255,0.8);
            span{
              display: inline-block;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              margin-right:5px;
            }
            .lable1{
              background: #00B7FF;
            }
            .lable2{
              background: #F37D2C;
            }
          }
        }

        .chart-title{
          font-size: 12px;
          color:rgba(255,255,255,0.8);
          &.lift{
            margin-top: 60px;
          }
        }
      }
    }
  }
  .right {
    display: flex;
    flex-direction: column;
    font-size: 12px;
    padding: 0 0 0 24px;
    flex: 1;
    overflow: auto;

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
        &.now{
          background: url("~@assets/img/demo/now.png");
          background-size: 100% 100%;
        }
      }
    }
    .section{
      display: flex;
      flex-wrap: wrap;

      .card{
        font-size: 12px;
        color:rgba(255,255,255,0.8);
        width: 400px;
        height: 252px;
        // background:rgba(255,255,255,0.08);
        background:#142532;
        border-radius:2px;

        margin-bottom: 33px;
        margin-right: 32px;
        .card-title{
          min-height: 38px;
          font-size: 14px;
          border-radius:1px 1px 0px 0px;
          padding: 9px 70px;

          // background:rgba(255,255,255,0.02);
          background:#182c3a;

          text-align: center;
          position: relative;
          &.offline{
            color: #F37D2C;
          }
          .top{
            color:rgba(255,255,255,0.8);
            cursor: pointer;
            height: 39px;
            line-height: 39px;
            position: absolute;
            right: 24px;
            top: 0;
            &.first{
              opacity: 0.3;
            }
            i{
              vertical-align: middle;
              display: inline-block;
              width: 15px;
              height: 15px;
              margin-right: 3px;
              background: url("~@assets/img/demo/top.png");
              background-size: 100% 100%;
            }
            font-size: 12px;
          }
        }
        .card-content{
          &.offline{
            text-align: center;
          }
          padding: 8px 24px;
          .col{
            display: flex;
            margin-bottom:5px;
            .wrap-img{
              color:rgba(255,255,255,0.4);
              margin-right:12px;
              margin-bottom: 4px;
              .card-img{
                width: 100px;
                height: 120px;
              }
              .wrap-card-img{
                width: 100px;
                height: 120px;
                display: flex;
                align-items: center;
                justify-content: center;

                background:rgba(255,255,255,0.04);
                .card-img{
                  width: 100px;
                  height: 120px;
                }
              }
            }
            .col-item{
              margin-right: 16px;
              &.last{
                margin-right: 0;
              }
            }
          }
          .offline-img{
            width: 78px;
            margin: 62px auto 14px;
          }
          .offline-txt{
            color:rgba(243,125,44,0.5);
            text-align: center;
          }
        }
      }
    }
  }

  .sub-title {
    font-size: 14px;
    color: #fff;
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