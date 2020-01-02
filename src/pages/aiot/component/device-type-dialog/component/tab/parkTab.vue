<template>
  <div class="dialog-tab">
    <div :class="[{'active' : tableTab == 'qdParkPass' }, 'item-tab border-left']"
      @click="changeTab('qdParkPass')">实时车流</div>
    <div :class="[{'active' : tableTab == 'qdParkRecord' }, 'item-tab']"
      @click="changeTab('qdParkRecord')">出场及收费记录</div>
    <div :class="[{'active' : tableTab == 'qdParkSearch' }, 'item-tab']"
      @click="changeTab('qdParkSearch')">在场车查询</div>
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
    this.changeTab('qdParkPass')
  },
}
</script>
<style lang="less" scoped>
</style>
