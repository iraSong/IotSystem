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
              <div class="wrap-bar" v-for="(it, idx) in list" :key="idx + '-1'">
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
          <div class="sub-title">
            <div class="title">告警记录</div>
            <div class="config" @click="showConfig"><i class="icon" /> 告警信息配置</div>
          </div>
          <div class="wrap-head">
            <div class="table-head">
              <div class="time">时间</div>
              <div class="type">设备类型</div>
              <div class="type">告警类型</div>
              <div class="type">紧急程度</div>
              <div class="location">位置</div>
              <div class="status">状态</div>
            </div>
            <div class="info-block"></div>
          </div>

          <div class="record-list">
            <div class="table-list">
              <div v-for="(it,idx) in listRecord" :key="idx + '-2'" @click="changeCurrentItem(it,idx)" :class="[{'active': idx == currentIdx}, 'col-table']">
                <div class="time">{{it.alarmTime | formatTime2}}</div>
                <div class="type">{{it.deviceType | typeToName}}</div>
                <div class="type">{{it.alarmLvl | waringRank}}</div>
                <div class="type">{{it.alarmType}}</div>
                <div class="location" :title="it.location">{{it.location}}</div>
                <div class="status">{{it.dealStatus | dealStatus}}</div>
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
              <div class="item">
                <div>设备类型</div>
                <div>{{currentItem.deviceType | typeToName}}</div>
              </div>
              <div class="item">
                <div>状态</div>
                <div>{{currentItem.dealStatus | dealStatus}}</div>
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
              <div class="btns" v-if="currentItem.dealStatus === 'undeal'">
                 <button class="cancel" @click.stop="confirm(currentItem.id, '0')">忽略</button>
                 <button class="confirm" @click.stop="showConfirm = true">报事</button>
                 <div class="confirmDialog qd-le" v-if="showConfirm">
                  <div class="panel-arrow"></div>
                  <div class="title">报事</div>

                  <div class="item-form">
                    <div class="label">原因类型</div>
                    <el-cascader
                      popper-class="qd-cascader"
                      :options="options"
                      :props="props"
                      v-model="selectedOptions"
                      @change="handleChange">
                    </el-cascader>
                  </div>

                  <div class="item-form">
                    <div class="label">报事叙述</div>
                    <textarea rows="3"  v-model="remark" placeholder="" />
                  </div>

                  <div class="footer">
                    <button class="cancel footer" @click="showConfirm = false">取消</button>
                    <button class="confirm" @click="confirm(currentItem.id, '1')">提交</button>
                  </div>
                 </div>

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

      list: [], // 柱状图
      max: '', // 柱状图最大值

      lableList: [], // x轴 lable
      dataArr: [], // line 数组

      listRecord: [], // 重点关注通行记录
      currentItem: {}, // 当前选择记录
      currentIdx: 0,

      showConfirm: false, // 报事确认框
      options: [],
      props: {
        label: 'text',
        value: 'id',
      },
      remark: '',
      selectedOptions: [],
    }
  },
  computed: {
    ...mapState(['showMoreWarning', 'rank']),
    ...mapGetters(['projectId']),
  },
  mounted() {
  },
  methods: {
    ...mapMutations(['hide', 'toggleWarningConfig']),
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
      myChart.clear()
      myChart.setOption(option)
    },
    getData() {
      this.$http({
        method:'post',
        url:'/api/json/ufoXcApi/getDeviceAlarmStatisticCurrentDay',
        data:{
          projectId: this.projectId,
          startTime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        }
      })
        .then((res) => {
          // let lableNameList = ['用水量<br/>过高', '用电量<br/>过高', '设备<br/>离线','设备<br/>故障']
          this.list = res.data.deviceAlarmStatistic || []
          if(this.list.length > 0) {
            this.max = this.list.reduce((pre, next) => {
              return pre = pre.alarmCount > next.alarmCount  ? pre : next
            })
          }
        })
    },
    getListData() {
      this.$http({
        method:'post',
        url:'/api/json/ufoXcApi/getAlarmMonitorRecord',
        data:{
          projectId: this.projectId,
          startTime: moment().subtract(2,'years').format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
      })
        .then((res) => {
          if(res.data.ufoDeviceAlarmRecordList && res.data.ufoDeviceAlarmRecordList.length > 0) {
            this.listRecord = res.data.ufoDeviceAlarmRecordList
            this.currentItem = this.listRecord[this.currentIdx]
          } else {
            this.listRecord = []
            this.currentItem = []
          }
        })
    },
    getMonthData() {
     this.$http({
        method:'post',
        url:'/api/json/ufoXcApi/geDeviceAlarmStatisticMonth',
        data:{
          projectId: this.projectId,
          startTime: moment().subtract(1,'months').format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
      })
        .then((res) => {
          this.dealData(res)
          this.initChart()
        })
    },
    getOrderType() {
      this.$http({
        method:'post',
        url:'/api/json/workOrderApi/getOrderType',
        data:{
          projectId: this.projectId
        }
      })
        .then((res) => {
          // 递归 处理 children = []
          this.dealOption(res.data.list)
          this.options = res.data.list
          console.log(this.options)
        })
    },
    dealOption(list) {
      return list = list.map((el) => {
        if(!el.children || el.children.length === 0) {
          delete el.children
        } else {
          this.dealOption(el.children)
        }
        return el
      })
    },
    dealData(res) {
      this.dataArr = []
      this.labelList = []

      if(res.data.deviceAlarmStatistic && res.data.deviceAlarmStatistic.length > 0) {
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
      }
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
      console.log(id)
      this.$http({
        method:'post',
        url:'/api/json/ufoXcApi/confirmAlarmInfo',
        data:{
          projectId: this.projectId,
          id: id,
          flag: flag,
          remark: this.remark,
          orderType: this.selectedOptions[0],
          orderTypeDetail: this.selectedOptions[1],

          orderLvl: 'low',
          deviceType: this.currentItem.deviceType,
        }
      })
        .then(() => {
          this.showConfirm = false
          this.getListData()
        })
    },
    changeCurrentItem(item, idx) {
      this.currentItem = item
      this.currentIdx = idx
    },
    pageNoChange(pageNo) {
      this.getListData(pageNo)
    },
    showConfig() {
      this.toggleWarningConfig()
    },
    handleChange() {}
  },
  watch: {
    showMoreWarning(val) {
      if(val){
        this.getData()
        this.getMonthData()
        this.getListData()
        this.getOrderType()
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
    width: 1196px;
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
      font-size: 14px;
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
        display: flex;
        flex-direction: column;

        font-size:12px;
        padding: 24px 0 0 24px;
        flex:1;
        .sub-title{
          margin-right: 24px;
          font-size: 14px;
          display: flex;
          justify-content: space-between;
          .config{
            cursor: pointer;
            display: flex;
            align-items: center;
            i{
              display: inline-block;
              width: 15px;
              height: 15px;
              margin-right: 3px;
              background: url('~@assets/img/demo/config.png');
              background-size: 100% 100%;
            }
            color: #00B7FF;
          }
        }
        .wrap-head{
          width: 828px;
          border-bottom: 1px solid rgba(255,255,255,0.16);
          display: flex;

          margin-right: 24px;
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
              position: relative;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              margin-top:28px;
              .cancel{
                cursor: pointer;
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
                cursor: pointer;
                outline:none;
                border: none;
                width: 56px;
                height: 28px;

                background:#FF4646;
                color: #fff;
                border-radius:2px;
              }
              .confirmDialog{
                position: absolute;
                right: -16px;
                bottom: 35px;
                background: #3b4a55;
                z-index: 9999;

                width: 574px;
                height: 262px;

                padding: 12px 24px;
                font-size:14px;
                .title{
                  line-height: 24px;
                  color:rgba(255,255,255,1);
                  text-align: center;
                  margin-bottom: 8px;
                }
                .panel-arrow{
                  width: 0;
                  height: 0;
                  border-width: 8px;
                  border-style: solid;
                  border-color: #3b4a55 transparent transparent transparent;
                  position: absolute;
                  bottom: -15px;
                  right: 6%;
                  transform: translate(-50%, 0);
                  z-index: 1;
                }
                .item-form{
                  display: flex;
                  justify-content: left;
                  margin-bottom: 18px;
                  .label{
                    font-size: 14px;
                    width:90px;
                    padding-right:16px;
                    text-align: right;
                    color:rgba(255,255,255,0.6);
                    line-height: 40px;
                  }
                  input, textarea{
                    flex: 1;
                    padding-left: 8px;
                    font-size:14px;
                    border:none;
                    outline: none;
                    height:32px;
                    background:rgba(255,255,255,0.04);
                    border-radius:2px;
                    border:1px solid rgba(255,255,255,0.08);
                    color:rgba(255,255,255,1);
                  }
                  textarea{
                    height: 80px;
                    color:rgba(255,255,255,1);
                    border-radius:2px;
                    border:1px solid rgba(255,255,255,0.08);
                  }
                }

                .cancel, .confirm{
                  cursor: pointer;
                  width: 56px;
                  height: 28px;
                }
                .footer{
                  position: relative;
                  height: 55px;
                  display: flex;
                  align-items: center;
                  justify-content: flex-end;
                  padding-right:16px;
                  font-size: 14px;
                  .cancel{
                    outline:none;
                    border-radius:2px;
                    border:1px solid rgba(255,255,255,0.4);
                    color:rgba(255,255,255,0.8);
                    background: transparent;
                    margin-right: 16px;
                    &.footer{
                      width: 56px;
                      height: 28px;
                    }
                  }
                  .confirm{
                    outline:none;
                    border: none;
                    color:rgba(255,255,255,1);
                    background:#00B7FF;
                    border-radius:2px;
                    &[disabled] {
                      color:rgba(255,255,255,.6);
                      background: #419dc1;
                    }
                  }
                }
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

</style>