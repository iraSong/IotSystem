import { mapMutations } from 'vuex'
export const toMap = {
  methods: {
    ...mapMutations(['setRank', 'setRankObj']),
    toMap(rank, rankObj) {
      this.setRank(rank)
      this.setRankObj(rankObj)
    },
  },
}

