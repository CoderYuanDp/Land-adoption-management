<template>
  <div class="map-select">
    <a-button type="primary" @click="showSelectDig">选择位置</a-button>
    <a-modal v-model:visible="digVisiable" width="800px" title="选择地点" :maskClosable="false" @ok="ok">
      <div class="map-container" id="selectmap"></div>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, nextTick, ref, watch } from 'vue'

export default defineComponent({
  setup (props, { emit }) {
    const digVisiable = ref(false)
    const showSelectDig = () => {
      digVisiable.value = true
    }

    watch(digVisiable, (newVal, oldVal) => {
      if (newVal) {
        nextTick(() => {
          initMap()
        })
      }
    })

    let map
    let marker
    const initMap = () => {
      map = new window.BMapGL.Map('selectmap', {
        enableRotate: false,
        enableTilt: false
      })
      map.centerAndZoom(new window.BMapGL.Point(116.280190, 40.049191), 6)
      map.enableScrollWheelZoom(true)
      map.addEventListener('click', function (e) {
        map.clearOverlays()
        marker = new window.BMapGL.Marker(new window.BMapGL.Point(e.latlng.lng, e.latlng.lat))
        map.addOverlay(marker)
        emit('selectedLatlng', e.latlng)
      })
    }

    const ok = () => {
      digVisiable.value = false
    }
    return {
      digVisiable,
      showSelectDig,
      ok
    }
  }
})
</script>

<style lang="less" scoped>
.map-select {
  margin-top: 10px;
}
.map-container {
    width: 752px;
    height: 500px;
  }
</style>
