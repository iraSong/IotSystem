<template>
  <div class="people">
    <div class="title-people">
      <div>
        <i />车流量
      </div>
    </div>
    <div class="body">
      <div class="menu-tab">
        <div :class="[{'active': lineType == 'hour'}, 'menu-item']" @click="getData('hour')">
          <span></span>&nbsp;小时
        </div>
        <div :class="[{'active': lineType == 'day'}, 'menu-item']" @click="getData('day')">
          <span></span>&nbsp;天
        </div>
        <div :class="[{'active': lineType == 'month'}, 'menu-item']" @click="getData('month')">
          <span></span>&nbsp;月
        </div>
      </div>
      <div class="lineChart" ref="lineChart" />

      <div class="analysis">
        <div class="sub-title">
          <i class="icon-p" />车位
          <span class="total">
            本月累计收费：
            <span class="yantramanav">{{ cMon | toThousandFilter}}</span>元
          </span>
        </div>
        <div class="item barTitle v-hide">
          车位数量统计：
          <span class="yantramanav">{{ +parData.use + +parData.free}}</span>
        </div>
        <div ref="barChart" id="barChart" class="barChart"></div>
        <div class="rate">
          空置率
          <div class="num yantramanav">{{ parData.carRate}}%</div>
          <div class="label-line">
            <div>
              <span class="line line1" />
              <span class="line line2" />
              <div class="item">
                占用车位:
                <span class="yantramanav">{{parData.use | toThousandFilter}}</span>
              </div>
            </div>

            <div class="f-mgt19">
              <span class="line line1 yell" />
              <span class="line line2 yell" />
              <div class="item">
                空闲车位:
                <span class="yantramanav">{{parData.free | toThousandFilter}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom v-hide">
          <div class="item day">
            今日临停收费：
            <span class="yantramanav">{{ cDayGuset * 10 | toThousandFilter }}</span>元
          </div>
          <div class="item mon">
            本月临停收费：
            <span class="yantramanav">{{ cMon | toThousandFilter}}</span>元
          </div>
          <div class="item mon">
            本月月卡收费：
            <span class="yantramanav">{{ cMon | toThousandFilter}}</span>元
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import echarts from "echarts"
import { mapState, mapGetters } from "vuex"

export default {
  data() {
    return {
      parData: {
        carRate: "0.0",
        use: "0.0",
        free: "0.0",
        unit: ""
      },
      cDayGuset: "0",
      cMon: "0",

      inList: [],
      outList: [],
      labelList: [],
      lineType: "hour"
    }
  },
  computed: {
    ...mapState(["rank", "refresh"]),
    ...mapGetters(["cityCode", "projectId"])
  },
  mounted() {
    this.getData()
    this.getInfoData()
    this.initParChart()

    // 浏览器窗口改变，charts图 需要重绘
    let tid
    window.addEventListener(
      "resize",
      () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          this.$refs.lineChart.removeAttribute("_echarts_instance_")
          this.$refs.barChart.removeAttribute("_echarts_instance_")
          this.initParChart()
          this.initLineChart()
        }, 300)
      },
      false
    )
  },

  methods: {
    getData(type = "hour") {
      this.lineType = type
      this.$http({
        method: "post",
        url: "/api/json/ufoXcApi/getVehicleFlowStatistic",
        data: {
          cityCode: this.cityCode,
          projectId: this.projectId,
          statisticType: type,
          statisticMode: 'direction',
          startTime: moment().subtract(2,'years').format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
      }).then(res => {
        this.dealData(res)
        this.initLineChart()
      })
    },
    getInfoData() {
      // 接口未定义
    },
    dealData(res) {
      let arrIn = res.data.vechicleIn
      let arrOut = res.data.vechicleOut

      let inList = []
      let outList = []
      let labelList = []

      arrIn.forEach(el => {
        inList.push(el.flowData)
        labelList.push(el.statisticDate)
      })

      arrOut.forEach(el => {
        outList.push(el.flowData)
      })

      this.inList = inList
      this.outList = outList
      this.labelList = labelList
    },
    initLineChart() {
      var myChart = echarts.init(this.$refs.lineChart)
      var option = {
        color: ["#00B7FF", "#F37D2C"],
        tooltip: {
          trigger: "axis"
        },
        legend: {
          align: "left",
          left: 0,
          padding: [10, 0],
          textStyle: {
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: 12
          },
          itemWidth: 8,
          data: [
            {
              name: "进场",
              icon: "circle"
            },
            {
              name: "出场",
              icon: "circle"
            }
          ]
        },
        grid: {
          top: "26%",
          left: "0",
          right: "0",
          bottom: "0",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.labelList,
          // splitNumber: 24,
          axisTick: {
            show: true,
            inside: true,
            interval: 0
          },
          axisLabel: {
            showMinLabel: false,
            showMaxLabel: false,
            // interval: 5,
            color: "rgba(255,255,255,0.3)"
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(255,255,255,0.1)"
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "rgba(255,255,255,0.1)" //坐标轴的颜色
            }
          }
        },
        yAxis: {
          type: "value",
          axisLabel: {
            show: false
          },
          axisTick: {
            show: true,
            inside: true,
            interval: 0
          },
          splitLine: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "rgba(255,255,255,0.1)" //坐标轴的颜色
            }
          }
        },
        series: [
          {
            name: "进场",
            type: "line",
            symbol: "circle", // 默认是空心圆（中间是白色的），改成实心圆
            symbolSize: 1,
            lineStyle: {
              width: 1,
              type: "solid",
              shadowBlur: 10,
              shadowColor: "#F37D2C",
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              opacity: 1
            },
            data: this.inList,
            areaStyle: {
              normal: {
                //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(243, 125, 44, 0)"
                  },
                  {
                    offset: 1,
                    color: "rgba(243, 125, 44, 0.12)"
                  }
                ]),
                origin: "end"
              }
            }
          },
          {
            name: "出场",
            type: "line",
            symbol: "circle", // 默认是空心圆（中间是白色的），改成实心圆
            symbolSize: 1,
            lineStyle: {
              width: 1,
              type: "solid",
              shadowBlur: 10,
              shadowColor: "#00B7FF",
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              opacity: 1
            },
            data: this.outList,
            areaStyle: {
              normal: {
                //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(0, 183, 255, 0)"
                  },
                  {
                    offset: 1,
                    color: "rgba(0, 183, 255, 0.12)"
                  }
                ]),
                origin: "end"
              }
            }
          }
        ]
      }
      myChart.clear()
      myChart.setOption(option)
    },
    initParChart() {
      let isSmallscreen = document.documentElement.clientHeight < 800 // 小屏幕和大屏图饼图位置不同
      let chart = echarts.init(document.getElementById('barChart'))
      let option = {
        color: ["#F37D2C", "#00B7FF"],
        grid: {
          left: "0",
          right: "0",
          top: "0",
          bottom: "0",
          containLabel: true
        },
        // calculable: true,
        series: [
          {
            name: "车位",
            type: "pie",
            radius: [40, 42],
            center: isSmallscreen ? ["15%", "50%"] : ["37%", "35%"],
            // roseType: 'radius',
            startAngle: 0,
            //hoverOffset: 2,
            hoverAnimation: false,
            label: {
              normal: {
                show: false,
                formatter: function(val) {
                  //让series 中的文字进行换行
                  return val.name.split(" ").join("\n\n")
                }
              }
            },
            labelLine: {
              normal: {
                show: false,
                length: 6,
                length2: 12,
                lineStyle: {}
              }
            },
            emphasis: {
              itemStyle: {}
            },
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "#00B7FF",
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              opacity: 1
            },
            data: [
              {
                value: this.parData.free,
                name: `空闲车位 ${this.parData.free}`,
                itemStyle: {
                  borderColor: "#F37D2C",
                  borderWidth: 2,
                  shadowColor: "#F37D2C"
                }
              },
              { value: this.parData.use, name: `占用车位 ${this.parData.use}` }
            ]
          }
        ]
      }
      chart.clear()
      chart.setOption(option)
      //设置默认选中高亮部分
      chart.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: 0
      })
    }
  },
  watch: {
    refresh() {
      this.getData()
      this.getInfoData()
      this.initParChart()
    }
  }
}
</script>

