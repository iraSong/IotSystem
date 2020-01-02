<template>
  <div class="list">
    <div class="card"
      v-for="(it, idx) in configList"
      :key="idx + 'config'">
      <div class="card-item">
        <div class="item-label sub-title">异常通行 {{idx + 1}}</div>
        <div class="item-content qd-iview"></div>
      </div>

      <div class="card-item">
        <div class="item-label" :error="it.deviceId  === ''">通行设备</div>
        <div class="item-content qd-filter-el qd-select">
          <el-select v-model="it.deviceId" placeholder="" size="small" popper-class="pwdType">
            <el-option
              v-for="item in passDeviceList"
              :key="item.id"
              :label="getDeviceLocation(item)"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>

      <div class="card-item">
        <div class="item-label">关注时段</div>
        <div class="item-content qd-iview">
          <TimePicker
            format="HH:mm"
            v-model="it.focusTime"
            @on-change="handleChange"
            type="timerange"
            placement="bottom-end"
            placeholder="请选择"
            style="width: 168px"></TimePicker>
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
      <!-- <div class="card-item">
        <div class="item-label">联动实时弹框告警</div>
        <div class="item-content qd-iview">
          <RadioGroup v-model="it.relationRealAlarm"
            size="small">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
        </div>
      </div> -->

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

export default {
  props: ['monitorType'],
  data() {
    return {
      tmpConfigListString: '', // 用于检查数据是否修改
      configList: [{
        "focusBeginTime":"00:00",
        "focusEndTime":"23:59",
        "focusTime": ["00:00", "23:59"],
        "focusLvl":"high",
        "personalLabel":[],
        "relationOrder":"0",
      }],
      // deleteIdList: [],
      selectedLabel: [],

      passDeviceList: [], // 通行设备列表
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
    this.getListData()
  },
  methods: {
    handleChange(val) {
      console.log(val)
    },
    addItem() {
      this.configList.push({
        "focusBeginTime":"00:00",
        "focusEndTime":"23:59",
        "focusTime": ["00:00", "23:59"],
        "focusLvl":"high",
        "personalLabel":[],
        "relationOrder":"0",
      })
    },
    deleteItem(it,idx) {
      console.log(idx)
      // if(it.id) {
      //   this.deleteIdList.push(it.id)
      // }
      console.log(this.configList)
      this.configList.splice(idx, 1)
      console.log(this.configList)
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
            "focusBeginTime":"00:00",
            "focusEndTime":"23:59",
            "focusTime": ["00:00", "23:59"],
            "focusLvl":"high",
            "personalLabel":[],
            "relationOrder":"0",
          }]
        }

        this.configList.forEach(el => {
          el.focusTime = [el.focusBeginTime, el.focusEndTime]
          if(el.device && el.device.id) {
            el.deviceId = el.device.id
          }
        })

        // 数组深拷贝
        this.tmpConfigListString = JSON.stringify(this.configList)
      })
    },

    getListData() {
      this.$http({
        method:'post',
        url:'/api/json/platformDeviceApi/getDeviceList',
        data:{
          projectId: this.projectId,
          sysType: 'doorctl_v2,doorctl,facesentry,facegate,unitdoorwaymacchine,fencingdoorwaymacchine,facedoorwaymachine',
          pageNo: '1',
          pageSize: '1000',
        }
      })
        .then((res) => {
          this.passDeviceList = res.data.deviceList
        })
    },
    getDeviceLocation(item){
      let location = item.deviceProperties.location
      let address = ''
      let typeName = this.typeToName(item.deviceProperties.type)

      if(Array.isArray(location)){
        location = location[0]
      }
      if(location.groupName){
        address += `${location.groupName}/`
      }
      if(location.buildName){
        address += `${location.buildName}/`
      }
      if(location.unitName){
        address += `${location.unitName}/`
      }
      if(location.gateName){
        address += `${location.gateName}/`
      }
      if(location.roomName){
        address += `${location.roomName}/`
      }
      return address + item.deviceName + typeName
    },
    typeToName(type) {
      /* eslint-disable no-unreachable */
      switch(type) {
        // 通行设备
        case 'doorctl_v2':
          return '门禁二代'
          break
        case 'doorctl':
          return '门禁四代'
          break
        case 'facegate':
          return '人脸门口机'
          break
        case 'facesentry':
          return '人脸门禁机'
          break
        case 'alarmgateway':
          return '报警网关'
          break
        case 'roommastermachhine':
          return '家庭主机'
          break
        case 'roommastermachine':
            return '家庭主机'
            break
        case 'roompad':
          return '家庭平板'
          break
        case 'roomslavermachine':
          return '家庭从机'
          break
        case 'unitdoorwaymacchine':
          return '单元门口机'
          break
        case 'villadoorwaymacchine':
          return '别墅门口机'
          break
        case 'fencingdoorwaymacchine':
          return '围墙机门口机'
          break
        case 'facedoorwaymachine':
          return '围墙人脸门口机'
          break
        case 'propertymaster':
          return '物业主机 '
          break
        case 'gateway':
          return '水电表网关'
          break
        case 'water':
          return '冷水表'
          break
        case 'hotwater':
          return '热水表'
          break
        case 'elec':
          return '电表'
          break
        case 'locker':
          return '门锁'
          break
        case 'lockergateway':
          return '门锁网关'
          break
        case 'qdh-padmgmt':
          return '智享家平板'
          break
        case 'park':
          return '车闸'
          break
        case 'lift':
          return '电梯'
          break
        case 'video':
          return '监控'
          break
        case 'watercollector':
          return '水表采集器'
          break
        case 'eleccollector':
          return '电表采集器'
          break
        case 'eyecloud':
          return '千里眼'
          break
          
        default:
          return type
      }
    }
  }
}
</script>

<style lang="less" scoped>
.list {
  padding: 34px 0 16px;
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