<template>
  <div class="qdDialog flex-center"
    @click.self="closeDialog"
    v-if="showAttentionConfig">
    <div class="dialog-main">
      <!-- 标题 -->
      <div class="dialog-title">
        <div class="name">关注信息配置</div>
      <div class="back" @click.stop="closeDialog" ></div>
        <div class="close"
          @click.stop="hide" />
      </div>
      <div  class="dialog-content">
        <div class="left">
          <ul>
            <li
              v-for="(it,idx) in dictionarylist"
              :key="idx"
              :class="[{ 'current': monitorType == it.dicCode }]" 
              @click="changeTab(it.dicCode)">
                {{it.dicName}}
            </li>
            <!-- <li :class="[{ 'current': tableTab == 'qdOldPeople' }]" @click="changeTab('qdOldPeople')">独居老人3天未通行</li>
            <li :class="[{ 'current': tableTab == 'qdAbnormal' }]" @click="changeTab('qdAbnormal')">异常通行</li> -->
          </ul>
        </div>
        <div class="right">
          <!-- 配置内容 -->
          <components :is="tableTab" :monitor-type="monitorType" :key="tableTab" ref="config"/>
          <!-- 保存按钮 -->
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
import qdAttention from './attention-component/attention.vue'
import qdAbnormal from './attention-component/abnormal.vue'
import qdOldPeople from './attention-component/oldPeople.vue'

import { mixDictionaryList } from '../../mixins/getDictionaryList.js'

export default {
  mixins: [mixDictionaryList],
  data() {
    return {
      pageNo: '1',
      pageSize: '10',
      totalCnt: '',
      level: '',
      configList: [{}],

      tableTab: 'qdAttention',
      monitorType: 'GZRQ',
    }
  },
  components: {
    qdAttention,
    qdAbnormal,
    qdOldPeople
  },
  computed: {
    ...mapState(['showAttentionConfig', 'rank']),
    ...mapGetters(['projectId']),
  },
  mounted() {
  },
  methods: {
    ...mapMutations(['hide', 'toggleAttentionConfig']),
    changeTab(monitorType) {
      if(this.monitorType == monitorType) return

      let configString = JSON.stringify(this.$refs.config.configList)
      let tmpConfigString = this.$refs.config.tmpConfigListString
      if(configString === tmpConfigString) {
        // 直接切换tab
        this.doChange(monitorType)
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
            this.doChange(monitorType)
          })
        }).catch(() => {
          this.doChange(monitorType)
        })
      }
    },
    doChange(monitorType) {
      this.monitorType = monitorType
      if(monitorType == 'GZRQ') {
        this.tableTab = 'qdAttention'
      }else if (monitorType == 'DJLR') {
        this.tableTab = 'qdOldPeople'
      }else if(monitorType == 'YCTX') {
        this.tableTab = 'qdAbnormal'
      }
      this.$refs.config.getConfig(monitorType)
    },
    saveConfig() {
      // to do save
      let configData = this.$refs.config.configList
      // let deleteIdList = this.$refs.config.deleteIdList
      let id = this.$refs.config.id
      if(this.monitorType == 'YCTX') {
          // 关注人群配置 人员标签必填
        let valid =  this.validYCTX(configData)
        if(valid) {
          this.$message({
            customClass: 'qd-error-message',
            message: '通行设备必填',
            type: 'error',
          })
        }
        configData.forEach(el => {
          el.focusBeginTime = el.focusTime[0]
          el.focusEndTime = el.focusTime[1]
        })
      }
      if(this.monitorType == 'GZRQ') {
        // 关注人群配置 人员标签必填
       let valid =  this.validGZRQ(configData)
        if(valid) {
          this.$message({
            customClass: 'qd-error-message',
            message: '关注人员标签必填',
            type: 'error',
          })
        }
      }

      let params = {
        projectId: this.projectId,
        monitorType: this.monitorType,
        focusData: configData,
      }
      if(id) {
        params.id = id
      }
      return this.$http({
        method: 'post',
        url: '/api/json/focusConfApi/operateFocusConf',
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
        this.toggleAttentionConfig()
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
            this.toggleAttentionConfig()
          })
        }).catch(() => {
          this.toggleAttentionConfig()
        })
      }
    },
    validGZRQ(configData) {
      let valid = configData.some((value, idx) => {
        if(!value.personalLabel) {
          configData[idx].personalLabel = []
        }
        return !value.personalLabel || value.personalLabel.length == 0
      })
      this.$refs.config.configList = [...configData]
      console.log(this.$refs.config.configList )
      return valid
    },
    validYCTX(configData) {
      let valid = configData.some((value, idx) => {
        if(!value.deviceId) {
          configData[idx].deviceId = ''
        }
        return !value.deviceId || value.deviceId.length == 0
      })
      this.$refs.config.configList = [...configData]
      return valid
    }
  },
  watch: {
    showAttentionConfig(val) {
      if (val) {
        this.getDictionaryList({
          dicType: 'MonitorPassing'
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
    // background: rgba(0,16,31,0.8);
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
            cursor: pointer;
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