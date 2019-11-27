<template>
  <!-- 弹框 -->
  <div class="qdDialog" v-if="showDialog">
    <deviceList 
      v-show="showList" 
      :select-device="selectDevice"
      @close="hideDialog" 
      @changeDialog="changeDetail" />
    
    <components v-show="!showList" 
      :is="cutComponent"
      :refesh="refesh"
      :device-info="deviceInfo" 
      @doShowList="doShowList"
      @close="hideDialog" />
  </div>
</template>
<script>
import { mapState } from 'vuex'

import deviceList from './deviceList.vue'

import monitor from './dialog-content/monitor.vue'
import access from './dialog-content/access.vue'

export default {
  props: ['selectDevice'],
  data() {
    return {
      showDialog: false,
      showList: true,
      refesh: false,

      deviceInfo: {
        deviceProperties: {
          location: [{}]
        }
      },
    }
  },
  computed: {
    ...mapState(['rank', 'rankName']),
    cutComponent() {
      /* eslint-disable no-unreachable */
      switch(this.deviceInfo.deviceProperties.type) {
        // 通行设备
        case 'doorctl_v2':
          return 'access'
          break
        case 'doorctl':
          return 'access'
          break
        default:
          return 'monitor'
      } 
    }
  },
  components: {
    deviceList,
    monitor,
    access
  },
  mounted() {
  },
  methods: {
    hideDialog() {
      this.showDialog = false
      this.showList = true
    },
    changeDetail(val) {
      this.showList = false
      this.deviceInfo = val
      this.$nextTick(() => {
        this.refesh = !this.refesh 
      })
    },
    doShowList() {
      this.showList = true
    }
  },
  watch: {
  }
}
</script>
<style lang="less" scoped>
.qdDialog{
  color:rgba(255,255,255,0.8);
  &::after{
    content: "";
    position: fixed;
    z-index: 99;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,16,31,0.8);
  }
  /deep/ .dialog-main{
    position: absolute;
    top:50%;
    left:50%;
    z-index: 999;
    transform: translate(-50%, -50%);

    width:1196px;
    height: 554px;
    background:#21313c;
    border-radius:2px;
    border:1px solid rgba(255,255,255,0.08);
    .dialog-title{
      background:#283742;
      .name{
        font-weight:600;
        text-align: center;
        padding: 17px 0;
      }
      .tab{
        .tab-item{
          padding: 0 14px 8px;
          &.active{
            color:#00B7FF;
          }
        }
      }
      .close{
        position: absolute;
        top: 0;
        right: 0;
        width: 50px;
        height: 55px;
        &::before{
          display: block;
          position: absolute;
          content: "";
          top: 24px;
          right: 24px;
          width: 14px;
          height: 15px;
          background: url("~@assets/img/demo/city/close.png");
          background-size: 100% 100%;
        }
      }
    }
    .dialog-content{
      height: 493px;
      overflow: auto;
      padding: 20px 12px;
      .sub-title{
        font-size:12px;
        font-weight:600;
        color:rgba(255,255,255,0.4);
        margin-bottom: 4px;
      }
      .wrap-item{
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        .item{
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0 10px;

          color:rgba(255,255,255,0.8);
          min-width: 171px;
          height: 80px;
          line-height: 80px;
          text-align: center;
          border-radius:1px;
          border:1px solid rgba(255,255,255,0.08);
          margin: 0 12px 24px;
          div{
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          &.red{
            color: #FF4646;
            border:1px solid rgba(255,70,70,0.2);
            span{
              color:rgba(255,70,70,0.5);
            }
          }
          &.room{
            min-width: 94px;
            height: 40px;
            line-height: 40px;
          }
        }
      }
    }
    &.detail{
      .dialog-title{
        .back{
          position: absolute;
          top: 0;
          left: 0;
          width: 50px;
          height: 55px;
          &::before{
            display: block;
            position: absolute;
            top: 20px;
            left: 24px;
            content: '';

            width: 12px;
            height:12px;
            border: 2px solid #fff;
            border-color: #fff #fff transparent  transparent;
            transform: rotate(-135deg);
          }
        }
        .close{
          &::before{
            top: 20px;
          }
        }
      }
      .dialog-content{
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        justify-content: space-between;
        .left{
          width: 700px;
          .device-name{
            line-height: 31px;
            margin-bottom: 8px;
          }
          video, .car-img{
            width: 700px;
            height: 402px;
          }
          .wrap-video{
            position: relative;
            .play-mask{
              position: absolute;
              top:0;
              left:0;
              z-index: 999;
              width: 700px;
              height: 402px;
              background:rgba(0,0,0,0.8);
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
        }
        .right{
          flex: 1;
          font-size: 14px;
          margin-right: 20px;
        }

        .info{
          display: flex;
          justify-content: flex-start;
          margin-bottom: 29px;
          .sn{
            display: flex;
            align-items: flex-end;
            margin-right: 40px;
            .txt{
              font-size: 14px;
            }
            .num{
              font-size: 20px;
            }
          }
        }
        .title-table{
          margin-bottom: 5px;
          .wrap-tab{
            font-size: 12px;
            display: flex;
            .item-tab{
              width: 72px;
              height: 24px;
              line-height: 24px;
              border-radius:0px 2px 2px 0px;
              border:1px solid rgba(255,255,255,1);
              text-align: center;
              &.active{
                color:rgba(31,46,59,1);
                background:rgba(255,255,255,1);
              }
            }
          }
        }
        .wrap-table{
          height: 424px;
          overflow: auto;
        }
        table{
          font-size: 12px;
          width:100%;
          thead{
            tr{
              color:rgba(255,255,255,0.4);
              height: 24px;
              border-bottom:1px solid rgba(255,255,255,0.16);
            }
          }
          tbody{
            tr{
              color:rgba(255,255,255,0.8);
              height: 40px;
            }
          }
        }
      }
    }
  }
}
</style>
