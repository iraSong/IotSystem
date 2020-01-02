<template>
  <!-- hover 梯控 弹框 普通 -->
  <div v-show="show"
    @click.stop
    class="device-model build-model">
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
    <div class="table-title">最近用梯</div>
    <table >
      <thead>
        <tr>
          <th>时间</th><th>姓名</th><th>用梯方式</th><th>目的楼层</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(it, idx) in recordList" :key="idx + '-2'">
          <td>{{it.recordTime}}</td>
          <td>{{it.useName}}</td>
          <td>{{it.type}}</td>
          <td>{{it.floor}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
  props: ['show', 'device', 'deviceType'],
  data() {
    return {
      recordList: [{},{},{},{},{}]
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
    getLogList() {
      this.$http({
        method: 'post',
        url: '/api/json/deviceLogApi/getDeviceLog',
        data: {
          notShowLoading: true,
          projectId: this.projectId,
          index: 'qdh_lift_lift_passing_data',
          pageNo: '1',
          pageSize: '5',
          beginTime: moment().subtract(2, 'years').format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
      })
        .then((res) => {
          this.recordList = res.data.recordList
        })
    },
    getCurrentDayPassCount() {
      this.$http({
        method:'post',
        url:'/api/json/deviceLogApi/getDeviceLog',
        data:{
          notShowLoading: true,
          projectId: this.projectId,
          index: 'qdh_lift_lift_passing_data',
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
.build-model{
  min-height: 306px;
}
</style>
