<template>
  <div class="overview">
    <div class="title-people">
      <div><i />FM-工单信息</div>
      <div class="wrap-more" @click="showMore">更多<i class="more" /></div>

    </div>
    <div class="body">
      <div class="wrap-chart">
        <div class="rate">总计<div class="num">71</div></div>
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
                  <td class="flex-2">{{currentDate}} {{it.date}}</td>
                  <td class="flex-2">{{it.rank}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                  <td class="flex-2">{{it.type}}</td>
                  <td class="flex-1">{{it.status}}</td>
                </tr>
              </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import { mapMutations } from 'vuex'

let timeObj = JSON.parse(window.localStorage.getItem('aiot-time'))
export default {
  data() {
    return {
      isSmallscreen: window.screen.availHeight < 800,
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
  mounted() {
    this.iniChart()
    this.initScorll()
  },

  methods: {
    ...mapMutations(['showWorkorder']),
    iniChart() {
      let chart = echarts.init(this.$refs.chart)
      let option = {
        color: ['#13E38D', '#00B7FF', '#FF4646'],
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
          data: [{
            name: '已处理',
            icon: 'circle',
          }, {
            name: '处理中',
            icon: 'circle',
          }, {
            name: '待处理',
            icon: 'circle',
          }],
        },
        // calculable: true,
        series: [{
            name: '车位',
            type: 'pie',
            radius: [36, 40],
            center: this.isSmallscreen ? ['32%', '50%'] : ['32%', '30%'],
            hoverOffset: 3,
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
            data: [
              { value: 6, name: '已处理' },
              { value: 9, name: '处理中' },
              { value: 7, name: '待处理' }
            ]
          }
        ]
      }
      this.carRate = '1020'
      chart.setOption(option)

      //设置默认选中高亮部分
      chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: 2
      })
    },
    initScorll() {
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
      setInterval(scrollTop, 1500)
    },
    showMore() {
      this.showWorkorder()
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