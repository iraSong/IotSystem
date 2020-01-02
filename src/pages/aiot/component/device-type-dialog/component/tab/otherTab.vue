<template>
  <div class="dialog-tab">
    <div :class="[{'active' : tableTab == 'qdEvent' }, 'item-tab']"
      @click="changeTab('qdEvent')">事件记录</div>
    <div :class="[{'active' : tableTab == 'qdManage' }, 'item-tab border-right']"
      @click="changeTab('qdManage')">设备管理</div>
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
    console.log('locktab mounted')
    this.changeTab('qdEvent')
  },
}
</script>
<style lang="less" scoped>
</style>