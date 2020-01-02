<template>
  <!-- 弹框 -->
  <div class="qdDialog" v-if="showConfirm">
    <div class="confirmDialog qd-le">
      <div class="panel-arrow"></div>
      <div class="title">
        {{confirmDevice.deviceProperties.location | parseLocation}}
        {{confirmDevice.deviceName}}
        {{confirmDevice.deviceProperties.type | typeToName}}
        报事
      </div>

      <div class="item-form">
        <div class="label">原因类型</div>
        <el-cascader
          popper-class="qd-cascader"
          :options="options"
          :props="props"
          v-model="selectedOptions">
        </el-cascader>
      </div>

      <div class="item-form">
        <div class="label">报事叙述</div>
        <textarea rows="3"  v-model="remark" placeholder="" />
      </div>

      <div class="footer">
        <button class="cancel footer" @click="toggleShowConfirm">取消</button>
        <button class="confirm" @click="confirm('1')">提交</button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  data() {
    return {
      showPanel: false,
      showWarning: false,

      options: [],
      props: {
        label: 'text',
        value: 'id',
      },
      remark: '',
      selectedOptions: [],
      lvl: 'low',
    }
  },
  computed: {
    ...mapState(['showConfirm', 'confirmDevice']),
    ...mapGetters(['projectId']),
  },
  components: {
  },
  mounted() {
    this.getOrderType()
  },
  methods: {
    ...mapMutations(['toggleShowConfirm']),
    getOrderType() {
      this.$http({
        method:'post',
        url:'/api/json/workOrderApi/getOrderType',
        data:{
          projectId: this.projectId
        }
      })
        .then((res) => {
          // 递归 处理 children = []
          this.dealOption(res.data.list)
          this.options = res.data.list
          console.log(this.options)
        })
    },
    dealOption(list) {
      return list = list.map((el) => {
        if(!el.children || el.children.length === 0) {
          delete el.children
        } else {
          this.dealOption(el.children)
        }
        return el
      })
    },
    confirm(flag) {
      if(this.selectedOptions.length == 0) {
        this.$Message.error('请选择原因类型')
      } else if (!this.remark) {
        this.$Message.error('请填写报事叙述')
      } else {
        this.getLvlConfig(flag)
          .then((res) => {
            if(res.data.alarmConf &&  res.data.alarmConf.length > 0) {
              this.lvl = res.data.alarmConf[0].alarmLvl || 'low'
            } else {
              this.lvl = 'low'
            }
            this.submitConfirm(flag)
          })
      }
    },
    getLvlConfig() {
      return this.$http({
        method: 'post',
        url: '/api/json/alarmConfApi/getAlarmInfo',
        data: {
          projectId: this.projectId,
          alarmType: 'SBLX'
        }
      })
    },
    submitConfirm(flag) {
      this.$http({
        method:'post',
        url:'/api/json/ufoXcApi/confirmAlarmInfo',
        data:{
          id: this.confirmDevice.id,
          projectId: this.projectId,
          flag: flag,
          remark: this.remark,
          orderType: this.selectedOptions[0],
          orderTypeDetail: this.selectedOptions[1],

          orderLvl: this.lvl,
          deviceType: '',
        }
      })
        .then(() => {
          this.$Message.success('操作成功！')
          this.toggleShowConfirm()
        })
    }
  },
  watch: {
    showConfirm(val) {
      console.log('11111111111111111')
      if(val){
        this.remark = ''
        this.selectedOptions = []
        this.getOrderType()
      }
    }
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
}
.confirmDialog{
  position: absolute;
  left:50%;
  top: 50%;
  background: #3b4a55;
  z-index: 1000;
  transform: translate(-50%, -50%);

  width: 574px;
  height: 262px;

  padding: 12px 24px;
  font-size:14px;
  .title{
    line-height: 24px;
    color:rgba(255,255,255,1);
    text-align: center;
    margin-bottom: 8px;
  }
  .panel-arrow{
    width: 0;
    height: 0;
    border-width: 8px;
    border-style: solid;
    border-color: #3b4a55 transparent transparent transparent;
    position: absolute;
    bottom: -15px;
    right: 6%;
    transform: translate(-50%, 0);
    z-index: 1;
  }
  .item-form{
    display: flex;
    justify-content: left;
    margin-bottom: 18px;
    .label{
      font-size: 14px;
      width:90px;
      padding-right:16px;
      text-align: right;
      color:rgba(255,255,255,0.6);
      line-height: 40px;
    }
    input, textarea{
      flex: 1;
      padding-left: 8px;
      font-size:14px;
      border:none;
      outline: none;
      height:32px;
      background:rgba(255,255,255,0.04);
      border-radius:2px;
      border:1px solid rgba(255,255,255,0.08);
      color:rgba(255,255,255,1);
    }
    textarea{
      height: 80px;
      color:rgba(255,255,255,1);
      border-radius:2px;
      border:1px solid rgba(255,255,255,0.08);
    }
  }

  .cancel, .confirm{
    cursor: pointer;
    width: 56px;
    height: 28px;
  }
  .footer{
    position: relative;
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right:16px;
    font-size: 14px;
    .cancel{
      outline:none;
      border-radius:2px;
      border:1px solid rgba(255,255,255,0.4);
      color:rgba(255,255,255,0.8);
      background: transparent;
      margin-right: 16px;
      &.footer{
        width: 56px;
        height: 28px;
      }
    }
    .confirm{
      outline:none;
      border: none;
      color:rgba(255,255,255,1);
      background:#00B7FF;
      border-radius:2px;
      &[disabled] {
        color:rgba(255,255,255,.6);
        background: #419dc1;
      }
    }
  }
}
</style>
