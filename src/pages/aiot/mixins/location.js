export const mixLocation = {
  data() {
    return {
      location: [],
      props: this.getProps()
    }
  },
  computed: {
  },
  methods: {
    getProps() {
      let self = this
      return {
        lazy: true,
        // checkStrictly: true,
        lazyLoad(node, resolve) {
          const { level, value } = node
          if(level == 0) {
            self.getGroup()
              .then((res) => {
                let nodes = res.data.list.map(el => {
                  return {
                    label: el.name,
                    value: el.id,
                    leaf: false,
                  }
                })
                nodes.unshift({
                  label: '全部',
                  value: '全部',
                  leaf: true,
                })
                resolve(nodes)
              })
          } else if(level == 1) {
            self.getBuild()
              .then((res) => {
                let nodes = res.data.list.map(el => {
                  return {
                    label: el.name,
                    value: el.id,
                    leaf: false,
                  }
                })
                nodes.unshift({
                  label: '全部',
                  value: '全部',
                  leaf: true,
                })
                resolve(nodes)
              })
          } else if(level == 2) {
            self.getUnit(value)
              .then((res) => {
                let nodes = res.data.list.map(el => {
                  return {
                    label: el.name,
                    value: el.id,
                    leaf: false,
                  }
                })
                nodes.unshift({
                  label: '全部',
                  value: '全部',
                  leaf: true,
                })
                resolve(nodes)
              })
          } else if(level == 3) {
            self.getRooms(value)
              .then((res) => {
                let nodes = res.data.list.map(el => {
                  return {
                    label: el.name,
                    value: el.id,
                    leaf: true,
                  }
                })
                nodes.unshift({
                  label: '全部',
                  value: '全部',
                  leaf: true,
                })
                resolve(nodes)
              })
          }
        }
      }
    },

    // 获取组团
    getGroup() {
      return this.$http({
        method: 'post',
        url: '/api/json/groupApi/getGroupListByProject',
        data: {
          projectId: this.projectId,
        }
      })
    },
    getBuild(val) {
      return this.$http({
        method: 'post',
        url: '/api/json/buildApi/getBuildListByProjectIdAndGroupId',
        data: {
          projectId: this.projectId,
          groupId: val,
        }
      })
    },
    // 获取单元数据
    getUnit(val) {
      console.log(val)
      return this.$http({
        method: 'post',
        url: '/api/json/unitApi/getUnitListByBuildId',
        data: {
          buildId: val,
        }
      })
    },
    // 获取房间数据
    getRooms(val) {
      return this.$http({
        method: 'post',
        url: '/api/json/roomApi/getUnitRoomList',
        data: {
          unitId: val,
        }
      })
    },
  },
}

