<template>
  <div class="pie" v-show="showPiePanel">
    <div class="bg-blur more"></div>
    <div class="chart">
      <div class="title">性别比例：</div>
      <div ref="sexChart" class="chart"></div>
    </div>

    <div class="chart">
      <div class="title">户籍比例：</div>
      <div ref="houseChart" class="chart"></div>
    </div>

    <div class="chart">
      <div class="title">业主年龄段比例：</div>
      <div ref="ageChart" class="chart"></div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      show: false
    }
  },
  computed: {
    ...mapState(['showPiePanel'])
  },
  mounted() {
    this.initParChart({
      data: [{ value: 51, name: '男性 51%' },{ value: 49, name: '女性 49%' }],
      ref: 'sexChart',
      color: ['#00B7FF', '#FF4646']
    })
    this.initParChart({
      data: [{ value: 68, name: '本地 68%' },{ value: 32, name: '外地 32%' }],
      ref: 'houseChart',
      color: ['#00B7FF', '#F37D2C']
    })
    this.initParChart({
      data: [{ value: 33, name: '儿童 33%' },{ value: 38, name: '青年 38%' },{ value: 29, name: '老年 29%' }],
      ref: 'ageChart',
      color: ['#00B7FF', '#F37D2C', '#13E38D']
    })
  },
  methods: {
    initParChart(params) {
      let chart = echarts.init(this.$refs[params.ref])
      let option = {
        color: params.color,
        grid: {
          left: '0',
          right: '0',
          top: '0',
          bottom: '0',
          containLabel: true
        },
        calculable: true,
        series: [{
            name: 'chart',
            type: 'pie',
            radius: [40, 45],
            center: ['50%', '50%'],
            // roseType: 'radius',
            clockwise: false,
            startAngle: 60,
            label: {
              normal: {
                show: true,
                formatter: function(val) {   //让series 中的文字进行换行
                    return val.name.split(" ").join("\n\n")
                }
              },
            },
            labelLine: {
              normal: {
                show: true,
                length: 5,
                length2: 15,
              },
            },
            data: params.data
          }
        ]
      }
      this.carRate = '45%'
      chart.setOption(option)
    },
  }
}
</script>
<style lang="less" scoped>
.pie{
  position: absolute;
  top: 0;
  right: -230px;
  z-index: 99;

  width:221px;
  background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.12);

  font-size: 12px;
  color:rgba(255,255,255,0.8);

  padding: 16px;
  .chart{
    width: 200px;
    height: 150px;
  }
}
</style>