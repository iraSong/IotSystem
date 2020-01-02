<template>
  <div class="overview">
    <div class="title-people">
      <div><i />重点关注</div>
      <div class="wrap-more" @click="showMore">更多<i class="more" /></div>
    </div>
    <div class="body">
      <div class="table">
        <table class="head">
          <thead>
            <tr>
              <th class="name">姓名</th>
              <th class="phone v-hide">电话</th>
              <th class="room">房屋</th>
              <th class="time">时间</th>
              <th class="info">关注信息</th>
              <th class="img end v-hide">抓拍</th>
            </tr>
          </thead>
        </table>
        <!--滚动 内容 -->
        <div class="scroll-box">
          <table ref="scorllTable">
            <tbody>
              <tr v-for="(it, idx) in list" :key="idx">
                <td class="name">{{it.name}}</td>
                <td class="phone v-hide">{{it.mobile}}</td>
                <td class="room">{{it.roomName}}</td>
                <td class="time">{{it.alarmTime | formatTime2}}</td>
                <td class="info" :title="it.monitorType">{{it.monitorType}}</td>
                <td class="img end v-hide"><img v-if="it.faceUrl" class="head-img" :src="it.faceUrl" /></td>
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
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {
      list: []
    }
  },
  computed: {
    ...mapState(['refresh']),
    ...mapGetters(['projectId']),
  },
  mounted() {
    this.getData()
  },

  methods: {
    ...mapMutations(['showExceptions']),
    initScorll() {
      let intv = null
      if(intv!=null){
        clearInterval(interval)
        intv=null
      }
      let sTab = this.$refs.scorllTable//要滚动的表
      let tbody = sTab.getElementsByTagName('tbody')[0]//要滚动表格的内容
      sTab.appendChild(tbody.cloneNode(true))//追加一次滚动内容,以防滚动后可视区域无内容
      let speed = sTab.getElementsByTagName('tr')[0].offsetHeight//每次滚动的距离
      let tbdh = tbody.offsetHeight//整个表的高度,是因为上边的边不算滚动
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
      intv = setInterval(scrollTop, 2000)
    },
    showMore() {
      this.showExceptions()
    },
    getData() {
      this.$http({
        method:'post',
        url:'/api/json/ufoXcApi/getPassingMonitorRecord',
        data:{
          projectId: this.projectId,
          pageNo: '1',
          pageSize: '10',
          startTime: moment().subtract(2,'years').format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
      })
        .then((res) => {
          this.list = res.data.passingMonitorRecordList.slice(0,10)
          if(this.list.length > 3){
            this.$nextTick(() => {
              this.initScorll()
            })
          }
        })
    },
    getTimeObj() {
      let t = getTime()
      return {
        // startTime: `${t.y}-${t.mon}-${t.d} 00:00:00`,
        startTime: `2018-01-01 00:00:00`,
        endTime: `${t.y}-${t.mon + 1}-${t.d} 23:59:59`
      }
    },
  },
  watch: {
    refresh() {
      this.getData()
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
    margin-bottom: 8px;
    i {
      vertical-align: sub;
      display: inline-block;
      width: 18px;
      height: 18px;
      margin-right: 3px;
      background: url("~@assets/img/demo/icon-attention.png");
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
      width: 228px;
      height: 172px;
      .chart{
        width: 228px;
        height: 172px;
      }
      .rate{
        text-align: center;
        position: absolute;
        top: 55%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size:12px;
        color:rgba(255,255,255,0.4);
        .num{
          font-size: 18px;
          color: #fff;
        }
      }
    }

    .table{
      flex: 1;
      height: 172px;
      &::-webkit-scrollbar {
        width: 0;
      }
      .head-img{
        width: 32px;
        height: 32px;
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
      .end{
        text-align: right;
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

    table{
      tr{
        justify-content: space-between;
        td{
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .name{
        width: 50px;
      }
      .phone{
        width: 100px;
      }
      .room{
        width: 100px;
      }
      .time{
        width: 80px;
      }
      .info{
        width: 80px;
      }
      .img{
        width: 50px;
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
        height: 120px;
        .chart{
          height: 120px;
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
    }
  }
}
</style>