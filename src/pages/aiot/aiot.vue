<template>
  <div class="body ">
    <div :class="[bgClass, {'dim': isDim}, 'layout']" @click="togglePanel">
      <!-- 头部 -->
      <qd-header ref="refHeader"/>
      <!-- 全国地图-->
      <qd-country-map v-if="rank == 'country'"/>
      <!-- 城市高德地图 背景-->
      <qd-city-map v-show="rank == 'city'"/>
      <!-- 社区 地图 -->
      <qd-community-map v-if="rank == 'community'"/>

      <!-- 主体 -->
      <div class="main">
        <!-- 左侧 -->
        <div class="left">
          <qd-overview />
          <qd-people />
          <qd-car />
        </div>

        <!-- 右侧 -->
        <qd-iot />
      </div>
      <!-- 底部  社区-->
      <div class="bottom" v-if="rank == 'community'">
        <qd-exceptions />
        <qd-warning />
        <qd-workorder />
      </div>
      <!-- 底部 全国 和 城市 -->
      <div class="bottom" v-else>
        <qd-exceptions-country />
        <qd-warning-country />
        <qd-workorder-country />
      </div>
    </div>

    <!-- 更多 弹框 -->
    <div v-if="rank == 'community'">
      <qd-more-exceptions />
      <qd-more-warning />
      <qd-more-workorder />
    </div>
    <div v-else>
      <qd-more-exceptions-country />
      <qd-more-warning-country />
      <qd-more-workorder-country />
    </div>

    <!-- 修改密码 弹框 -->
    <qd-modify-password />
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

import qdHeader from './component/header.vue'

import qdCountryMap from './component/map/countryMap.vue'
import qdCityMap from './component/map/cityMap.vue'
import qdCommunityMap from './component/map/communityMap.vue'

import qdOverview from './component/overview.vue'
import qdPeople from './component/people.vue'
import qdCar from './component/car.vue'

import qdIot from './component/iot.vue'
import qdDevice from './component/device.vue'

import qdExceptions from './component/bottom/exceptions.vue'
import qdWorkorder from './component/bottom/workorder.vue'
import qdWarning from './component/bottom/warning.vue'

import qdExceptionsCountry from './component/country-view/exceptions.vue'
import qdWorkorderCountry from './component/country-view/workorder.vue'
import qdWarningCountry from './component/country-view/warning.vue'


import qdMoreExceptions from './component/bottom/moreExceptions.vue'
import qdMoreWorkorder from './component/bottom/moreWorkorder.vue'
import qdMoreWarning from './component/bottom/moreWarning.vue'

import qdMoreExceptionsCountry from './component/country-view/moreExceptions.vue'
import qdMoreWorkorderCountry from './component/country-view/moreWorkorder.vue'
import qdMoreWarningCountry from './component/country-view/moreWarning.vue'
import qdModifyPassword from './component/modifyPassword.vue'

import { toMap } from './mixins/toMap.js'

