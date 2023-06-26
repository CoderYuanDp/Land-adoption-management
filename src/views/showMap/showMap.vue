<template>
  <div class="container">
    <div class="map" id="bdmap"></div>
  </div>
</template>

<script>
import { defineComponent, nextTick, onMounted, ref } from 'vue'
import { getFarmList } from '@/api/farmApi'
import { message } from 'ant-design-vue'
export default defineComponent({
  setup () {
    onMounted(() => {
      nextTick(() => {
        initMap()
      })
    })
    let map
    const initMap = () => {
      map = new window.BMapGL.Map('bdmap', {
        enableRotate: false,
        enableTilt: false
      })
      map.centerAndZoom(new window.BMapGL.Point(116.280190, 40.049191), 6)
      map.enableScrollWheelZoom(true)
      createMarkers()
      // map.setHeading(64.5)
      // map.setTilt(73)
    }
    const farmList = ref([])

    const createMarkers = async () => {
      const { list } = await getFarmList('').catch(err => message.error(err))
      farmList.value = list.map(item => {
        item.lng = Number(item.farm_lan_lng.split(',')[0] || 116.280190)
        item.lat = Number(item.farm_lan_lng.split(',')[1] || 40.049191)
        return item
      })
      const farmIcon = new window.BMapGL.Icon(require('../../assets/icons/farm_icon.png'), new window.BMapGL.Size(32, 32))
      farmList.value.forEach((item) => {
        const marker = new window.BMapGL.Marker(new window.BMapGL.Point(item.lng, item.lat), {
          icon: farmIcon
        })
        map.addOverlay(marker)
        const option = {
          width: 200,
          height: 60,
          title: item.farm_name
        }
        const content = `<div class='a-c' style='width: 190px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;'>地址:${item.farm_address}</div>
          <div class='l-c' style='width: 190px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;'>坐标:${item.farm_lan_lng}</div>`
        const infoWindow = new window.BMapGL.InfoWindow(content, option)
        marker.addEventListener('click', () => {
          map.openInfoWindow(infoWindow, new window.BMapGL.Point(item.lng, item.lat))
        })
      })
    }

    return {
      createMarkers
    }
  }
})
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  padding: 0;
  height: calc(100vh - 46px);
  .map {
    width: 100%;
    height: 100%;
  }
}
.BMap_bubble_title {
  font-weight: 700!important;
  margin-bottom: 10px;
  font-size: 16px;
}
.BMap_bubble_content {
  overflow: hidden !important;
}
.a-c, .l-c {
  width: 190px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
