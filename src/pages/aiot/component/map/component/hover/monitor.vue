<template>
  <!-- hover 监控 弹框 普通 -->
  <div v-show="show"
    @click.stop
    class="device-model build-model monitor">
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
    <div class="wrap-monitor-img">
      <div class="time"></div>
      <img class="monitor-img" 
        src="~@assets/img/monitor.png" />
    </div>
    <table >
      <thead>
        <tr>
          <th>告警类型</th><th>告警时间</th><th>处理状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(it, idx) in recordList" :key="idx + '-2'">
          <td>{{it.type}}</td>
          <td>{{it.recordTime}}</td>
          <td>{{it.dealStaus}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>

export default {
  props: ['show', 'device'],
  data() {
    return {
      recordList: [{},{},{},{},{}]
    }
  },
  computed: {
  },
  components: {
  },
  mounted() {
  },
  methods: {
    getLogList() {
      this.$http({
        method: 'post',
        url: '/api/json/deviceLogApi/getDeviceLog',
        data: {
          notShowLoading: true,
          projectId: this.projectId,
          index: '',
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
  },
  show(val) {
    if(val) {
      this.getLogList()
    }
  }
}
</script>
<style lang="less" scoped>
.build-model{
  min-height: 459px;
}
</style>
