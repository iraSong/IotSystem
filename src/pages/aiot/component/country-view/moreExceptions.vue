<template>
  <div class="wrap flex-center" @click.self="hide" v-show="showMoreExceptions">
    <div class="main">
      <div class="left">
        <span class="border border-1"></span>
        <span class="border border-2"></span>
        <span class="border border-3"></span>
        <span class="border border-4"></span>
        <div class="wrap-table">
          <div class="title">
            <div><i class="pass"/>各{{rank | rankName}}人流量</div>
            <i class="close" @click.stop="hide"/>
          </div>
          <div class="body">
            <div class="table-row border-line">
              <div class="table-col w-name" >{{rank | rankName}}</div>
              <div class="table-col">人流量</div>
              <div class="table-col">分布：</div>
              <div class="table-col"><span class="lable1"></span>业主</div>
              <div class="table-col"><span class="lable2"></span>访客</div>
            </div>

            <div class="table-row" v-for="(it, idx) in list" :key="idx">
              <div class="table-col w-name" :title="it.city">{{it.city}}</div>
              <div class="table-col">{{it.total | toThousandFilter}}</div>
              <div class="table-col chart">
                <div class="it1" :style="{width: it.master + '%'}"><span>{{it.master}}%</span></div>
                <div  class="it2" :style="{width: it.guest + '%'}"><span>{{it.guest}}%</span></div>
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
import { mapState , mapGetters, mapMutations} from 'vuex'

export default {
  data() {
    return {
      pageNo: '1',
      pageSize: '10',
      totalCnt: '',

      list: []
    }
  },
  computed: {
    ...mapState(['rank', 'showMoreExceptions']),
    ...mapGetters(['cityCode']),
  },
  mounted() {
  },
  methods: {
    ...mapMutations(['hide']),
    getData(pageNo = this.pageNo) {
      this.$http({
        method:'post',
        url:'/api/json/ufoXcApi/getCityOrProjectPassingStatistic',
        data:{
          cityCode: this.cityCode,
          pageNo: pageNo,
          pageSize: this.pageSize,
        }
      })
        .then((res) => {
          this.totalCnt = res.data.totalCount
          this.list = this.dealData(res).slice(0,10)
        })
    },
    dealData(res) {
      let list = []
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
      return list
    },
    pageNoChange(pageNo) {
      console.log('change:' +  pageNo)
      this.getData(pageNo)
    }
  },
  watch: {
    showMoreExceptions(val) {
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
        display: flex;
        flex-direction: column;
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
          background: url("~@assets/img/demo/mul-pass.png");
          background-size: 100% 100%;
          &.close{
            width: 14px;
            height: 15px;
            background: url("~@assets/img/demo/city/close.png");
            background-size: 100% 100%;
          }
        }

        .body{
          flex: 1;
          font-size: 12px;
          .table-row{
            display: flex;
            height: 48px;
            line-height: 48px;
            .table-col{
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              margin-right: 10px;
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
                  height: 4px;
                  background: #00B7FF;
                  box-shadow:0px 0px 6px 0px rgba(0,183,255,0.32);
                }
                .it2{
                  width: 50%;
                  height: 4px;
                  background: #13E38D;
                  box-shadow:0px 0px 6px 0px rgba(19,227,141,0.2);
                }
                .it3{
                  width: 1%;
                  height: 4px;
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
                width: 4px;
                height: 4px;
                border-radius: 50%;
                margin-right:5px;
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