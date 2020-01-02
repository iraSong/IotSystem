<template>
  <div class="dialog-content">
    <div class="left">
      <!-- 设备饼图 -->
      <div class="section">
        <div class="title-people">
          <i />
          {{deviceInfo.deviceType == "lift" ? '电梯台数' : '设备总数：' }}
          <span class="yantramanav">{{deviceInfo.total}}</span>
        </div>
        <div class="body">
          <div>
            <div class="pieFault">
              <div class="rate flex-center">
                <div>在线</div>
                <div class="num yantramanav">{{ perOnLine }}%</div>
              </div>
              <div ref="pieOnline"
                class="chart"></div>
            </div>
            <div class="value">{{deviceInfo.onLine}}</div>
          </div>

          <div>
            <div class="offLine">
              <div class="rate flex-center">
                <div>离线</div>
                <div class="num yantramanav">{{ perOffLine }}%</div>
              </div>
              <div ref="pieOffline"
                class="chart"></div>
            </div>
            <div class="value">{{deviceInfo.offLine}}</div>
          </div>

          <div>
            <div class="over">
              <div class="rate flex-center">
                <div>故障</div>
                <div class="num yantramanav">{{ perFault }}%</div>
              </div>
              <div ref="pieFault"
                class="chart"></div>
            </div>
            <div class="value">{{deviceInfo.fault}}</div>
          </div>

        </div>
      </div>
      <!-- 设备线图 -->
      <div class="section">
        <div class="legend">
          <div class="legend-item"><span class="lable1"></span>离线率</div>
          <div class="legend-item"><span class="lable2"></span>故障率</div>
        </div>
        <!-- 当日 -->
        <div class="chart-title"></div>
        <div class="lineChart"
          ref="lineChart1" />
        <!-- 12个月 -->
        <div class="chart-title"></div>
        <div class="lineChart lineChart2"
          ref="lineChart2" />
      </div>
    </div>

    <div class="right">
      <!-- 设备列表 -->
      <div class="title-people">
        <i />设备列表
      </div>
      <div class="section">
        <div class="filter">

          
          <div v-if="deviceInfo.deviceType == 'lift'" class="filter-item lock-password">
            <div class="label">所属楼栋</div>
            <el-cascader
              :clearable="true"
              size="small"
              popper-class="qd-cascader"
              :props="props"
              v-model="location"
              @change="getList">
            </el-cascader>
          </div>
          <div v-else class="filter-item lock-password">
            <div class="label">设备状态</div>
            <el-select 
               v-model="deviceStatus"
               @change="getList('1')"
               clearable 
               placeholder=""
               popper-class="pwdType">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
               >
              </el-option>
            </el-select>
          </div>
          <!-- <button class="search" @click="getList">搜索</button> -->
        </div>

        <div class="list">
          <!--列表内容-->
          <div class="list-content">
            <div class="list-table">
              <table class="table">
                <thead>
                  <tr>
                    <th>设备编号</th>
                    <th>位置</th>
                    <th>设备状态</th>
                    <th>对应工单处理状态</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(it, idx) in deviceList"
                  :class="[{'active': idx == currentIdx}]"
                  @click="changeCurrentDetail(it,idx)"
                  :key="idx">
                    <td >{{it.deviceSn}}</td>
                    <td >{{it.deviceProperties.location | parseLocation}}</td>
                    <td :class="[{ onLine: it.deviceStatus === '1' }, { offLine: it.deviceStatus === '0' },{ fault: it.deviceStatus === '2' }]">
                      {{it.deviceStatus | deviceStatus}}
                    </td>
                    <td>
                      <template v-if="it.relationOrder">
                        {{it.relationOrder.orderStep}}
                        <template v-if="it.relationOrder.orderNo">
                          （工单号：<span class="order" @click="showWorkorderDialog">{{it.relationOrder.orderNo}}</span>）
                        </template>
                      </template>
                    </td>
                    <td >
                      <el-button type="text" 
                        v-if="!it.relationOrder || (it.relationOrder && !it.relationOrder.orderNo)" 
                        @click.stop="confirm(it, '0')">
                          忽略
                      </el-button>

                      <el-button type="text" 
                        v-if="!it.relationOrder ||
                       (it.relationOrder && !it.relationOrder.orderNo)"
                        @click="toggleShowConfirm(it)">
                          报事
                      </el-button>
                    </td>

                  </tr>
                </tbody>
              </table>
            </div>
            <div class="list-info">
              <div class="info-head">
              </div>

              <div class="item-info">
                  <div class="item noline">
                    <div class="label sub-title">设备详情</div>
                    <div></div>
                  </div>
                  <div class="item">
                    <div class="label">设备型号</div>
                    <div class="value sub-title">{{currentDetail.deviceCode}}</div>
                  </div>
                  <div class="item">
                    <div class="label">设备编号</div>
                    <div class="value sub-title">{{currentDetail.sn}}</div>
                  </div>
                  <div class="item">
                    <div class="label">设备标记</div>
                    <div class="value sub-title">{{currentDetail.deviceName}}</div>
                  </div>
                  <div class="item">
                    <div class="label">位置</div>
                    <div class="value sub-title" v-if="currentDetail.deviceProperties">{{currentDetail.deviceProperties.location | parseLocation}}</div>
                  </div>
                  <div class="item">
                    <div class="label">设备状态</div>
                    <div class="value sub-title">{{currentDetail.deviceStatus | deviceStatus}}</div>
                  </div>

                  <div class="item" v-if="detailType == '1'">
                    <div class="label">处理状态</div>
                    <div class="value sub-title">
                      <template v-if="currentDetail.relationOrder">
                        {{currentDetail.relationOrder.orderStep}}
                        <template v-if="currentDetail.relationOrder.orderNo">
                          （工单号：<span class="order" @click="showWorkorderDialog">{{currentDetail.relationOrder.orderNo}}</span>）
                        </template>
                      </template>
                    </div>
                  </div>


              </div>
            </div>
          </div>

          <!--分页-->
          <div class="wrap-page">
            <Page @on-change="pageNoChange"
              :total="+totalCnt"
              :current="+pageNo"
              :page-size="+pageSize"
              class-name="page" />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import echarts from 'echarts'
