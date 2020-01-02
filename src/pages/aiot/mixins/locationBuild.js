export const mixLocationBuild = {
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
                resolve(nodes)
              })
          } else if(level == 1) {
            self.getBuild(value)
              .then((res) => {
                let nodes = res.data.list.map(el => {
                  return {
                    label: el.name,
                    value: el.id,
                    leaf: true,
                  }
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
    }
  },
}

