<template>
  <div class="qdDialog flex-center"
    @click.self="hide"
    v-if="showDeviceTypeDialog">
    <div class="dialog-main">
      <div class="fixed">
        <!-- 标题 -->
        <div class="dialog-title">
          <div class="name">{{deviceInfo.device}}</div>
          <div class="close"
            @click.stop="hide" />
        </div>
        <!-- tab -->
        <components 
          :is="cutTab"
          :table-tab ="tableTab"
          :changeTab="changeTab"/>

      </div>

     <!-- 内容 -->
      <components :is="tableTab" />

    </div>
  </div>
</template>
<script>

import { mapState, mapGetters, mapMutations } from 'vuex'
import passTab from './component/tab/accessTab'
import lockerTab from './component/tab/lockerTab'
import otherTab from './component/tab/otherTab'
import waterWattTab from './component/tab/waterWattTab'
import liftTab from './component/tab/liftTab'
import parkTab from './component/tab/parkTab'

import qdPass from './component/pass.vue'
import qdRecord from './component/record.vue'
import qdEvent from './component/event.vue'
import qdManage from './component/manage.vue'
import qdOpen from './component/open.vue'
import qdRead from './component/read.vue'
import qdUse from './component/use.vue'
import qdLiftRecord from './component/liftRecord.vue'
import qdLiftUseDateConfig from './component/liftUseDateConfig.vue'

import qdParkPass from './component/parkPass.vue'
import qdParkSearch from './component/parkSearch.vue'
import qdParkRecord from './component/parkRecord.vue'

export default {
  data() {
    return {
      pageNo: '1',
      pageSize: '10',
      totalCnt: '',

      tableTab: 'qdPass', // qdPass qdRecord qdEvent qdManage qdOpen qdRead qdUse
    }
  },
  components: {
    passTab,
    lockerTab,
    otherTab,
    waterWattTab,
    liftTab,
    parkTab,

    qdPass,
    qdRecord,
    qdEvent,
    qdManage,
    qdOpen,
    qdRead,
    qdUse,
    qdLiftRecord,
    qdLiftUseDateConfig,
    qdParkPass,
    qdParkSearch,
    qdParkRecord,
  },
  computed: {
    ...mapState(['showDeviceTypeDialog', 'deviceInfo', 'rank']),
    ...mapGetters(['projectId']),
    cutTab() {
      /* eslint-disable no-unreachable */
      switch(this.deviceInfo.deviceType) {
        // 电梯
        case 'lift':
          return 'liftTab'
          break
        // 停车
        case 'park':
          return 'parkTab'
          break
        // 水电表
        case 'water':
          return 'waterWattTab'
          break
        case 'hotwater':
          return 'waterWattTab'
          break
        case 'elec':
          return 'waterWattTab'
          break
        // 门锁
        case 'locker':
          return 'lockerTab'
          break
        // 通行设备
        case 'doorctl_v2':
          return 'passTab'
          break
        case 'doorctl':
          return 'passTab'
          break
        case 'facegate':
          return 'passTab'
          break
        case 'facesentry':
          return 'passTab'
          break
        case 'unitdoorwaymacchine':
          return 'passTab'
          break
        case 'villadoorwaymacchine':
          return 'passTab'
          break
        case 'fencingdoorwaymacchine':
          return 'passTab'
          break
        case 'facedoorwaymachine':
          return 'passTab'
          break
        // 其他默认
        default:
          return 'otherTab'
      } 
    }
  },
  mounted() {
  },
  methods: {
    ...mapMutations(['hide']),
    changeTab(tab) {
      this.tableTab = tab
    },
  },
  watch: {
    showDeviceTypeDialog(val) {
      if (val) {
        // 
      }
    }
  }
}
</script>

<style lang="less" scoped>
.qdDialog {
  color: #fff;
  .dialog-main {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: 100vh;
    overflow: hidden;

    // background:#02111d;
    background:rgba(0, 16, 31, .8);
    border-radius: 2px;
    border: 1px solid rgba(255, 255, 255, 0.08);

    display: flex;
    flex-direction: column;
    padding-top: 0;

    // min-height: 1080px;

    // &::after {
    //   background: url("~@assets/img/demo/bg-device-type.png") 0 / cover fixed;
    //   content: "";
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    //   width: 100%;
    //   height: 100%;
    //   filter: blur(20px);
    //   background-position: 332px -35px;
    // }
    .fixed{
      // background:#02111d;
      // position: fixed;
      // top:0;
      // left:0;
      // width: 100%;
      // z-index: 1;
    }
    .dialog-title {
      .name {
        font-size: 20px;
        font-weight: 600;
        text-align: center;
        padding: 17px 0;
      }
      .close {
        cursor: pointer;
        position: absolute;
        top: 24px;
        right: 24px;
        width: 14px;
        height: 15px;
        background: url("~@assets/img/demo/city/close.png");
        background-size: 100% 100%;
      }
    }

    /deep/ .dialog-tab {
      font-size: 12px;
      display: flex;
      justify-content: center;
      padding-bottom: 24px;
      .item-tab {
        cursor: pointer;
        padding: 2px 10px;

        border: 1px solid rgba(255, 255, 255, 1);
        text-align: center;
        color:rgba(255,255,255,0.8);
        &.border-left {
          border-radius: 2px 0px 0px 2px;
        }
        &.border-right {
          border-radius: 0px 2px 2px 0px;
        }
        &.active {
          color:#1F2E3B;
          background: rgba(255, 255, 255, 1);
        }
      }
    }
  }
  .dialog-content {
    overflow: auto;
  }
}

.wrap-page {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
}
.page {
  margin-top: 12px;
  text-align: center;
  /deep/ .ivu-page-next,
  /deep/ .ivu-page-prev,
  /deep/ .ivu-page-item {
    background: transparent;
  }
}

// 小屏幕适配
@media screen and (max-height: 800px) {
  .qdDialog {
    color: #fff;
    .dialog-main {
      // min-height: 768px;
    }
  }
}
</style>