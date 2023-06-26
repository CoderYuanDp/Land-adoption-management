<template>
  <!-- 数据分析 -->
  <div class="container">
    <div class="data-continer">
      <div class="item" v-for="(item,index) in statisticsData" :key="index">
        <div><span v-if="index === 0">￥</span><span class="num">{{item.num}}</span></div>
        <div class="t-title">{{item.title}}</div>
      </div>
    </div>
    <div ref="map" id="map" class="map-container"></div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { message } from 'ant-design-vue'
import * as echarts from 'echarts'
import { getAnaysisData, getPriceData } from '@/api/dataAnaysisApi'

export default defineComponent({
  setup () {
    const statisticsData = ref([{
      num: '--',
      title: '成交额'
    }, {
      num: '--',
      title: '用户数'
    }, {
      num: '--',
      title: '成交数'
    }, {
      num: '--',
      title: '访问量'
    }])
    const map = ref(null)

    let chart

    onMounted(async () => {
      const { list } = await getPriceData().catch(err => {
        message.error(err)
      })
      const date = list[0]
      const data = list[1]
      console.log(date, data)
      const option = {
        tooltip: {
          trigger: 'axis',
          position: function (pt) {
            return [pt[0], '10%']
          }
        },
        title: {
          text: '成交额统计'
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: date
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%']
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100
          }
        ],
        series: [
          {
            name: '日成交额',
            type: 'line',
            symbol: 'none',
            sampling: 'lttb',
            itemStyle: {
              color: 'rgb(54, 172, 60)'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(112, 207, 117, 0.9)'
                },
                {
                  offset: 1,
                  color: 'rgba(112, 207, 117, 0.1)'
                }
              ])
            },
            data: data
          }
        ]
      }
      chart = echarts.init(document.getElementById('map'))
      chart.setOption(option)
    })

    onUnmounted(() => {
      chart.dispose()
    })

    // 获取展示数据
    const getData = () => {
      getAnaysisData().then(res => {
        if (res.success) {
          res.list.forEach((val, index) => {
            statisticsData.value[index].num = val
          })
        } else {
          message.error(res.message)
        }
      }).catch(err => message.error(err))
    }
    getData()

    return {
      statisticsData,
      map
    }
  }
})
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  padding: 20px;
  .data-continer {
    display: flex;
    padding: 20px 40px;
    justify-content: space-between;
    .item {
      width: 200px;
      height: 100px;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
      .num {
        font-size: 20px;
        font-weight: 800;
      }
      .t-title {
        font-size: 12px;
      }
    }
  }
  .map-container {
      width: 100%;
      padding: 0 40px;
      height: 700px;
      color: rgb(54, 172, 60);
    }
}
</style>
