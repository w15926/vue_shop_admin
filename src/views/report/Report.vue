<template>
  <div>
    <!-- 面包屑导航区域 -->
    <bread-crumb>
      <template #pathTwo>数据统计</template>
      <template #pathThree>数据报表</template>
    </bread-crumb>

    <!-- 卡片视图 -->
    <el-card>
      <div id="main" style="width: 77vw;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import breadCrumb from '@/components/el-ui/BreadCrumb'
// import echarts from 'echarts'
import * as echarts from 'echarts'
import _ from 'lodash'

export default {
  data() {
    return {
      options: { // api文档显示要合并的对象
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {
  },
  async mounted() {
    var myChart = echarts.init(document.getElementById('main'));

    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) return this.$message.error('获取折线图数据失败')

    // 利用第三方插件 lodash先将两个合并，再深拷贝到 result
    const result = _.merge(res.data, this.options)

    myChart.setOption(result);
  },
  methods: {

  },
  components: {
    breadCrumb
  }
}
</script>

<style lang="less" scoped>
</style>