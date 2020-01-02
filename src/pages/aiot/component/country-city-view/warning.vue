<template>
  <div class="overview">
    <div class="title-people">
      <div><i />{{rank | rankName}}告警量</div>
      <div class="wrap-more" @click="showMore">更多<i class="more" /></div>

    </div>
    <div class="body">
      <div class="table-row border-line">
        <div class="table-col w-name">{{rank | rankName}}</div>
        <div class="table-col  w-name">告警量</div>
        <div class="table-col">分布:</div>
        <div class="table-col"><span class="lable1"></span>待处理</div>
        <div class="table-col"><span class="lable2"></span>处理中</div>
        <div class="table-col end"><span class="lable3"></span>已处理</div>
      </div>

      <div class="table-row" v-for="(it, idx) in list" :key="idx">
        <div class="table-col w-name">{{it.name}}</div>
        <div class="table-col  w-name">{{it.total}}</div>
        <div class="table-col chart">
          <div class="it1" :style="{width: it.wait / it.total *100 + '%'}"><span>{{it | perIt1}}%</span></div>
          <div  class="it2" :style="{width: it.dealing / it.total *100 + '%'}"><span>{{it | perIt2}}%</span></div>
          <div  class="it3" :style="{width: it.done / it.total *100 + '%'}"><span>{{it | perIt3}}%</span></div>
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
      list: [],
    }
  },
  computed: {
    ...mapState(['rank', 'refresh']),
    ...mapGetters(['cityCode']),
  },
  filters: {
    perIt1(it) {
      return (it.wait / it.total * 100).toFixed(0)
    },
    perIt2(it) {
      return (it.dealing / it.total * 100).toFixed(0)
    },
    perIt3(it) {
      return (it.done / it.total * 100).toFixed(0)
    },
  },
  mounted() {
    this.getData()
  },

  methods: {
    ...mapMutations(['showWarning']),
    getData() {
      this.$http({
        method:'post',
        url:'/api/json/ufoXcApi/getAlarmInfoStatistic',
        data:{
          cityCode: this.cityCode,
          pageNo: '1',
          pageSize: '3',
          startTime: moment().subtract(2,'years').format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
      })
        .then((res) => {
          this.list = res.data.alarmInfo.slice(0,3)
        })
    },
    showMore() {
      this.showWarning()
    }
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
    margin-bottom: 4px;
    i {
      vertical-align: sub;
      display: inline-block;
      width: 18px;
      height: 18px;
      margin-right: 3px;
      background: url("~@assets/img/demo/icon-waring.png");
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
    font-size: 12px;
    .table-row{
      display: flex;
      height: 48px;
      line-height: 48px;
      .table-col{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 20px;

        color: rgba(255, 255, 255, 0.6);
        &.big{
          padding-left:198px;
        }
        &.end{
          padding-left: 0;
        }
        &.chart{
          margin-right: 0;
          padding-left: 0;
          padding-bottom: 15px;
          flex: 1;
          display: flex;
          align-items: flex-end;
          .it1{
            width: 30%;
            height: 2px;
            background: #F37D2C;
            box-shadow:6px 0px 6px 0px rgba(243,125,44,.6);
          }
          .it2{
            width: 50%;
            height: 2px;
            background: #00C7FF;
            box-shadow:0px 0px 6px 0px rgba(0,183,255,0.6);
            margin: 0 1px;
          }
          .it3{
            width: 20%;
            height: 2px;
            background: #13E38D;
            box-shadow:0px 0px 6px 0px rgba(19,227,141,0.6);
          }
          span{
            width:100%;
            text-align: center;
            position: relative;
            top: -36px;
          }
        }
        &.w-name{
          width: 65px;
        }
        span{
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 5px;
        }
        .lable1{
          background: #F37D2C;
        }
        .lable2{
          background: #00C7FF;
        }
        .lable3{
          background: #13E38D;
        }
      }
      &.border-line{
        height: 24px;
        line-height: 24px;
        border-bottom: 1px solid #4c4c4c;
      }
    }
  }
}

// 小屏幕适配
@media screen and (max-height: 800px) {
  .overview {
    margin-top: 0;
    .body {
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

  .overview .body .table-row .table-col.w-name{
    white-space: nowrap;
    width: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .overview .body .table-row .table-col{
    margin-right: 20px;
  }
}
</style>