import { mapState, mapGetters, mapMutations } from 'vuex'

import { mixLocationBuild } from '../../../mixins/locationBuild.js'
export default {
  mixins: [mixLocationBuild],
  data() {
    return {
      pageNo: '1',
      pageSize: '10',
      totalCnt: '',

      deviceStatus: '',
      options: [{
          value: '',
          label: '全部'
        },{
          value: '1',
          label: '在线'
        }, {
          value: '0',
          label: '离线'
        }, {
          value: '3',
          label: '故障'
        }
      ],
      buildId: '',

      currentIdx: 0,
      currentDetail: {},
      deviceList: []
    }
  },
  computed: {
    ...mapState(['deviceInfo', 'rank']),
    ...mapGetters(['projectId']),
    perFault() {
      if (!this.deviceInfo || this.deviceInfo.total <= 0) return '--'
      let num = (this.deviceInfo.fault / this.deviceInfo.total) * 100
      return num.toFixed(1)
    },
    perOffLine() {
      if (!this.deviceInfo || this.deviceInfo.total <= 0) return '--'
      let num = (this.deviceInfo.offLine / this.deviceInfo.total) * 100
      return num.toFixed(1)
    },
    perOnLine() {
      if (!this.deviceInfo || this.deviceInfo.total <= 0) return '--'
      let num = (this.deviceInfo.onLine / this.deviceInfo.total) * 100
      return num.toFixed(1)
    },
    detailType() {
      let type = this.deviceInfo.deviceType
      let val =  ''
      if(type == 'roommastermachhine' 
      || type == 'roompad'
      || type == 'roomslavermachine'
      || type == 'propertymaster'
      || type == 'gateway') {
        val = '1'
      } else {
        return ''
      }
      return val
    }
  },
  mounted() {
    this.initAll()
    this.getData()
    if(this.deviceInfo.deviceType == 'lift') {
      this.getBuild()
    }
  },
  methods: {
    ...mapMutations(['hide', 'showWorkorder', 'toggleShowConfirm']),
    getData() {
      this.getList()

      this.getLineChartData('day')
        .then((res) => {
          let dataObj = this.dealData(res)
          this.initChart({
            ref: 'lineChart1',
            data: dataObj,
          })
        })

      this.getLineChartData('month')
        .then((res) => {
          let dataObj = this.dealData(res)
          this.initChart({
            ref: 'lineChart2',
            data: dataObj,
          })
        })
    },
    getLineChartData(statisticType) {
      return this.$http({
        method: 'post',
        url: '/api/json/ufoXcApi/getDeviceStatusLineChart',
        data: {
          projectId: this.projectId,
          statisticType: statisticType,
          deviceType: this.deviceInfo.deviceType
        }
      })
    },
    getList(pageNo = this.pageNo) {
      this.pageNo = pageNo
      let params = {
        projectId: this.projectId,
        sysType: this.deviceInfo.deviceType,
        pageNo: pageNo,
        pageSize: this.pageSize,
      }
      if(this.deviceStatus  !== '') {
        params.deviceStatus = this.deviceStatus
      }
      if(this.location && this.location.length > 1) {
        params.buildId = this.location[1]
      }
      this.$http({
        method:'post',
        url:'/api/json/platformDeviceApi/getDeviceList',
        data:params
      })
        .then((res) => {
          this.totalCnt = res.data.totalCnt
          this.deviceList = res.data.deviceList
          if(res.data.deviceList && res.data.deviceList.length > 0) {
            this.currentDetail = this.deviceList[this.currentIdx]
          }
        })
    },
    dealData(res) {
      let arrFault = res.data.faultDto
      let arrOffLine = res.data.offlineDto

      let faultList = []
      let offLineList = []
      let labelList = []
      // 故障率计算
      if (arrFault && arrFault.length > 0) {
        arrFault.forEach(el => {
          let it = 0
          if(el.totalCount != 0) {
            it = (el.count/ el.totalCount * 100).toFixed(2)
          }
          faultList.push(it)
          labelList.push(el.statisticDate)
        })
      }
      // 离线率计算
      if (arrOffLine && arrOffLine.length > 0) {
        arrOffLine.forEach(el => {
          let it = 0
          if(el.totalCount != 0) {
            it = (el.count/ el.totalCount * 100).toFixed(2)
          }
          offLineList.push(it)
        })
      }
      return {
        faultList,
        offLineList,
        labelList
      }
    },
    initChart(params) {
      var myChart = echarts.init(this.$refs[params.ref])
      var option = {
        color: ['#F37D2C', '#FF4646'],
        tooltip: {
          trigger: 'axis',
          // formatter: '{b0}<br/>{a0}: {c0}%<br />{a1}: {c1}%',
          formatter: function(params) {
            var html=params[0].name+"<br>"
              for(var i=0;i<params.length;i++){
                html+='<span style="display:inline-block;margin-right:5px;border-radius:8px;width:8px;height:8px;background-color:'+params[i].color+';"></span>'
                  if(option.series[params[i].seriesIndex].valueType=="percent"){
                      html+=params[i].seriesName+":"+params[i].value+"%<br>"
                  }else{
                    html+=params[i].seriesName+":"+params[i].value+"<br>"
                  }
              }
              return html
          }
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
          top: '14',
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
            name: '离线率',
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
            data: params.data.offLineList,
            valueType:"percent",
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
            name: '故障率',
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
            data: params.data.faultList,
            valueType:"percent",
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
    initPieChart(params) {
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
        series: [
          {
            name: '车位',
            type: 'pie',
            radius: [37, 40],
            center: ['50%', '50%'],
            hoverAnimation: false,

            label: {
              normal: {
                show: false
              }
            },
            lableLine: {
              normal: {
                show: false
              }
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
                  opacity: 1
                }
              },
              { value: others, name: '非故障' }
            ]
          }
        ]
      }
      chart.clear()
      chart.setOption(option)
    },
    initAll() {
      this.initPieChart({
        per: this.perFault,
        ref: 'pieFault',
        color: '#FF4646'
      })
      this.initPieChart({
        per: this.perOffLine,
        ref: 'pieOffline',
        color: '#F37D2C'
      })
      this.initPieChart({
        per: this.perOnLine,
        ref: 'pieOnline',
        color: '#00B7FF'
      })
    },
    pageNoChange(pageNo) {
      this.getList(pageNo)
    },
    changeCurrentDetail(it, idx) {
      this.currentIdx = idx
      this.currentDetail = it
    },
    showWorkorderDialog() {
      this.hide()
      this.showWorkorder()
    },
    confirm(it, flag) {
      this.$http({
        method:'post',
        url:'/api/json/ufoXcApi/confirmAlarmInfo',
        data:{
          id: it.id,
          flag: flag,
          remark: '',
          orderType: '',
          orderTypeDetail: '',

          orderLvl: 'low',
          deviceType: it.deviceProperties.type,
        }
      })
        .then(() => {
          this.$message({
            message: '操作成功',
            type: res || 'success'
          })
          this.getList()
        })
    },
  },
  watch: {
    showMoreExceptions(val) {
      if (val) {
        this.getData()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.dialog-content {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  .left {
    padding: 0 80px 44px 118px;
    width: 344px;
    box-sizing: content-box;
    .title-people{
      height: 30px;
      line-height: 1;
      font-size: 14px;
      margin-bottom: 10px;
      i {
        vertical-align: sub;
        display: inline-block;
        width: 18px;
        height: 18px;
        margin-right: 3px;
        background: url("~@assets/img/demo/icon-dev.png");
        background-size: 100% 100%;
      }
      .yantramanav{
        font-size:20px;
      }
    }
    .pieChart{
      width: 344px;
      height: 150px;
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
    .lineChart2 {
      margin-top:10px;
    }

    .section{
      margin-bottom: 32px;
      .body{

        display: flex;
        padding: 8px 10px 0;
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
        .value{
          margin-top: 4px;
          font-size: 12px;
          text-align: center;
          color:rgba(255,255,255, .6);
        }
      }
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
            background: #F37D2C;
          }
          .lable2{
            background: #FF4646;
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
    margin-right: 116px;
    flex: 1;
    .title-people{
      height: 30px;
      font-size: 14px;
      margin-bottom: 10px;
      i {
        vertical-align: sub;
        display: inline-block;
        width: 18px;
        height: 18px;
        margin-right: 3px;
        background: url("~@assets/img/demo/device.png");
        background-size: 100% 100%;
      }
    }
    .section{
      display: flex;
      flex-wrap: wrap;

      .filter{
        font-size: 14px;
        display: flex;
        justify-content: flex-start;

        margin-bottom: 40px;
        .filter-item{
          height: auto;
          display: flex;
          margin-right: 40px;
          .label{
            color:rgba(255,255,255,0.6);
            height: 32px;
            line-height: 32px;
            margin-right: 16px;
          }
          /deep/ input{
            padding-left: 10px;
            color:rgba(255,255,255,1);
            outline: none;
            background: transparent;
            width:296px;
            height:32px;
            border-radius:2px;
            border:1px solid rgba(255,255,255,0.12);
          }
          /deep/ .el-input__icon {
            line-height:32px;
          }

        }

        .search{
          cursor: pointer;
          background: transparent;
          width:64px;
          height:32px;
          border-radius:2px;
          border:1px solid rgba(0,183,255,1);
          color: #00B7FF;
        }
      }

      .list{
        width: 100%;
        .list-content{
          font-size: 14px;
          height: 700px;

          display: flex;
          border-bottom: 1px solid rgba(255,255,255,0.16);
          .list-table{
            opacity: .8;
            color:rgba(255,255,255, 1);
            flex: 1;
            overflow-y: scroll;

            scrollbar-width: none;
            &::-webkit-scrollbar {
              width: 0;
              height: 0;
            }

            .table{
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
                  height: 48px;
                  &.active {
                    background: rgba(255, 255, 255, 0.04);
                  }
                }
              }

              .face-img{
                width: 48px;
                height: 48px;
                border-radius: 50%;
              }
            }
            .offLine{
              color:#F37D2C;
            }
            .fault{
              color: #FF4646;
            }
            .order{
              cursor: pointer;
              color: #00B7FF;
            }
          }
          .list-info{
            width: 354px;
            .info-head{
              box-sizing: content-box;
              height: 24px;
              border-bottom: 1px solid rgba(255,255,255,0.16);

              .export{
                cursor: pointer;
                text-align: right;
                color: #00B7FF;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                i{
                  display: inline-block;
                  width: 15px;
                  height: 15px;
                  margin-right: 3px;
                  background: url('~@assets/img/demo/export.png');
                  background-size: 100% 100%;
                }
              }
            }

            .item-info{
              height: 676px;
              flex: 1;
              color:rgba(255,255,255,0.4);

              border-left: 8px solid rgba(255,255,255,0.08);
              padding: 20px 30px 24px 24px;

              .sn{
                text-align: center;
                .head-img{
                  width: 144px;
                  height: 190px;
                }
                margin-bottom: 12px;
              }

              .item {
                padding: 3px 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(255, 255, 255, 0.16);

                line-height: 28px;
                &.noline{
                  border-bottom: none;
                }
                .label{
                  min-width: 100px;
                }
                .value{
                  text-align: right;
                }
                .sub-title{
                  color: rgba(255,255,255,0.8);
                }
              }
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
}

.wrap-page {
  margin-top: 24px;
  text-align: center;
}
/deep/ .page {
  margin-top: 12px;
  text-align: center;
  .ivu-page-next,
  .ivu-page-prev,
  .ivu-page-item {
    background: transparent;
    border:1px solid rgba(255,255,255,0.16);
    &:hover{
      color: #fff;
    }
    a{
      &:hover{
        color: #fff;
      }
    }
  }
  .ivu-page-item-active {
    background:#00B7FF;
    a{
      color: #fff;
    }
  }
}

// 小屏幕适配
@media screen and (max-height: 800px) {
 .dialog-content {
    .left {
      padding: 20px;
    }
    .right {
      margin-right: 20px;
      .section{
        .list{
          .list-content{
            height: 480px;
            .list-table{
              .table{
                tbody{
                  tr{
                    height: 32px;
                  }
                }
              }
            }
            .list-info{
              width: 280px;
              .item-info{
                height: 456px;
                padding: 10px;
              }
            }
          }
        }
      }
    }
 }
}
</style>