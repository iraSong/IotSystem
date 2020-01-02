<template>
  <!-- 车闸hover -->
  <div v-if="show"
    @click.stop
    :class="[{'out': direction =='O'}, 'device-model public-device-model cz']">
    <div class="model-block"></div>
    <span class="border border-1"></span>
    <span class="border border-2"></span>
    <span class="border border-3"></span>
    <span class="border border-4"></span>
    <div class="bg-blur"></div>

    <div class="model-title">{{device.deviceProperties.location | parseLocation}}{{device.deviceName}}</div>
    <div class="wrap-table">
      <!-- 出 表格 -->
      <template v-if="direction =='O'">
        <table class="pass-table">
          <thead>
            <tr>
              <th>车牌号</th><th>出场时间</th><th>放行方式</th><th>类型</th><th>收费</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(it, idx) in recordList" 
            :key="idx + '-1'"
            :class="[{'active': currentIdx == idx}]"
            @click="changeCurrent(idx)">
              <td>{{it.vlp}}</td>
              <td>{{it.endTime}}</td>
              <td>{{it.passmode}}</td>
              <td>{{it.cTypeName}}</td>
              <td>{{it.receivableFee}}</td>
            </tr>
          </tbody>
        </table>
        <div class="wrap-face">
          <!-- <img class="face-img"
            src="~@assets/img/demo/car.png" /> -->
          <img v-if="currentDetail && currentDetail.inPictureData" class="face-img"
            :src="currentDetail.inPictureData" />
        </div>
    </template>
      <!-- 入 表格 -->
      <template v-else>
        <table  class="pass-table">
          <thead>
            <tr>
              <th>车牌号</th><th>进场时间</th><th>类型</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(it, idx) in recordList" 
            :key="idx + '-2'" 
            :class="[{'active': currentIdx == idx}]"
            @click="changeCurrent(idx)">
              <td>{{it.vlp}}</td>
              <td>{{it.consumeTime}}</td>
              <td>{{it.cTypeName}}</td>
            </tr>
          </tbody>
        </table>
        <div class="wrap-face">
          <!-- <img class="face-img"
            src="~@assets/img/demo/car.png" /> -->
          <img v-if="currentDetail && currentDetail.inPictureData1" class="face-img"
            :src="currentDetail.inPictureData1" />
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
  props: ['show', 'device'],
  data() {
    return {
      recordList: [],
      currentIdx: 0,
      currentDetail: {},
    }
  },
  computed: {
    ...mapGetters(['projectId']),
    direction() {
      let location = this.device.deviceProperties.location
      if(!location) {
        return 'I'
      }
      if(Array.isArray(location)){
        location = location[0]
      }
      return location.direction
    }
  },
  components: {
  },
  mounted() {
    if(this.show) {
      this.getLogList()
    }
  },
  methods: {
    getLogList() {
      let params = {
        notShowLoading: true,
        projectId: this.projectId,
        index: 'qdh_park_park_data', // 门锁
        sn: this.device.deviceSn,
        mac: this.device.deviceMac,
        pageNo: '1',
        pageSize:'8',
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
          if(this.recordList && this.recordList.length > 0) {
            this.currentDetail = this.recordList[this.currentIdx]
          }
        })
    },
    changeCurrent(idx) {
      this.currentIdx = idx
      this.currentDetail = this.recordList[idx]
    }
  },
  watch: {
    show(val) {
      if(val) {
        this.getLogList()
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
