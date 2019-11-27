<template>
  <div class="wrap flex-center" @click.self="hide" v-show="showMoreWorkorder">
    <div class="main">
      <div class="left">
        <span class="border border-1"></span>
        <span class="border border-2"></span>
        <span class="border border-3"></span>
        <span class="border border-4"></span>
        <div class="wrap-chart">
          <div><i class="pass"/>工单量的处理状态</div>
          <div class="body">
            <div class="lineChart" ref="lineChart" />
          </div>
          <div><i class="result"/>工单类型分布 <i class="pos"/>紧急程度分布</div>
          <div class="body-pie">
            <div class="pieResult">
              <div class="rate">总计<div class="num">1020</div></div>
              <div ref="pieResult" class="chart"></div>
            </div>
            <div class="piePos">
              <div class="rate">离线<div class="num">714</div></div>
              <div ref="piePos" class="chart"></div>
            </div>
          </div>
        </div>
        <div class="wrap-table">
          <div class="title">
            <div><i class="pass"/>今日工单信息</div>
            <i class="close" @click.stop="hide"/>
          </div>
          <div class="table">
            <!--滚动 内容 -->
            <div class="scroll-box">
              <table ref="scorllTable">
                  <thead>
                    <tr>
                      <th>工单编号</th>
                      <th>报单时间</th>
                      <th>紧急程度</th>
                      <th>类型</th>
                      <th>状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(it, idx) in list" :key="idx">
                      <td>{{it.id}}</td>
                      <td>{{currentDate}} {{it.date}}</td>
                      <td>{{it.rank}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                      <td>{{it.type}}</td>
                      <td>{{it.status}}</td>
                    </tr>
                  </tbody>
              </table>
            </div>
            <Page v-if="false" :total="150" size="small" class-name="page"/>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="line"></div>
        <div class="title"><i class="pass"/>工单进度</div>
        <div class="item">
          <div class="lable"><span></span></div>
          <div class="content">工单生成:<br />{{currentDate}}  08:52:10</div>
        </div>
        <div class="item">
          <div class="lable"><span></span></div>
          <div class="content">催办:<br />{{currentDate}}  08:32:51</div>
        </div>
        <div class="item current">
          <div class="lable"><span></span></div>
          <div class="content">接单处理:<br />{{currentDate}}  08:00:24</div>
        </div>
        <div class="item">
          <div class="lable"><span></span></div>
          <div class="content">处理完成:<br />{{currentDate}} 07:32:39</div>
        </div>
        <div class="item">
          <div class="lable"><span></span></div>
          <div class="content">设备上报:<br />{{currentDate}} 06:42:17</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import { mapState , mapMutations} from 'vuex'
let timeObj = JSON.parse(window.localStorage.getItem('aiot-time'))
export default {
  data() {
    return {
      currentDate: `${timeObj.mon+1}.${timeObj.d}`,
      list: [
        {
          id: '#39585940',
          date: '08:09',
          rank: '紧急',
          type:'设备维护',
          status: '处理中'
        },
        {
          id: '#39585939',
          date: '08:03',
          rank: '一般',
          type:'门磁安全',
          status: '处理中'
        },
        {
          id: '#39585938',
          date: '08:01',
          rank: '紧急',
          type:'烟感警报',
          status: '处理中'
        },
        {
          id: '#39585937',
          date: '07:54',
          rank: '紧急',
          type:'非法入侵',
          status: '处理中'
        },
        {
          id: '#39585936',
          date: '07:53',
          rank: '一般',
          type:'设备维护',
          status: '处理中'
        },{
          id: '#39585935',
          date: ' 07:34',
          rank: '紧急',
          type:'电梯故障',
          status: '处理中'
        },
        {
          id: '#39585934',
          date: '07:23',
          rank: '一般',
          type:'门磁安全',
          status: '处理中'
        },
        {
          id: '#39585933',
          date: '07:09',
          rank: '紧急',
          type:'烟感警报',
          status: '处理中'
        },
        {
          id: '#39585932',
          date: '06:05',
          rank: '紧急',
          type:'非法入侵',
          status: '处理中'
        },
        {
          id: '#39585931',
          date: '05:09',
          rank: '一般',
          type:'设备维护',
          status: '处理中'
        }
      ]
    }
  },
  computed: {
    ...mapState(['showMoreWorkorder'])
  },
  mounted() {
    this.initLineChart()
    this.initPieChart({
      data: [{ value: 700, name: '设备维护 404' },{ value: 320, name: '保洁 320' }],
      ref: 'pieResult',
    })
    this.initPieChart({
      data: [{ value: 404, name: '一般 404' },{ value: 310, name: '紧急 310' }],
      ref: 'piePos',
    })
  },
  methods: {
    ...mapMutations(['hide']),
    initLineChart() {
      var myChart = echarts.init(this.$refs.lineChart)
      let axisLabelList = this.getAxisLabelList()

      var option = {
        color: ['#00B7FF', '#F37D2C'],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          align: 'left',
          left: 0,
          padding: [10, 0],
          textStyle: {
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 12,
          },
          itemWidth: 8,
          data: [{
            name: '待处理',
            icon: 'circle',
          }, {
            name: '处理中',
            icon: 'circle',
          }, {
            name: '已处理',
            icon: 'circle',
          }],
        },
        grid: {
          top: '26%',
          left: '5%',
          right: '5%',
          bottom: '0',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: axisLabelList,
          // splitNumber: 24,
          axisTick: {
            show: true,
            inside: true,
            interval: 0,
          },
          axisLabel: {
            // showMinLabel: false,
            // showMaxLabel: false,
            // interval:5,
            color: 'rgba(255,255,255,0.4)',
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
        },
        series: [
          {
            name: '待处理',
            type: 'line',
            symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
            symbolSize: 1,
            lineStyle: {
              width: 1
            },
            data: [220, 182, 191, 234, 290, 330, 310,220, 182, 191, 234, 290, 330, 310,220, 182, 191, 234, 290, 330, 310, 290, 330, 310]
          },
          {
            name: '处理中',
            type: 'line',
            symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
            symbolSize: 1,
            lineStyle: {
              width: 1
            },
            data: [120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210, 90, 230, 210]
          },
          {
            name: '已处理',
            type: 'line',
            symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
            symbolSize: 1,
            lineStyle: {
              width: 1
            },
            data: [140, 112, 151, 184, 80, 130, 110,220, 162, 141, 174, 100, 130, 110,160, 232, 151, 144, 100, 250, 230, 170, 130, 200]
          }
        ]
      }
      myChart.setOption(option)
    },
    getAxisLabelList() {
      var list = []
      for(let i = 1; i<= timeObj.d; i++){
        let it = (timeObj.mon + 1) +'.' + i
        list.push(it)
      }
      return list
    },
    initPieChart(params) {
      let chart = echarts.init(this.$refs[params.ref])
      let option = {
        color: ['#00B7FF', '#FF4646'],
        grid: {
          left: '0',
          right: '0',
          top: '0',
          bottom: '0',
          containLabel: true
        },
        calculable: true,
        series: [{
            name: '车位',
            type: 'pie',
            radius: [35, 40],
            center: ['50%', '50%'],
            hoverOffset: 3,
            label: {
              normal: {
                show: true,
                formatter: function(val) {   //让series 中的文字进行换行
                    return val.name.split(" ").join("\n\n")
                }
              },
            },
            labelLine: {
              normal: {
                show: true,
                length: 3,
                length2: 9,
                lineStyle: {
                },
              },
            },
            data: params.data
          }
        ]
      }
      chart.setOption(option)
      //设置默认选中高亮部分
      chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: 1
      })
    },
  }
}
</script>