let timeObj = JSON.parse(window.localStorage.getItem('aiot-time'))
export default {
  components: {
    qdHeader,
    qdCityMap,
    qdCountryMap,
    qdCommunityMap,

    qdOverview,
    qdPeople,
    qdCar,
    qdIot,
    qdDevice,

    qdExceptions,
    qdWorkorder,
    qdWarning,
    qdMoreExceptions,
    qdMoreWorkorder,
    qdMoreWarning,

    qdExceptionsCountry,
    qdWorkorderCountry,
    qdWarningCountry,

    qdMoreExceptionsCountry,
    qdMoreWorkorderCountry,
    qdMoreWarningCountry,
    qdModifyPassword
  },
  mixins: [toMap],
  data() {
    return {
      currentDate: `${timeObj.mon+1}.${timeObj.d}`,
    }
  },
  computed: {
    ...mapState(['rank']),
    ...mapGetters(['isDim']),
    bgClass() {
      /* eslint-disable no-unreachable */
      switch(this.rank) {
        case 'country':
          return 'country'
          break
        case 'city':
          return 'city'
          break
        case 'community':
          return 'community'
          break
        default:
          return ''
      } 
    },
  },
  mounted() {
  },
  methods: {
    ...mapMutations(['togglePiePanel']),
    togglePanel() {
      let refHeader = this.$refs.refHeader
      refHeader.showSearchPanel = false
      refHeader.showMsgPanel = false
      refHeader.showUserPanel =  false
      this.togglePiePanel({
        show: false
      })
    },
  }
}
</script>
<style lang="less" scoped>
// 组件内 css
.bg-blur{
  filter: blur(0px);
  background:rgba(7,78,77,0.3);
  &.red{
    background:rgba(87,5,5,0.3);
  }
}
.body,
.layout {
  user-select: none;
  width: 100%;
  // height: 100%;
  overflow: hidden;
  height: 1080px;
}
.layout {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  position: relative;
  padding: 20px 32px;
  color: #fff;

  &.country{
    // background-image: url("~@assets/img/demo/bg.png");
    // background-size: 100% 100%;
    background: #000;
  }
  &.city{
    // background-image: url("~@assets/img/demo/city/city-bg.png");
    // background-size: 100% 100%;
    background: #000;
  }
  &.community{
    background-image: url("~@assets/img/demo/community/bg.png");
    background-size: 100% 100%;
  }
  &.dim{
    filter: blur(5px)
  }

  .main {
    padding-top: 33px;
    display: flex;
    justify-content: space-between;
    .left {
      position: relative;
      z-index: 9;
      width: 340px;
    }
  }
  .bottom {
    position: relative;
    z-index: 9;
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
    .overview {
      width: 524px;
    }
  }
}
// 小屏幕适配
@media screen and (max-height: 800px) {
  .body,
  .layout {
    height: 768px;
  }
  .layout {
    padding: 10px 32px 0;
    .main .left{
        width: 300px;
      }
    }
    .bottom {
      margin-top: 0 !important;
      .overview {
        width: 412px !important;
      }
    }
}
</style>
<style lang="less">
// 全局 css
@keyframes soundEffect {
  0% {
    width: 10px;
    height: 10px;
    opacity: 1;
  }
  100% {
    width: 26px;
    height: 26px;
    opacity: 0.5;
  }
}
@keyframes soundEffectCity {
  0% {
    width: 28px;
    height: 28px;
    opacity: 1;
  }
  100% {
    width: 36px;
    height: 36px;
    opacity: 0.5;
  }
}

