<template>
  <div class="overview">
    <div class="title-people">
      <div><i />{{rank | rankName}}人流量</div>
      <div class="wrap-more" @click="showMore">更多<i class="more" /></div>

    </div>
    <div class="body">
      <div class="table-row border-line">
        <div class="table-col w-name" >{{rank | rankName}}</div>
        <div class="table-col  w-name">人流量</div>
        <div class="table-col">分布：</div>
        <div class="table-col"><span class="lable1"></span>业主</div>
        <div class="table-col"><span class="lable2"></span>访客</div>
      </div>

      <div class="table-row" v-for="(it, idx) in list" :key="idx">
        <div class="table-col w-name" :title="it.city">{{it.city}}</div>
        <div class="table-col  w-name">{{it.total | toThousandFilter}}</div>
        <div class="table-col chart">
          <div class="it1" :style="{width: it.master + '%'}"><span>{{it.master}}%</span></div>
          <div  class="it2" :style="{width: it.guest + '%'}"><span>{{it.guest}}%</span></div>
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
    ...mapState(['rank', 'refresh']),
    ...mapGetters(['cityCode']),
  },
  mounted() {
    this.getData()
  },

  methods: {
    ...mapMutations(['showExceptions']),
    showMore() {
      this.showExceptions()
    },
    getData() {
      this.$http({
        method:'post',
        url:'/api/json/ufoXcApi/getCityOrProjectPassingStatistic',
        data:{
          cityCode: this.cityCode,
          pageNo: '1',
          pageSize: '3',
          startTime: moment().subtract(2,'years').format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
      })
        .then((res) => {
          this.list = this.dealData(res).slice(0,3)
        })
    },
    dealData(res) {
      let list = []
      if(res.data.passing && res.data.passing.length > 0) {
        let cityList = res.data.passing
        cityList.forEach((el)=>{
          let total = el.totalPassing
          let personalList = el.personLabel
          let masterPassing = ''
          let visitorPassing = ''
          personalList.forEach(item => {
            if(item.labelName == '业主') {
              masterPassing = item.labelPassing
            } else if(item.labelName == '访客') {
              visitorPassing = item.labelPassing
            }
          })

          //执行代码
          let obj = {
            city: el.name,
            total: total,
            master: (masterPassing / total * 100).toFixed(0),
            guest: (visitorPassing / total * 100).toFixed(0),
          }
          list.push(obj)
        })
      }
      return list
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
      background: url("~@assets/img/demo/mul-pass.png");
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
          overflow: visible;
          margin-right: 0;
          padding-left: 0;
          padding-bottom: 15px;
          flex: 1;
          display: flex;
          align-items: flex-end;
          .it1{
            width: 30%;
            height: 2px;
            background:rgba(0,183,255,1);
            box-shadow:0px 0px 6px 0px rgba(0,183,255,0.6);
          }
          .it2{
            width: 50%;
            height: 2px;
            background: #13E38D;
            box-shadow:0px 0px 6px 0px rgba(243,125,44,0.6);
            margin: 0 1px;
          }
          .it3{
            width: 1%;
            height: 2px;
            background: #F37D2C;
            box-shadow:0px 0px 6px 0px rgba(243,125,44,0.4);
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
          background: #00B7FF;
        }
        .lable2{
          background: #13E38D;
        }
        .lable3{
          background: #F37D2C;
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