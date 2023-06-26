<template>
  <div class="tab-header">
    <div class="l-m">
      <div class="logo">
        <img src="../assets/logo.png" alt="" />
      </div>
      <div class="menu">
        <a-menu mode="horizontal" v-model:selectedKeys="current" active-text-color="rgb(112,207,117)">
          <template v-for="menu in menuList" :key="menu.path">

            <a-menu-item v-if="!menu.children" :key="menu.path">
              <router-link :to="menu.path">{{
                menu.name
              }}</router-link>
            </a-menu-item>

            <a-sub-menu v-else :key="menu.path">
              <template #title>{{menu.name}}</template>
              <a-menu-item-group>
                <a-menu-item v-for="item in menu.children" :key="item.path"
                  ><router-link :to="item.path">{{
                    item.name
                  }}</router-link></a-menu-item
                >
              </a-menu-item-group>
            </a-sub-menu>

          </template>
        </a-menu>
      </div>
    </div>
    <div class="operation">
      <a-popover placement="bottom">
        <template #title>
          <span>通知</span>
        </template>
        <template #content>
          <div class="news-item">通知1</div>
          <div class="news-item">通知2</div>
        </template>
        <bell-filled />
      </a-popover>
      <a-badge :dot="showDot"><mail-filled @click="toMessagePage"/></a-badge>
      <export-outlined @click="loginOut"/>
      <span class="user-name">{{userInfo.manager_nickname}}</span>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { BellFilled, MailFilled, ExportOutlined } from '@ant-design/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import store from '@/store'

export default defineComponent({
  components: { BellFilled, MailFilled, ExportOutlined },
  setup () {
    const menuList = [
      { name: '数据报表', path: '/dataAnalysis' },
      { name: '用户管理', path: '/userManage' },
      {
        name: '农场管理',
        path: '/farmManage',
        children: [
          {
            name: '农场管理',
            path: '/farmManage'
          },
          {
            name: '土地管理',
            path: '/landManage'
          }
        ]
      },
      { name: '地图展示', path: '/showMap' },
      { name: '订单报表', path: '/orderManage' },
      {
        name: '数据管理',
        path: '/indexUpload',
        children: [
          {
            name: '首页上传',
            path: '/indexUpload'
          },
          {
            name: '文件上传',
            path: '/fileUpload'
          }
        ]
      }
    ]

    const route = useRoute()
    const current = ref([route.path])
    const showDot = ref(true)

    const trigger = () => {
      showDot.value = false
    }

    const router = useRouter()
    function toMessagePage () {
      router.push('/messagePage')
    }

    const loginOut = () => {
      router.push('/login')
      localStorage.clear()
    }

    const userInfo = store.state.userInfo
    return {
      menuList,
      current,
      showDot,
      trigger,
      toMessagePage,
      loginOut,
      userInfo
    }
  }
})
</script>

<style lang="less" scoped>
/deep/ a {
  color: #2c3e50;
}
.tab-header {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  .l-m {
    display: flex;
  }
}
.logo {
  img {
    width: 40px;
    height: 40px;
    border-radius: 5px;
  }
}
.operation {
  width: 150px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 40px;
  font-size: 20px;
  span {
    cursor: pointer;
  }
  .user-name {
    font-size: 16px;
    font-weight: 600;
  }
}
.news-item {
  height: 30px;
  padding-left: 10px;
  margin-bottom: 10px;
  box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.05);
}
</style>
