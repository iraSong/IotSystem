<template>
  <div class="dialog-tab">
    <div :class="[{'active' : tableTab == 'qdPass' }, 'item-tab border-left']"
      @click="changeTab('qdPass')">实时用梯</div>
    <div :class="[{'active' : tableTab == 'qdLiftRecord' }, 'item-tab']"
      @click="changeTab('qdLiftRecord')">用梯记录</div>
    <div :class="[{'active' : tableTab == 'qdEvent' }, 'item-tab']"
      @click="changeTab('qdEvent')">事件记录</div>
    <div :class="[{'active' : tableTab == 'qdManage' }, 'item-tab border-right']"
      @click="changeTab('qdManage')">设备管理</div>
    <!-- <div :class="[{'active' : tableTab == 'qdLiftUseDateConfig' }, 'item-tab border-right']"
      @click="changeTab('qdLiftUseDateConfig')">开放日设置</div> -->
  </div>
</template>
<script>
export default {
  props: ['changeTab', 'tableTab'],
  data() {
    return {
    }
  },
  mounted() {
    this.changeTab('qdPass')
  },
}
</script>
<style lang="less" scoped>
</style>
