<template>
  <div class="qdDialog flex-center"
    @click.self="closeDialog"
    v-if="showWarningConfig">
    <div class="dialog-main">
      <!-- 标题 -->
      <div class="dialog-title">
        <div class="name">告警信息配置</div>
        <div class="back"
          @click.stop="closeDialog"></div>
        <div class="close"
          @click.stop="hide" />
      </div>
      <div class="dialog-content">
        <div class="left">
          <ul>
            <li
              v-for="(it,idx) in dictionarylist"
              :key="idx"
              :class="[{ 'current': monitorType == it.dicCode }]" 
              @click="changeTab(it.dicCode)">
                {{it.dicName}}
            </li>


            <!-- <li :class="[{ 'current': configType == 'offLine' }]"
              @click="configType = 'offLine'">设备离线</li>
            <li :class="[{ 'current': configType == 'fault' }]"
              @click="configType = 'fault'">设备故障</li>
            <li :class="[{ 'current': configType == 'low' }]"
              @click="configType = 'low'">门锁低电量</li>
            <li :class="[{ 'current': configType == 'water' }]"
              @click="configType = 'water'">7 天以上无用水</li>
            <li :class="[{ 'current': configType == 'elec' }]"
              @click="configType = 'elec'">7 天以上无用电</li>
            <li :class="[{ 'current': configType == 'door' }]"
              @click="configType = 'door'">7 天以上未开门</li>
            <li :class="[{ 'current': configType == 'tooWater' }]"
              @click="configType = 'tooWater'">用水量过高</li>
            <li :class="[{ 'current': configType == 'tooElec' }]"
              @click="configType = 'tooElec'">用电量过高</li>
            <li :class="[{ 'current': configType == 'check' }]"
              @click="configType = 'check'">移动侦测</li> -->
          </ul>
        </div>
        <div class="right">
          <!-- 内容 -->
          <components :is="crtCompoment"
            :key="crtCompoment"
            :monitor-type="monitorType"
            ref="config"/>

          <div class="btns">
            <button class="save-btn" @click="saveConfig">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { mapState, mapGetters, mapMutations } from 'vuex'
import qdConfig1 from './waring-component/config1.vue'
import qdConfig2 from './waring-component/config2.vue'
import qdConfig3 from './waring-component/config3.vue'