html, body{
  background-color: #000e12;
}
.item-pro {
  cursor: pointer;
  position: relative;
  width: 6px;
  height: 6px;

  background:rgba(0,183,255,1);
  box-shadow:0px 0px 8px 0px rgba(0,183,255,1);
  border-radius: 50%;
  &:hover{
    transform: translate(-2px, -2px);
    width: 10px;
    height: 10px;
  }
  .model-line{
    .line1{
      position: absolute;
      top: -2px;
      left: -11px;
      width: 20px;
      height: 1px;

      background: rgba(0,255,251,1);
      transform: rotate(45deg)
    }
    .line2{
      position: absolute;
      top: -88px;
      left: -9px;
      width: 1px;
      height: 80px;

      background: rgba(0,255,251,1);
    }
    .line3{
      position: absolute;
      top: -96px;
      left: -26px;
      width: 20px;
      height: 1px;

      background: rgba(0,255,251,1);
      transform: rotate(45deg)
    }
    .line4{
      position: absolute;
      top: -103px;
      left: -43px;
      width: 20px;
      height: 1px;

      background: rgba(0,255,251,1);
    }
    &.red{
      .line1{
        top: -2px;
        left: auto;
        right: -13px;
        background: rgba(255,70,70,1);
        transform: rotate(-45deg)
      }
      .line2{
        left: auto;
        right: -10px;
        background: rgba(255,70,70,1);
      }
      .line3{
        left: auto;
        right: -26px;
        background: rgba(255,70,70,1);
        transform: rotate(-45deg)
      }
      .line4{
        left: auto;
        right: -43px;
        background: rgba(255,70,70,1);
      }
    }
    &.device{
      .line1{
        top: -2px;
        left: auto;
        right: -13px;
        background: rgba(0,255,251,1);
        transform: rotate(-45deg)
      }
      .line2{
        left: auto;
        right: -10px;
        background: rgba(0,255,251,1);
      }
      .line3{
        left: auto;
        right: -26px;
        background: rgba(0,255,251,1);
        transform: rotate(-45deg)
      }
      .line4{
        left: auto;
        right: -43px;
        background: rgba(0,255,251,1);
      }
    }
  }
  .sound-effect {
    pointer-events: none;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 26px;
    height: 26px;
    background:rgba(0,199,255,0.12);
    box-shadow:0px 0px 12px 0px rgba(0,199,255,0.4);
    border:1px solid rgba(0,199,255,0.08);

    border-radius: 50%;
    // animation: soundEffect 1.5s ease infinite alternate;
  }
  &.red {
    background:rgba(255,70,70,1);
    box-shadow:0px 0px 8px 0px rgba(255,70,70,1);
    .sound-effect {
      background:rgba(255,70,70,0.12);
      box-shadow:0px 0px 12px 0px rgba(255,70,70,0.4);
      border:1px solid rgba(255,70,70,0.12);
    }
  }
  &.active {
    background: rgba(0, 255, 251, 0.49);
    box-shadow: 0px 0px 4px 0px rgba(0, 255, 251, 0.31);
    border: 1px solid rgba(0, 255, 251, 0.64);
    &.red {
      border: none;   
      background: #ff4646;
      .sound-effect {
        background: rgba(255, 70, 70, 0.3);
        box-shadow: 0px 0px 4px 0px rgba(255, 70, 70, 0.8);
        border: 1px solid rgba(255, 70, 70, 0.4);
      }
    }
  }
  .model {
    padding: 12px 16px;
    width: 214px;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;

      background: url("~@assets/img/demo/model-bg.png");
      background-size:100% 100%;
      filter: blur(12px);
    }
    &.normal {
      position: absolute;
      left: 50%;
      bottom: 20px;
      transform: translate(-50%, 0);
      z-index: 99;
      background:rgba(7,78,77,0.3);
      box-shadow:0px 0px 12px 0px rgba(0,255,251,0.24);
      border:1px solid rgba(0,255,251,1);
      .model-block{
        width: 15px;
        height: 15px;
        position: absolute;
        left:50%;
        bottom: -8px;
        transform: translate(-50%, 0) rotate(225deg);

        background: #034056;
        border-left:1px solid rgba(0,255,251,1);
        border-top:1px solid rgba(0,255,251,1);
        padding:0;
      }
    }
    &.waring {
      position: absolute;
      left: 50%;
      bottom: 20px;
      transform: translate(-50%, 0);

      z-index: 99;
      background:rgba(87,5,5,0.3);
      box-shadow:0px 0px 12px 0px rgba(255,70,70,0.4);
      border:1px solid rgba(255,70,70,1);
      .model-block{
        width: 15px;
        height: 15px;
        position: absolute;
        left:50%;
        bottom: -8px;
        transform: translate(-50%, 0) rotate(225deg);

        background: #20253c;
        border-left:1px solid rgba(255,70,70,1);
        border-top:1px solid rgba(255,70,70,1);
        padding:0;
      }
    }
    &.video{
      width:320px;
      position: absolute;
      left: -362px;
      top: -203px;
      z-index: 99;
      background:rgba(7,78,77,0.7);
      box-shadow:0px 0px 12px 0px rgba(0,255,251,0.24);
      border:1px solid rgba(0,255,251,1);
      .model-block{
        width: 100px;
        height: 100%;
        position: absolute;
        top:0;
        right: -50px;
      }
      video, .car-img{
        width: 288px;
        height: 162px;
      }
      .wrap-video{
        position: relative;
        .play-mask{
          position: absolute;
          top:0;
          left:0;
          z-index: 999;
          width: 288px;
          height: 162px;
          background: #888;
          &::after{
            content: "";
            position: absolute;
            width:66px;
            height:66px;
            top:50%;
            left:50%;
            transform: translate(-50%, -50%);
            background: url("~@assets/img/demo/play.png");
            background-size: 100% 100%;
          }
        }
      }

      .model-title{
        text-align: left;
      }
      .model-item {
        .left{
          width:auto;
        }
      }
      table{
        width: 100%;
        table-layout: auto;
        font-size:12px;
        thead{
          tr{
            border-bottom: 1px solid rgba(255,255,255,0.4);
            td{
              height: 24px;
              color: rgba(255,255,255,0.4);
            }
          }
        }
        tbody{
          tr{
            height:28px;
            td{
              color:rgba(255,255,255,0.8);
            }
          }
        }
      }
    }
    &.city-model{
      top: -140px;
    }

    .model-title {
      text-align: center;
    }
    .model-item {
      display: flex;
      height: 35px;
      line-height: 35px;
      font-size: 20px;

      .atention {
        flex: 1;
        font-size: 12px;
        text-align: right;
      }
      .left {
        font-size: 12px;
        width: 74px;
        text-align: right;
        margin-right: 12px;
      }
    }
  }
  .device-model{
    padding: 12px 16px;
    position: absolute;
    right: -322px;
    top: -193px;
    z-index: 99;
    width:280px;
    background:rgba(7,78,77,0.7);
    box-shadow:0px 0px 12px 0px rgba(0,255,251,0.24);
    border:1px solid rgba(0,255,251,1);
    font-size: 12px;
    .model-block{
      width: 100px;
      height: 100%;
      position: absolute;
      top:0;
      left: -50px;
    }
    .model-title{
      font-size: 16px;
      margin-bottom: 8px;
    }
    .model-item {
      display: flex;
      justify-content: space-between;
      height: 35px;
      line-height: 35px;
      font-size: 12px;
      margin-bottom: 32px;
    }

    .head-img{
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .title-bottom{
      margin-top: 20px;
    }
    table{
      text-align: center;
      width: 100%;
      table-layout: auto;
      thead tr{
        color:rgba(255,255,255,0.4);
        height: 24px;
        border-bottom: 1px solid rgba(255,255,255,0.16);
        th{
          text-align: center;
        }
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
  .waring-model{
    position: absolute;
    right: -395px;
    top: -480px;
    z-index: 999;

    width:352px;
    background:rgba(87,5,5,0.7);
    box-shadow:0px 0px 12px 0px rgba(255,70,70,0.4);
    border:1px solid rgba(255,70,70,1);

    text-align: center;

    .model-block{
      width: 100px;
      height: 100%;
      position: absolute;
      top:0;
      left: -50px;
    }
    .model-title{
      width: 100%;
      height:32px;
      line-height: 32px;
      background:rgba(255,69,69,1);
      margin-bottom: 14px;
    }
    .waring-img{
      width:320px;
      height:159px;
      background:rgba(216,216,216,1);
      border:1px solid rgba(151,151,151,1);
    }
    .model-item {
      padding: 0 16px;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      margin-bottom: 12px;
    }
    .line{
      margin: 12px 16px 24px 16px;
      width:320px;
      height:1px;
      background:rgba(255,255,255,0.16);
    }
    .table-title{
      padding: 0 16px;
      text-align: left;
    }

    .wrap-step{
      margin: 15px auto 0;
      padding:  16px;
      .step-item{
        font-size: 12px;
        margin-bottom: 16px;
        display: flex;
        justify-content: space-between;
        position: relative;
        &.one{
          justify-content: center;
        }
        .step{
          position: relative;
          width: 106px;
          height: 31px;
          line-height: 31px;
          border:1px solid rgba(255,255,255,0.8);
          &.red{
            color: rgba(255,70,70,1); 
            border:1px solid rgba(255,70,70,1);
          }
          &.big{
            width: 160px;
          }
          .step-line{
            width: 1px;
            height: 16px;
            background: rgba(255, 255, 255, 0.8);
            position: absolute;
            left:50%;
            top: 31px;
            &.red{
              background: #FF4646;
            }
            &.step-line1{
              height: 8px;
            }
            &.step-line2{
              height: 1px;
              width: 106px;
              position: absolute;
              left: -26px;
              top: 39px;
            }
            &.step-line3{
              height: 1px;
              width: 106px;
              position: absolute;
              right: -26px;
              top: 39px;
            }
            &.step-line4{
              height: 8px;
              position: absolute;
              left: auto;
              right: -26px;
              top: 39px;
            }
            &.step-line5{
              height: 8px;
              position: absolute;
              left: -26px;
              top: 39px;
            }
            &.step-line6{
              width: 52px;
            }
            &.step-line7{
              top: 40px;
              height: 32px;
              right: 0;
              left: auto;
            }
            &.step-line8{
              height: 141px;
              top: 60px;
              right: 0;
              left: auto;
            }
          }
        }
        .item-step{
          font-size: 12px;
          display: flex;
          align-items: center;
          span{
            display: inline-block;
            background: #fff;
            width: 44px;
            height: 1px;
            &.red{
              background: #FF4646;
            }
          }
        }

      }
    }
  }

  &.city{
    width:26px;
    height: 26px;
    background: url("~@assets/img/demo/city/nor-city.png");
    background-size: 100% 100%;
    // .sound-effect {
    //   animation: soundEffectCity 1.5s ease infinite alternate;
    // }
    &.red {
      background: url("~@assets/img/demo/city/war-city.png");
      background-size: 100% 100%;
    }
    /** 社区 图标 */
    &.hz{
      background: url("~@assets/img/demo/community/hz.png");
      background-size: 100% 100%;
    }
    &.spjk{
      background: url("~@assets/img/demo/community/spjk.png");
      background-size: 100% 100%;
    }
    &.cz{
      background: url("~@assets/img/demo/community/cz.png");
      background-size: 100% 100%;
    }
    &.mj{
      background: url("~@assets/img/demo/community/mj.png");
      background-size: 100% 100%;
    }
  }
}
</style>