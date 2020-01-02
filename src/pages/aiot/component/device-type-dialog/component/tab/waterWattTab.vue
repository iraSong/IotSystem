<template>
  <div class="dialog-tab">
    <div :class="[{'active' : tableTab == 'qdRead' }, 'item-tab']"
      @click="changeTab('qdRead')">读表数据</div>
    <div :class="[{'active' : tableTab == 'qdUse' }, 'item-tab']"
      @click="changeTab('qdUse')">用量数据</div>
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
    this.changeTab('qdRead')
  },
}
</script>
<style lang="less" scoped>
</style>