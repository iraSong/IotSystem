<template>
  <!-- hover 离线 弹框 普通 -->
  <div v-show="show"
    @click.stop
    class="device-model public-device-model offline">
    <div class="model-block"></div>
    <span class="border border-1 offline"></span>
    <span class="border border-2 offline"></span>
    <span class="border border-3 offline"></span>
    <span class="border border-4 offline"></span>
    <div class="bg-blur"></div>
    <div class="model-title">
      {{device.deviceProperties.location | parseLocation}}
      {{device.deviceName}}
      {{device.deviceProperties.type | typeToName}}
    </div>
    <div class="offline-content">
      <img class="offline-img"
        src="~@assets/img/demo/community/device-icon/offline.png" />
      <div class="offline-txt" v-if="device.relationOrder">{{device.relationOrder.orderStep}}（工单号：<span class="orderNo">{{device.relationOrder.orderNo}}</span>)</div>
      <button class="offline-btn" v-else @click.stop="showConfirmDialog(device)" >报事</button>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  props: ['show', 'device'],
  data() {
    return {
      options: []
    }
  },
  computed: {
    ...mapGetters(['projectId']),
  },
  components: {
  },
  mounted() {
  },
  methods: {
    ...mapMutations(['toggleShowConfirm']),
    showConfirmDialog(device) {
      this.toggleShowConfirm(device)
    }
  },
  watch: {
  }
}
</script>
<style lang="less" scoped>

</style>
