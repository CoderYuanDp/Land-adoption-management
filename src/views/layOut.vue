<template>
  <headerTab />
  <keep-alive include="messagePage">
    <router-view/>
  </keep-alive>
</template>

<script>
import { defineComponent } from 'vue'
import headerTab from '@/components/headerTab.vue'

export default defineComponent({
  components: { headerTab },
  setup () {

  }
})
</script>

<style lang="less" scoped>

</style>
