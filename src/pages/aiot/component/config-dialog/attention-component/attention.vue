<template>
  <div class="list">
    <div class="card"
      v-for="(it, idx) in configList"
      :key="idx + 'config'">
      <div class="card-item">
        <div class="item-label sub-title">关注人群 {{idx + 1}}</div>
        <div class="item-content qd-iview"></div>
      </div>

      <div class="card-item">
        <div class="item-label" 
          :ref="'personalLabel'+idx"
          :error="vaildPersonnelLabel(it.personalLabel)">
            关注人员
        </div>
        <div class="item-content qd-iview">
          <CheckboxGroup size="small"
            v-if="dictionarylist"
            v-model="it.personalLabel">
            <Checkbox 
              v-for="(dicIt, idx) in dictionarylist"
              :disabled="judgeDisabled(it.personalLabel, dicIt.dicCode)"
              :key="idx + 'personalLabel'"
              :label="dicIt.dicCode">
              {{dicIt.dicName}}
            </Checkbox>
          </CheckboxGroup>
        </div>
      </div>

      <div class="card-item">
        <div class="item-label">紧急程度</div>
        <div class="item-content qd-iview">
          <RadioGroup size="small"
            v-model="it.focusLvl">
            <Radio label="high">高</Radio>
            <Radio label="middle">中</Radio>
            <Radio label="low">低</Radio>
          </RadioGroup>
        </div>
      </div>
      <div class="card-item">
        <div class="item-label">联动实时弹框告警</div>
        <div class="item-content qd-iview">
          <RadioGroup v-model="it.relationRealAlarm"
            size="small">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
        </div>
      </div>

      <div class="card-item">
        <div class="item-label">联动工单</div>
        <div class="item-content qd-iview">
          <RadioGroup v-model="it.relationOrder"
            size="small">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
        </div>
      </div>

      <div class="card-item"
        @click="deleteItem(it, idx)">
        <div class="delete">删除</div>
      </div>
    </div>
    <div class="add-btn"
      @click="addItem"></div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { mixDictionaryList } from '../../../mixins/getDictionaryList.js'


export default {
  mixins: [mixDictionaryList],
  props: ['monitorType'],
  data() {
    return {
      tmpConfigListString: '', // 用于检查数据是否修改
      configList: [{
        "focusLvl":"middle",
        "relationOrder":"0",
        "relationRealAlarm":"0"
      }],
      deleteIdList: [],
      selectedLabel: [],
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
    this.getPersonnelLabelList()
  },
  methods: {
    addItem() {
      let selected = []
      this.configList.forEach(el => {
        if(el.personalLabel){
          selected = selected.concat(el.personalLabel)
        }
      })
      if(selected.length >= this.dictionarylist.length) {
        this.$message({
          customClass: 'qd-error-message',
          message: '所有人员标签都已被配置，不能新增',
          type: 'error',
        })
      } else {
        this.configList.push({
          "focusLvl":"middle",
          "relationOrder":"0",
          "relationRealAlarm":"0"
        })
      }
    },
    deleteItem(it,idx) {
      if(it.id) {
        this.deleteIdList.push(it.id)
      }
      this.configList.splice(idx, 1)
    },
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
            "relationRealAlarm":"0"
          }]
        }

        // 数组深拷贝
        this.tmpConfigListString = JSON.stringify(this.configList)
      })
    },
    getPersonnelLabelList() {
      this.getDictionaryList({
        dicType: 'personnelLabel'
      })
    },
    judgeDisabled(config, dic) {
      let selected = []
      this.configList.forEach(el => {
        selected = selected.concat(el.personalLabel)
      })
      if(config && config.includes(dic)) {
        return false
      } else {
        return selected.includes(dic)
      }
    },
    vaildPersonnelLabel(personalLabel) {
      if(personalLabel && personalLabel.length == 0) return 'personalLabel'
    }
  },
  watch: {
  }
}
</script>

<style lang="less" scoped>
.list {
  padding: 30px 0 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  height: 588px;
  overflow-y: auto;
  .card {
    margin: 0 34px 60px;
    width: 260px;
    .card-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      line-height: 28px;

      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      .item-label {
        width: 112px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.4);
        white-space: nowrap;
        margin-right: 10px;
        &.sub-title {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
        }
        &[error] {
          color: #FF4646;
        }
      }
      .item-content {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .delete {
        cursor: pointer;
        color: #00b7ff;
      }
    }
  }
  .add-btn {
    cursor: pointer;
    width: 260px;
    height: 205px;
    display: flex;
    justify-content: center;
    align-items: center;
    &::before {
      content: "";
      display: block;
      width: 72px;
      height: 72px;
      background-image: url("~@assets/img/demo/city/zoomin.png");
      background-repeat: no-repeat;
      background-size: 50% 50%;
      background-position: center;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
    }
  }
}
</style>