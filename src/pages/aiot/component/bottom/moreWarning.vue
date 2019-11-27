<template>
  <div class="qdDialog flex-center" @click.self="hide" v-show="showMoreWarning">
    <div class="dialog-main">
      <div class="dialog-title">
        <div class="name">告警</div>
        <div class="close" @click.stop="hide" />
      </div>
      <div class="dialog-content">
        <div class="left">
          <div><i class="icon" /> 今日各类型告警</div>
          <div class="barChart">
            <div class="content">
              <div class="wrap-bar" v-for="(it, idx) in list" :key="idx">
                <div 
                  :class="['bar', 'bar'+ (idx+1)]" 
                  :style="{height: (+it.alarmCount/max.alarmCount * 180) + 'px'}">
                </div>
                <div class="bar-label" v-html="it.alarmName"></div>
              </div>
            </div>
            <div class="line"></div>
          </div>

          <div><i class="icon" /> 近期各类型告警</div>

          <div class="lineChart" ref="lineChart" />
        </div>
        <div class="right">
          <div class="sub-title"><i class="icon" /> 告警记录</div>
          <div class="wrap-head">
            <div class="table-head">
              <div class="time">时间</div>
              <div class="type">设备类型</div>
              <div class="type">告警类型</div>
              <div class="location">位置</div>
              <div class="status">状态</div>
            </div>
            <div class="info-block"></div>
          </div>

          <div class="record-list">
            <div class="table-list">
              <div v-for="(it,idx) in listRecord" :key="idx" @click="changeCurrentItem(it,idx)" :class="[{'active': idx == currentIdx}, 'col-table']">
                <div class="time">{{it.alarmTime | formatTime2}}</div>
                <div class="type">{{it.deviceType}}</div>
                <div class="type">{{it.alarmType}}</div>
                <div class="location">{{it.location}}</div>
                <div class="status">{{it.dealStatus | dealStatus}}</div>
              </div>
            </div>

            <div class="info">
              <div class="item">
                <div>设备类型</div>
                <div>{{currentItem.deviceType}}</div>
              </div>
              <div class="item">
                <div>设备状态</div>
                <div>{{currentItem.deviceStatus}}</div>
              </div>
              <div class="item">
                <div>告警类型</div>
                <div>{{currentItem.alarmType}}</div>
              </div>
              <div class="item">
                <div>时间</div>
                <div>{{currentItem.alarmTime | formatTime2}}</div>
              </div>
              <div class="item">
                <div>位置</div>
                <div>{{currentItem.location}}</div>
              </div>
              <div class="btns">
                 <button class="cancel" @click.stop="confirm(currentItem.id, '0')">忽略</button>
                 <button class="confirm" @click.stop="confirm(currentItem.id, '1')">报事</button>
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
import { mapState, mapGetters, mapMutations} from 'vuex'

