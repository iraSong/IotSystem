<template>
  <div class="wrap flex-center" @click.self="hide" v-show="showMoreWorkorder">
    <div class="main">
      <div class="left">
        <span class="border border-1"></span>
        <span class="border border-2"></span>
        <span class="border border-3"></span>
        <span class="border border-4"></span>
        <div class="wrap-table">
          <div class="title">
            <div><i class="pass"/>{{rank | rankName}}工单处理</div>
            <i class="close" @click.stop="hide"/>
          </div>
          <div class="body">
            <div class="table-row border-line">
              <div class="table-col w-name">{{rank | rankName}}</div>
              <div class="table-col">工单量</div>
              <div class="table-col">分布：</div>
              <!-- <div class="table-col"><span class="lable1"></span>待处理</div>
              <div class="table-col"><span class="lable2"></span>处理中</div>
              <div class="table-col end"><span class="lable3"></span>已处理</div> -->

              <div class="table-col" 
                v-for="(it, idx) in legendArr" 
                :key="idx">
                <span :class="'lable' + idx"></span>
                  {{it | orderStatus}}
              </div>
            </div>
            <div class="table-row" v-for="(it, idx) in list" :key="idx">
              <div class="table-col w-name">{{it.name}}</div>
              <div class="table-col">{{it.total}}</div>
              <div class="table-col chart">
                <div v-for="(i, idx) in it.statusList" 
                    :key="idx + '-2'" 
                    :class="'it' + idx" 
                    :style="{width: i.count / it.total *100 + '%'}">
                      <span>{{ (i.count / it.total) | perIt}}%</span>
                </div>

                <!-- <div class="it1" :style="{width: it.wait / it.total *100 + '%'}"><span v-show="it.total !=0">{{it | perIt1}}%</span></div>
                <div  class="it2" :style="{width: it.dealing / it.total *100 + '%'}"><span v-show="it.total !=0">{{it | perIt2}}%</span></div>
                <div  class="it3" :style="{width: it.done / it.total *100 + '%'}"><span v-show="it.total !=0">{{it | perIt3}}%</span></div> -->
              </div>
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
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { mapState , mapMutations} from 'vuex'
export default {
  data() {
    return {
      pageNo: '1',
      pageSize: '10',
      totalCnt: '',

      list: [],
      legendArr: [],
    }
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
    perIt(num) {
      return (num * 100).toFixed(0)
    },
  },
  computed: {
    ...mapState(['rank', 'showMoreWorkorder'])
  },
  mounted() {
  },
  methods: {
    ...mapMutations(['hide']),
    getData(pageNo = this.pageNo) {
      this.$http({
        method:'post',
        url:'/api/json/workOrderApi/getOrderInfoStatistic',
        data:{
          cityCode: this.cityCode,
          pageNo: pageNo,
          pageSize: this.pageSize,
          startTime: moment().subtract(2,'years').format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
      })
        .then((res) => {
          this.totalCnt = res.data.totalCnt
          this.dealData(res.data.orderInfo.slice(0,10))
          this.list = res.data.orderInfo.slice(0,10)
        })
    },
    dealData(orderInfo) {
      let set = new Set()
      orderInfo.forEach((item) => {
        item.statusList.forEach((el) => {
          set.add(el.status)
        })
      })
      this.legendArr = [...set]
    },
    pageNoChange(pageNo) {
      this.getData(pageNo)
    },
    
  },
  watch: {
    showMoreWorkorder(val) {
      if(val){
        this.getData()
      }
    }
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
          margin-bottom: 16px;
        }
        i{
          vertical-align: text-bottom;
          display: inline-block;
          width: 18px;
          height: 16px;
          margin-right: 3px;
          background: url("~@assets/img/demo/icon-ord.png");
          background-size: 100% 100%;
          &.close{
            width: 14px;
            height: 15px;
            background: url("~@assets/img/demo/city/close.png");
            background-size: 100% 100%;
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
              margin-right:31px;
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
                .it0{
                  width: 30%;
                  height: 2px;
                  background: #F37D2C;
                  box-shadow:6px 0px 6px 0px rgba(243,125,44,.6);
                }
                .it1{
                  width: 50%;
                  height: 2px;
                  background: #00C7FF;
                  box-shadow:0px 0px 6px 0px rgba(0,183,255,0.6);
                  margin: 0 1px;
                }
                .it2{
                  width: 20%;
                  height: 2px;
                  background: #13E38D;
                  box-shadow:0px 0px 6px 0px rgba(19,227,141,0.6);
                }
                .it3{
                  width: 30%;
                  height: 2px;
                  background: #FF4949;
                  box-shadow:6px 0px 6px 0px rgba(243,125,44,.6);
                }
                .it4{
                  width: 50%;
                  height: 2px;
                  background: #FF004F;
                  box-shadow:0px 0px 6px 0px rgba(0,183,255,0.6);
                  margin: 0 1px;
                }
                .it5{
                  width: 20%;
                  height: 2px;
                  background: #64E111;
                  box-shadow:0px 0px 6px 0px rgba(19,227,141,0.6);
                }
                .it6{
                  width: 20%;
                  height: 2px;
                  background: #13dd8D;
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
                margin-right:5px;
              }
              .lable0{
                background: #F37D2C;
              }
              .lable1{
                background: #00C7FF;
              }
              .lable2{
                background: #13E38D;
              }
              .lable3{
                background: #FF4949;
              }
              .lable4{
                background: #FF004F;
              }
              .lable5{
                background: #64E111;
              }
              .lable6{
                background: #13dd8D;
              }
            }
            &.border-line{
              height: 24px;
              line-height: 24px;
              border-bottom: 1px solid #4c4c4c;
            }
          }
          .wrap-page{
            position: absolute;
            bottom: 20px;
            left: 0;
            right: 0;
            text-align: center;
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

  }
}
</style>