<style lang="less" scoped>
.people {
  margin-top: 30px;
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
      background: url("~@assets/img/demo/icon-car.png");
      background-size: 100% 100%;
      &.more {
        width: 15px;
        height: 3px;
        background: url("~@assets/img/demo/icon-more.png");
        background-size: 100% 100%;
      }
    }
  }
  .body {
    position: relative;
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
  .lineChart {
    width: 340px;
    height: 124px;
  }

  .analysis {
    position: relative;
    .sub-title {
      margin-top: 28px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.16);
    }
    i.icon-p {
      vertical-align: sub;
      display: inline-block;
      width: 18px;
      height: 18px;
      margin-right: 3px;
      background: url("~@assets/img/demo/icon-p.png");
      background-size: 100% 100%;
    }
    .total {
      display: none;
    }

    .item {
      margin-bottom: 2px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.8);
    }
    .barTitle {
      position: absolute;
      top: 20;
      left: 0;
      span {
        font-size: 20px;
      }
    }
    .rate{
      pointer-events: none;
      text-align: center;
      position: absolute;
      top: 25.5%;
      left: 37%;
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

      .label-line {
        position: absolute;
        left: 120px;
        top: 0;
        .line {
          display: inline-block;
          width: 14px;
          height: 1px;
          background: #00b7ff;
          position: absolute;
        }
        .line1 {
          transform: rotate(-45deg);
          left: -37px;
          top: 20px;
          &.yell {
            transform: rotate(45deg);
            left: -37px;
            top: 59px;
            background: #f37d2c;
          }
        }
        .line2 {
          top: 15px;
          left: -25px;
          width: 20px;
          &.yell {
            top: 64px;
            // left: -29px;
            // width: 26px;
            background: #f37d2c;
          }
        }

        .item {
          white-space: nowrap;
          span {
            font-size: 20px;
            color: #fff;
          }
        }
      }

      color: rgba(255, 255, 255, 0.5);
      .num {
        font-size: 20px;
        color: #fff;
      }
    }
    .bottom {
      position: absolute;
      bottom: 0;
      span {
        font-size: 20px;
      }
    }
    .barChart {
      width: 340px;
      height: 240px;
    }
  }

  .f-mgt19 {
    margin-top: 19px;
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

    .analysis {
      position: relative;
      .sub-title {
        margin-top: 0;
      }
      .total {
        display: inline-block;
        margin-left: 24px;
        span {
          font-size: 20px;
        }
      }
      .barChart {
        width: 300px;
        height: 100px;
      }
      .rate {
        top: 30%;
        left: 5px;
        transform: translate(0, 0);
      }
    }
  }
}
</style>