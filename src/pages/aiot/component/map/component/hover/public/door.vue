<template>
  <!-- hover 二代和四代门禁 弹框 普通 -->
  <div v-if="show"
    @click.stop
    class="device-model public-device-model">
    <div class="model-block"></div>
    <span class="border border-1"></span>
    <span class="border border-2"></span>
    <span class="border border-3"></span>
    <span class="border border-4"></span>
    <div class="bg-blur"></div>

    <div class="model-title">
      {{device.deviceProperties.location | parseLocation}}
      {{device.deviceName}}
      {{device.deviceProperties.type | typeToName}}
    </div>
    <div class="model-item">
      <div class="left">今日人流量：<span class="yantramanav">{{passCount}}</span></div>
      <div></div>
    </div>
    <div class="table-title">最近通行</div>
    <table >
      <thead>
        <tr>
          <th>姓名</th><th>时间</th><th>身份</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(it, idx) in recordList" :key="idx + '-1'">
          <td>{{it.userName}}{{it.phone}}</td>
          <td>{{it.recordTime}}</td>
          <td>{{it.personLabel}}</td>
        </tr>
      </tbody>
    </table>
    
    <!-- <div class="table-title title-bottom">预约通行</div>
    <table >
      <thead>
        <tr>
          <th>姓名</th><th>时间</th><th>来访目的</th><th>来访房屋</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(it, idx) in 5" :key="idx + '-2'">
          <td>招莎薇</td>
          <td>09.01  07:00:01</td>
          <td>保洁</td>
          <td>A1-901</td>
        </tr>
      </tbody>
    </table> -->
  </div>
</template>
<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
  props: ['show', 'device', 'deviceType'],
  data() {
    return {
      recordList: [],
      passCount: '',
    }
  },
  computed: {
    ...mapGetters(['projectId']),
  },
  components: {
  },
  mounted() {
    if(this.show) {
      this.getLogList()
      this.getCurrentDayPassCount()
    }
  },
  methods: {
    getLogType() {
      let type = ''
      let deviceType = this.deviceType
      console.log(deviceType)
      // 通行记录
      if( deviceType == 'doorctl_v2') { 
        // 二代门禁
        type = 'brake_pass_v2'
      } else if(deviceType == 'doorctl') {
        // 四代门禁
        type = 'qdh_sentry_brake_pass'
      } else if(deviceType == 'facegate') {
        // 人脸门口机
        type = 'face_sentry_face_pass'
      } else {
        // 对讲机
        type = 'cloud_talk_unlock_record,qdmgr_local3_unlock_record'
      }
      return type
    },
    getLogList() {
      let logType = this.getLogType()
      let params = {
        notShowLoading: true,
        projectId: this.projectId,
        index: logType, // 门锁
        sn: this.device.deviceSn,
        mac: this.device.deviceMac,
        pageNo: '1',
        pageSize:'5',
        beginTime: moment().subtract(2, 'years').format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      }
      this.$http({
        method: 'post',
        url: '/api/json/deviceLogApi/getDeviceLog',
        data: params
      })
        .then((res) => {
          this.recordList = res.data.recordList
          console.log(logType + '----------------')
          console.log(this.recordList)
           
        })
    },
    getCurrentDayPassCount() {
      let logType = this.getLogType()
      this.$http({
        method:'post',
        url:'/api/json/deviceLogApi/getDeviceLog',
        data:{
          notShowLoading: true,
          projectId: this.projectId,
          index: logType,
          beginTime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
          pageNo: '1',
          pageSize: '10000',
        }
      })
        .then((res) => {
          this.passCount = res.data.totalCnt
        })
    },
  },
  watch: {
    show(val) {
      if(val) {
        this.getLogList()
        this.getCurrentDayPassCount()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.public-device-model{
  min-height: 306px;
}
</style>
