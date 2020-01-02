<template>
  <div class="dialog-content">
    <div class="left">
      <div class="title-people" @click.stop="togglePieChart">
        <i />本月累计：<span class="yantramanav">{{totalUse}}{{unit}}</span>
      </div>
      <!-- 设备线图 -->
      <div class="section">
        <!-- 日 -->
        <div class="chart-title">日度用{{name}}量</div>
        <div class="lineChart"
          ref="lineChart1" />
      </div>
        <!-- 月 -->
      <div class="section">
        <div class="chart-title">月度{{name}}用量</div>
        <div class="lineChart lineChart2"
          ref="lineChart2" />
      </div>
    </div>

    <div class="right">
      <div class="title-people" @click.stop="togglePieChart">
        <i />用{{name}}量数据
      </div>
      <div class="section">
        <div class="filter">
          <div class="filter-item">
            <div class="label">时间</div>
            <div class="qd-el qd-filter-el">
              <el-date-picker
                popper-class="pwdType"
                size="small"
                v-model="time"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                format="yyyy-MM-dd HH:mm:ss"
                >
              </el-date-picker>
            </div>
          </div>
          <div class="filter-item">
            <div class="label">位置</div>
            <div class="qd-el qd-filter-el">
              <el-cascader
                :clearable="true"
                size="small"
                popper-class="qd-cascader"
                :props="props"
                v-model="location">
              </el-cascader>
            </div>

          </div>

          <div class="filter-item">
            <div class="label">设备编号</div>
            <input v-model="other" type="text" placeholder="" />
          </div>

          <button class="search" @click="getLogList(0)">搜索</button>
        </div>

        <div class="list">
          <!--列表内容-->
          <div class="list-content">
            <div class="list-table">
              <table class="table">
                <thead>
                  <tr>
                    <th>时间</th>
                    <th>设备编号</th>
                    <th>位置</th>
                    <th>当日用{{name}}量</th>
                    <th>当月累计</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(it, idx) in deviceList"
                  :class="[{'active': idx == currentIdx}]"
                  @click="changeCurrentDetail(it,idx)"
                  :key="idx">
                    <td >{{it.readDate | formatTime}}</td>
                    <td >{{it.sn}}</td>
                    <td ></td>
                    <td >{{it.useRecord}}</td>
                    <td >{{it.monthRecord}}</td>
                  </tr>
                </tbody>
              </table>
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
import moment from 'moment'
import echarts from 'echarts'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { mixLocation } from '../../../mixins/location.js'

export default {
  mixins: [mixLocation],
  data() {
    return {
      pageNo: '1',
      pageSize: '10',
      totalCnt: '',

      deviceStatus: '',
      options: [{
          value: '',
          label: '全部'
        },
        {
          value: '1',
          label: '在线'
        }, {
          value: '2',
          label: '离线'
        }, {
          value: '3',
          label: '故障'
        }
      ],

      currentIdx: 0,
      currentDetail: {},
      deviceList: [],
      totalUse: '--',
      time: '',
      other: '',
    }
  },
  computed: {
    ...mapState(['deviceInfo', 'rank']),
    ...mapGetters(['projectId']),
    name() {
      return this.deviceInfo.deviceType == 'elec' ? '电': '水'
    },
    unit() {
      return this.deviceInfo.deviceType == 'elec' ? 'kW‧h': 'm³'
    },
  },
  mounted() {
    this.getData()
  },
  methods: {
    ...mapMutations(['hide']),
    getData() {
      this.getUseList()
      this.getLineChart()
      this.getTotalUse()
    },
    getUseList(pageNo = this.pageNo) {
      this.$http({
        method:'post',
        url:'/api/json/gyLogApi/getWaterElecRecord',
        data:{
          projectId: this.projectId,
          devType: this.deviceInfo.deviceType,
          beginDate: moment().subtract(2,'years').format('YYYY-MM-DD'),
          endDate: moment().format('YYYY-MM-DD'),
          pageNo: pageNo,
          pageSize: this.pageSize,
        }
      })
        .then((res) => {
          this.totalCnt = res.data.totalCnt
          this.deviceList = res.data.list
        })
    },
    getTotalUse() {
      this.$http({
        method:'post',
        url:'/api/json/gyLogApi/getWaterElecCumulativeRecordCurrentMonth',
        data:{
          projectId: this.projectId,
          devType: this.deviceInfo.deviceType,
        }
      })
        .then((res) => {
          this.totalUse = res.data.cumulativeRecord
        })
    },
    getLineChart() {
      this.$http({
        method:'post',
        url:'/api/json/ufoIndicesApi/waterElecRecordIndicesData',
        data:{
          projectId: this.projectId,
          devType: this.deviceInfo.deviceType,
          indicesNameEn: 'smartElectricMeterKWH',
        }
      })
        .then((res) => {
          let dataObj1 = this.dealData(res, 0)
          let dataObj2 = this.dealData(res, 1)
          this.initChart({
            ref: 'lineChart1',
            data: dataObj1,
          })
          this.initChart({
            ref: 'lineChart2',
            data: dataObj2,
          })
        })
    },
    dealData(res, idx) {
      let list = res.data.list[idx].groupData[0].indicesData
      let dataList = []
      let labelList = []

      if(list && list.length > 0) {
        list.forEach(el => {
          dataList.push(el.value)
          labelList.push(el.key)
        })
      }
      return {
        dataList,
        labelList
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
            name: `用${this.name}量`,
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
            data: params.data.dataList,
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
        ]
      }

      myChart.clear()
      myChart.setOption(option)
    },
    pageNoChange(pageNo) {
      this.getUseList(pageNo)
    },
    changeCurrentDetail(it, idx) {
      this.currentIdx = idx
      this.currentDetail = it
    },
  }
}
</script>

<style lang="less" scoped>
.dialog-content {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  .left {
    padding: 0 40px 44px 118px;
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
        background: url("~@assets/img/demo/icon-peo.png");
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
        background: url("~@assets/img/demo/icon-peo.png");
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
            white-space: nowrap;
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
                .label{
                  min-width: 100px;
                }
                .value{
                  text-align: right;
                }
                .sub-titile{
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