import { mixDictionaryList } from '../../mixins/getDictionaryList.js'
export default {
  mixins: [mixDictionaryList],
  data() {
    return {
      pageNo: '1',
      pageSize: '10',
      totalCnt: '',

      monitorType: 'YDZC',
    }
  },
  components: {
    qdConfig1,
    qdConfig2,
    qdConfig3
  },
  computed: {
    ...mapState(['showWarningConfig', 'rank']),
    ...mapGetters(['projectId']),
    crtCompoment() {
      /* eslint-disable no-unreachable */
      switch (this.monitorType) {
        // 通行设备
        case 'SBLX':
          return 'qdConfig1'
          break
        case 'SBGZ':
          return 'qdConfig1'
          break
        case 'MSDDL':
          return 'qdConfig2'
          break
        case '7TYSWYS':
          return 'qdConfig2'
          break
        case '7TYSWYD':
          return 'qdConfig1'
          break
        case '7TYSWKM':
          return 'qdConfig2'
          break
        case 'YSLGG':
          return 'qdConfig1'
          break
        case 'YDLGG':
          return 'qdConfig1'
          break
        case 'YDZC':
          return 'qdConfig3'
          break
        default:
          return 'qdConfig1'
      }
    },
  },
  mounted() {
  },
  methods: {
    ...mapMutations(['hide', 'toggleWarningConfig']),
    changeTab(dicCode) {
      if(this.monitorType == dicCode) return
      let configString = JSON.stringify(this.$refs.config.configList)
      let tmpConfigString = this.$refs.config.tmpConfigListString

      if(configString === tmpConfigString) {
        // 直接切换tab
        this.doChange(dicCode)
      } else {
        // 提示是否保存
        this.$confirm('是否保存已修改内容', '', {
          showClose: false,
          customClass: 'qd-message-box',
          closeOnClickModal: false,
          confirmButtonText: '保存',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // do save
          this.saveConfig().then(() => {
              this.doChange(dicCode)
            })
        }).catch(() => {
          this.doChange(dicCode)
        })
      }
    },
    doChange(dicCode) {
      this.monitorType = dicCode
      this.$refs.config.getConfig(dicCode)
    },
    saveConfig() {
      // to do save
      let configData = this.$refs.config.configList
      // let deleteIdList = this.$refs.config.deleteIdList
      let id = this.$refs.config.id
      if(this.monitorType == 'YDZC') {
        configData.forEach(el => {
          el.focusBeginTime = el.focusTime[0]
          el.focusEndTime = el.focusTime[1]
        })
      }

      let params = {
        projectId: this.projectId,
        alarmData: configData,
        alarmType: this.monitorType,
      }
      if(id) {
        params.id = id
      }
      console.log(configData)
      return this.$http({
        method: 'post',
        url: '/api/json/alarmConfApi/operateAlarmConf',
        data: params
      }).then((res) => {
        if (res.data && res.data.result && res.data.result === "1001") {
          this.$refs.config.getConfig()
          this.$Message.success("保存成功！")
        } else {
          this.$message({
            customClass: 'qd-error-message',
            message: res.msg,
            type: 'error',
          })
        }
      })
    },
    closeDialog() {
      let configString = JSON.stringify(this.$refs.config.configList)
      let tmpConfigString = this.$refs.config.tmpConfigListString
      if(configString === tmpConfigString) {
        // 直接关闭
        this.toggleWarningConfig()
      } else {
        // 提示是否保存
        this.$confirm('是否保存已修改内容', '', {
          showClose: false,
          customClass: 'qd-message-box',
          closeOnClickModal: false,
          confirmButtonText: '保存',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // do save
            this.saveConfig().then(() => {
              this.toggleWarningConfig()
            })
        }).catch(() => {
          this.toggleWarningConfig()
        })
      }
    }
  },
  watch: {
    showWarningConfig(val) {
      if (val) {
        this.getDictionaryList({
          dicType: 'AlarmConf'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.qdDialog{
  color: #fff;
  &::before{
    content: "";
    position: fixed;
    z-index: 99;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,16,31,0.8);
  }
  .dialog-main{
    position: absolute;
    top:50%;
    left:50%;
    z-index: 999;
    transform: translate(-50%, -50%);

    background:rgba(0,16,31,0.8);
    border-radius:2px;
    border:1px solid rgba(255,255,255,0.08);

    display: flex;
    flex-direction: column;

    width: 1196px;
    height: 700px;
    .dialog-title{
      background: #273641;
      .name{
        font-size:20px;
        font-weight:600;
        text-align: center;
        padding: 13px 0;
      }
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
        position: absolute;
        top: 24px;
        right: 24px;
        width: 14px;
        height: 15px;
        background: url("~@assets/img/demo/city/close.png");
        background-size: 100% 100%;
      }
    }

    .dialog-content{
      font-size: 14px;
      opacity: .8;
      background: #1f2d39;
      flex: 1;
      display: flex;
      justify-content: flex-start;
      
      .left{
        width:192px;
        height:643px;
        background:rgba(12,28,42,0.6);
        color:rgba(255,255,255, .8);
        ul{
          list-style: none;
          li{
            padding: 0 23px;
            height: 48px;
            line-height: 43px;
            &.current{
              color: #00B7FF;
              background:rgba(255,255,255,0.04);
            }
          }
        }
      }

      .right{
        font-size: 12px;
        flex: 1;
        position: relative;
        .btns{
          padding: 13px 0;
          margin: 0 32px;
          border-top: 1px solid rgba(255,255,255,0.08);
          .save-btn{
            font-size: 12px;
            cursor: pointer;
            background: transparent;
            width: 56px;
            height: 28px;
            border-radius:2px;
            border:1px solid rgba(0,183,255,1);
            color: #00B7FF;
          }
        }
      }
    }
  }

}

// 小屏幕适配
@media screen and (max-height: 800px) {
  .qdDialog {
    color: #fff;
  }
}
</style>