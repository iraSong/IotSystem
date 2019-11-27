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
            <div><i class="pass"/>各{{rank | rankName}}工单处理</div>
            <i class="close" @click.stop="hide"/>
          </div>
          <div class="body">
            <div class="table-row border-line">
              <div class="table-col w-name">{{rank | rankName}}</div>
              <div class="table-col">工单量</div>
              <div class="table-col">分布：</div>
              <div class="table-col"><span class="lable1"></span>待处理</div>
              <div class="table-col"><span class="lable2"></span>处理中</div>
              <div class="table-col end"><span class="lable3"></span>已处理</div>
            </div>
            <div class="table-row" v-for="(it, idx) in list" :key="idx">
              <div class="table-col w-name">{{it.city}}</div>
              <div class="table-col">{{it.total}}</div>
              <div class="table-col chart">
                <div class="it1" :style="{width: it.wait / it.total *100 + '%'}"><span>{{it | perIt1}}%</span></div>
                <div  class="it2" :style="{width: it.dealing / it.total *100 + '%'}"><span>{{it | perIt2}}%</span></div>
                <div  class="it3" :style="{width: it.done / it.total *100 + '%'}"><span>{{it | perIt3}}%</span></div>
              </div>
            </div>
            <!-- <div class="table-row">
              <div class="table-col">深圳</div>
              <div class="table-col">12000</div>
              <div class="table-col chart">
                <div class="it1"><span>2999 / 30%</span></div>
                <div  class="it2"><span>4500 / 50%</span></div>
                <div  class="it3"><span>2000 / 20%</span></div>
              </div>
            </div> -->
            <Page v-if="false" :total="150" size="small" class-name="page"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState , mapMutations} from 'vuex'
export default {
  data() {
    return {
      dataObj: {
        country: [
          {
            city: '重庆',
            total: 535,
            wait: 171,
            dealing: 230,
            done: 134,
          },{
            city: '成都',
            total: 594,
            wait: 208,
            dealing: 297,
            done: 89,
          },{
            city: '西安',
            total: 388,
            wait: 140,
            dealing: 163,
            done: 85,
          },{
            city: '杭州',
            total: 156,
            wait: 44,
            dealing: 61,
            done: 51,
          },{
            city: '北京',
            total: 221,
            wait: 93,
            dealing: 64,
            done: 64,
          },{
            city: '上海',
            total: 103,
            wait: 33,
            dealing: 44,
            done: 26,
          },{
            city: '广州',
            total: 138,
            wait: 55,
            dealing: 52,
            done: 31,
          },{
            city: '常州',
            total: 53,
            wait: 10,
            dealing: 23,
            done: 20,
          },{
            city: '长沙',
            total: 46,
            wait: 15,
            dealing: 20,
            done: 11,
          },{
            city: '衡阳',
            total: 24,
            wait: 7,
            dealing: 10,
            done: 7,
          }
        ],
        city: [{
            city: '北辰三角洲',
            total: 71,
            wait: 23,
            dealing: 30,
            done: 18,
          },{
            city: '水晶郦城',
            total: 37,
            wait: 13,
            dealing: 19,
            done: 5,
          },{
            city: '湘风原著',
            total: 28,
            wait: 10,
            dealing: 12,
            done: 6,
          },{
            city: '托斯卡纳',
            total: 15,
            wait: 4,
            dealing: 6,
            done: 5,
          },{
            city: '凤凰天阶苑',
            total: 20,
            wait: 8,
            dealing: 6,
            done: 6,
          },{
            city: '阳光100',
            total: 9,
            wait: 3,
            dealing: 4,
            done: 2,
          },{
            city: '融科大院',
            total: 11,
            wait: 4,
            dealing: 4,
            done: 3,
          },{
            city: '新湘都',
            total: 5,
            wait: 1,
            dealing: 2,
            done: 2,
          },{
            city: '中城湾',
            total: 5,
            wait: 1,
            dealing: 2,
            done: 2,
          },{
            city: '潇湘星城',
            total: 2,
            wait: 1,
            dealing: 1,
            done: 0,
          }
        ]
      },
      list: []
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
  },
  computed: {
    ...mapState(['rank', 'showMoreWorkorder'])
  },
  mounted() {
    this.list = this.dataObj[this.rank]
  },
  methods: {
    ...mapMutations(['hide']),
  },
  watch: {
    rank(val) {
      this.list = this.dataObj[val]
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
                .it1{
                  width: 30%;
                  height: 4px;
                  background: #00B7FF;
                }
                .it2{
                  width: 50%;
                  height: 4px;
                  background: #13E38D;
                }
                .it3{
                  width: 20%;
                  height: 4px;
                  background: #F37D2C;
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