export default {
  data() {
    return {
      list: [], // 柱状图
      max: '', // 柱状图最大值

      lableList: [], // x轴 lable
      dataArr: [], // line 数组

      listRecord: [], // 重点关注通行记录
      currentItem: {}, // 当前选择记录
      currentIdx: 0,
    }
  },
  computed: {
    ...mapState(['showMoreWarning', 'rank']),
    ...mapGetters(['projectId']),
  },
  mounted() {
  },
  methods: {
    ...mapMutations(['hide']),
    initChart() {
      var myChart = echarts.init(this.$refs.lineChart)
      let series = this.getSeries()

      var option = {
        color: ['#00DCFF', '#13E38D', '#F37D2C', '#FF4949', '#FF004F'],
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: '20',
          left: '0',
          right: '0',
          bottom: '32',
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
      myChart.setOption(option)
    },
    getData() {
      this.$http({
        method:'post',
        url:'/api/json/ufoXcApi/getDeviceAlarmStatisticCurrentDay',
        data:{
          projectId: this.projectId
        }
      })
        .then((res) => {
          // let lableNameList = ['用水量<br/>过高', '用电量<br/>过高', '设备<br/>离线','设备<br/>故障']
          this.list = res.data.deviceAlarmStatistic
          this.max = this.list.reduce((pre, next) => {
            return pre = pre.alarmCount > next.alarmCount  ? pre : next
          })
        })
    },
    getListData() {
      this.$http({
        method:'post',
        url:'/api/json/ufoXcApi/getAlarmMonitorRecord',
        data:{
          projectId: this.projectId
        }
      })
        .then((res) => {
          if(res.data.ufoDeviceAlarmRecordList && res.data.ufoDeviceAlarmRecordList.length > 0) {
            this.listRecord = res.data.ufoDeviceAlarmRecordList
            this.currentItem = this.listRecord[this.currentIdx]
          }
        })
    },
    getMonthData() {
     this.$http({
        method:'post',
        url:'/api/json/ufoXcApi/geDeviceAlarmStatisticMonth',
        data:{
          projectId: this.projectId
        }
      })
        .then((res) => {
          this.dealData(res)
          this.initChart()
        })
    },
    dealData(res) {
      this.dataArr = []
      res.data.deviceAlarmStatistic.forEach((el) => {
        let arr = el.alarmStatistic
        let arrList = []
        let labelList = []

        arr.forEach(el => {
          arrList.push(el.count)
          labelList.push(el.time)
        })
        this.dataArr.push(arrList)
        this.labelList = labelList
      })
    },
    getSeries() {
      let series = []
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
        }
      ]

      this.dataArr.forEach((el, idx) => {
        let serie =  {
          name: '',
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
          data: el,
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
      })
      return series
    },
    confirm(id, flag) {
      this.$http({
        method:'post',
        url:'/api/json/ufoXcApi/confirmAlarmInfo',
        data:{
          id: id,
          flag: flag
        }
      })
        .then(() => {
          this.getListData()
        })
    },
    changeCurrentItem(item, idx) {
      this.currentItem = item
      this.currentIdx = idx
    }
  },
  watch: {
    showMoreWarning(val) {
      if(val){
        this.getData()
        this.getMonthData()
        this.getListData()
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
    .dialog-title{
      background: #273641;
      .name{
        font-size:20px;
        font-weight:600;
        text-align: center;
        padding: 17px 0;
      }
      .close{
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
        .barChart{
          padding-right:24px;
          margin:0 10px 54px;
          height: 240px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          .content{
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            .wrap-bar{
              position: relative;
              .bar{
                width:20px;
                height:93px;
                &.bar1{
                  background:linear-gradient(180deg,rgba(0,183,255,0.12) 0%,rgba(0,183,255,0) 100%);
                  border-radius:2px 2px 0px 0px;
                  border:1px solid;
                  border-image:linear-gradient(180deg, rgba(0,220,255,1), rgba(0,183,255,0)) 1 1;
                }
                &.bar2{
                  height: 180px;
                  background:linear-gradient(180deg,rgba(19,227,141,0.12) 0%,rgba(19,227,141,0) 100%);
                  border-radius:2px 2px 0px 0px;
                  border:1px solid;
                  border-image:linear-gradient(180deg, rgba(19,227,141,1), rgba(19,227,141,0)) 1 1;
                }
                &.bar3{
                  background:linear-gradient(180deg,rgba(243,125,44,0.12) 0%,rgba(243,125,44,0) 100%);
                  border-radius:2px 2px 0px 0px;
                  border:1px solid;
                  border-image:linear-gradient(180deg, rgba(243,125,44,1), rgba(243,125,44,0)) 1 1;
                }
                &.bar4{
                  background:linear-gradient(180deg,rgba(255,70,70,0.12) 0%,rgba(255,70,70,0) 100%);
                  border-radius:2px 2px 0px 0px;
                  border:1px solid;
                  border-image:linear-gradient(180deg, rgba(255,70,70,1), rgba(255,70,70,0)) 1 1;
                }
                &.bar5{
                  background:linear-gradient(180deg,rgba(255,0,79,0.12) 0%,rgba(255,0,79,0) 100%);
                  border-radius:2px 2px 0px 0px;
                  border:1px solid;
                  border-image:linear-gradient(180deg, rgba(255,0,79,1), rgba(255,0,79,0)) 1 1;
                }
              }

              .bar-label{
                text-align: center;
                white-space: nowrap;
                color:rgba(255,255,255,0.4);
                position:absolute;
                bottom: -46px;
                left:50%;
                transform: translateX(-50%);
              }
            }
          }
          .line{
            margin-bottom: 54px;
            width:272px;
            height:1px;
            background:linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.16) 26%,rgba(255,255,255,0.16) 74%,rgba(255,255,255,0) 100%);
          }
        }
        .lineChart {
          width: 272px;
          height: 240px;
        }
      }
      .right{
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
            .sn{
              text-align: center;
              .head-img{
                width: 144px;
                height: 190px;
              }
              margin-bottom: 12px;
            }
            .item{
              height: 28px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid rgba(255,255,255,0.16);
            }
            .btns{
              display: flex;
              align-items: center;
              justify-content: flex-end;
              margin-top:28px;
              .cancel{
                outline:none;
                width: 56px;
                height: 28px;
                border-radius:2px;
                border:1px solid rgba(255,255,255,0.4);
                color:rgba(255,255,255,0.8);
                background: transparent;
                margin-right: 16px;
              }
              .confirm{
                outline:none;
                border: none;
                width: 56px;
                height: 28px;

                background:#FF4646;
                color: #fff;
                box-shadow:0px 0px 12px 0px rgba(255,70,70,0.4);
                border-radius:2px;
                border:1px solid rgba(255,70,70,1);
              }
            }
          }
        }
        .name{
          width: 45px;
        }
        .phone{
          width: 90px;
        }
        .mark{
          width: 60px;
        }
        .location{
          width: 120px;
        }
        .type{
          width: 100px;
        }
        .time{
          width: 100px;
        }
        .status{
          width: 45px;
        }
      }
    }
  }
}
</style>