<style lang="less" scoped>
.wrap{
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  .main{
    width: 1200px;
    height: 620px;
    display: flex;
    .left{
      position: relative;
      display: flex;
      .border{
        position: absolute;
        display: inline-block;
        width: 11px;
        height: 11px;
      }
      .border-1{
        right: -4px;
        top: -4px;
        background: url("~@assets/img/demo/city/1.png");
        background-size: 100% 100%;
      }
      .border-2{
        right: -4px;
        bottom: -4px;
        background: url("~@assets/img/demo/city/2.png");
        background-size: 100% 100%;
      }
      .border-3{
        left: -4px;
        top: -4px;
        background: url("~@assets/img/demo/city/3.png");
        background-size: 100% 100%;
      }
      .border-4{
        left: -4px;
        bottom: -4px;
        background: url("~@assets/img/demo/city/4.png");
        background-size: 100% 100%;
      }
      .wrap-chart{
        padding: 30px 20px;

        color:rgba(255,255,255,1);
        font-size: 14px;
        width:391px;
        height:620px;
        background:rgba(0,22,32,1);
        opacity:0.95;
        border:1px solid rgba(41,81,107,1);
        i{
          vertical-align: text-bottom;
          display: inline-block;
          width: 15px;
          height: 17px;
          margin-right: 3px;
          &.pass{
            width: 17px;
            height: 17px;
            background: url("~@assets/img/demo/city/pass.png");
            background-size: 100% 100%;
          }
          &.result{
            margin-top: 50px;
            background: url("~@assets/img/demo/city/result.png");
            background-size: 100% 100%;
          }
          &.pos{
            margin-top: 50px;
            margin-left: 87px;
            background: url("~@assets/img/demo/city/pos.png");
            background-size: 100% 100%;
          }
        }
        .lineChart {
          width: 340px;
          height: 250px;
        }

        .body-pie{
          justify-content: space-around;
          display: flex;
          div{
            position: relative;
            width: 190px;
            height: 200px;
            box-sizing: border-box;
          }
          .rate{
            text-align: center;
            position: absolute;
            top: 78px;
            left: 50%;
            transform: translate(-50%, 0);
            font-size:12px;
            color:rgba(255,255,255,0.4);
            .num{
              font-size: 18px;
              color: #fff;
            }
          }
          .chart{
            width: 190px;
            height: 200px;
          }
        }
      }
      .wrap-table{
        padding: 30px 20px;
        color:rgba(255,255,255,1);
        font-size: 14px;
        width:601px;
        height:620px;
        background:rgba(0,37,66,1);
        opacity:0.95;
        border:1px solid rgba(41,81,107,1);
        .title{
          display: flex;
          justify-content: space-between;
        }
        i{
          vertical-align: text-bottom;
          display: inline-block;
          width: 18px;
          height: 16px;
          margin-right: 3px;
          background: url("~@assets/img/demo/city/war-pass.png");
          background-size: 100% 100%;
          &.close{
            width: 14px;
            height: 15px;
            background: url("~@assets/img/demo/city/close.png");
            background-size: 100% 100%;
          }
        }

        .table{
          margin-top:10px;
          flex: 1;
          height: 172px;
          &::-webkit-scrollbar {
            width: 0;
          }
          .head-img{
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
          table{
            width: 100%;
            table-layout: auto;
            thead tr{
              color:rgba(255,255,255,0.4);
              height: 24px;
            }
            tbody{
              tr{
                color:rgba(255,255,255,0.8);
                height: 48px;
              }
              .red{
                color: #FF4646;
              }
            }

          }
        }

        .page{
          margin-top:12px;
          text-align: center;
          /deep/ .ivu-page-next, /deep/ .ivu-page-prev, /deep/ .ivu-page-item {
            background: transparent;
          }
        }
      }
    }
    .right{
      color:rgba(255,255,255,1);
      font-size: 14px;
      padding: 30px 20px;
      margin-left:14px;
      width:200px;
      height:620px;
      background:rgba(0,37,66,1);
      opacity:0.95;
      border:1px solid rgba(41,81,107,1);
      position: relative;
      .line{
        position: absolute;
        top: 80px;
        left: 25px;
        width: 1px;
        height: 302px;
        background: #33454E;
      }
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
        margin-bottom: 26px;
        color:rgba(255,255,255,0.8);
        font-size:12px;
        display: flex;
        align-items: baseline;
        .lable{
          width: 10px;
          height: 10px;
          margin-right: 7px;
          border-radius: 50%;
          background: #ccc;
          position: relative;
        }
        .content{
          line-height:24px;
          flex:1;
        }
        &.current{
          color: #00B7FF;
          .lable{
            background: #00B7FF;
          }
        }
      }
    }
  }
}
</style>