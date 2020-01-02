<template>
  <div class="list">
    <div class="card">
      <div class="card-item">
        <div class="item-label">紧急程度</div>
        <div class="item-content qd-iview">
          <RadioGroup size="small"
            v-model="configList[0].focusLvl">
            <Radio label="high">高</Radio>
            <Radio label="middle">中</Radio>
            <Radio label="low">低</Radio>
          </RadioGroup>
        </div>
      </div>
      <!-- <div class="card-item">
        <div class="item-label">联动实时弹框告警</div>
        <div class="item-content qd-iview">
          <RadioGroup v-model="configList[0].relationRealAlarm"
            size="small">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
        </div>
      </div> -->
      <div class="card-item">
        <div class="item-label">联动工单</div>
        <div class="item-content qd-iview">
          <RadioGroup v-model="configList[0].relationOrder"
            size="small">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  props: ['monitorType'],
  data() {
    return {
      configList: [{
        "focusLvl":"middle",
        "relationOrder":"0",
      }],
      tmpConfigListString: '',
      deleteIdList: [],
      id: '',
    }
  },
  components: {
  },
  computed: {
    ...mapGetters(['projectId']),
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    getConfig(monitorType = this.monitorType) {
      this.$http({
        method: 'post',
        url: '/api/json/focusConfApi/getFocusList',
        data: {
          projectId: this.projectId,
          monitorType: monitorType
        }
      }).then(res => {
        if( res.data.focusData &&  res.data.focusData.length > 0) {
          this.configList = res.data.focusData
          this.id = res.data.id
        } else {
          this.configList = [{
            "focusLvl":"middle",
            "relationOrder":"0",
          }]
        }
        // 数组深拷贝
        this.tmpConfigListString = JSON.stringify(this.configList)
      })
    },
  }
}
</script>

<style lang="less" scoped>
.list{
  padding: 30px 0 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  height: 588px;
  overflow-y: auto;
  .card{
    margin: 0 34px 30px;
    width: 260px;
    .card-item{
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      line-height: 28px;

      border-bottom: 1px solid rgba(255,255,255,0.08);
      .item-label{
        width: 112px;
        font-size: 12px;
        color:rgba(255,255,255,0.4);
        &.sub-title{
          font-size:14px;
          color: rgba(255,255,255,0.8);
        }
      }
      .item-content{
        font-size: 12px;
        color:rgba(255,255,255,0.8);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .delete{
        cursor: pointer;
        color: #00B7FF;
      }
    }
  }
  .add-btn{
    width: 260px;
    height: 205px;
    display: flex;
    justify-content: center;
    align-items: center;
    &::before{
      content: '';
      display: block;
      width: 72px;
      height: 72px;
      background-image: url("~@assets/img/demo/city/zoomin.png");
      background-repeat: no-repeat;
      background-size: 50% 50%;
      background-position: center;
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 50%;
    }
  }
}
</style>