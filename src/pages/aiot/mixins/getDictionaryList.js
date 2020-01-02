export const mixDictionaryList = {
  data() {
    return {
      dictionarylist: []
    }
  },
  computed: {
  },
  methods: {
    getDictionaryList( {dicType = '', dicName = ''} ) {
      console.log('getDictionaryList :' + dicType)
      this.$http({
        method: 'post',
        url: '/api/json/dictionaryApi/getDictionaryList',
        data: {
          dicType,
          dicName
        }
      }).then(res => {
        this.dictionarylist = res.data.list
      })
    },
  },
}

