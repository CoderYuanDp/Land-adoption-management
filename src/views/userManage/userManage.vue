<template>
  <div class="container">
    <div class="search-box">
      <a-input v-model:value="searchText" placeholder="请输入用户昵称" allow-clear :maxlength="10"/>
      <a-button type="primary" @click="getUser">搜索</a-button>
    </div>
     <a-table :dataSource="userList" :columns="userColumns" :pagination="false">
        <template v-slot:bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'user_avator'">
            <img :src="record.user_avator" alt="" class="avator">
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <a-button @click="toContact(record)">私信</a-button>
          </template>
        </template>
      </a-table>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { getUserList } from '@/api/userManageApi'
import { message } from 'ant-design-vue'
import router from '@/router'
export default defineComponent({
  setup () {
    const searchText = ref('')
    const userList = ref([])
    const userColumns = [
      {
        title: 'id',
        dataIndex: 'user_id',
        key: 'user_id'
      },
      {
        title: '昵称',
        dataIndex: 'user_nickname',
        key: 'user_nickname'
      },
      {
        title: '电话',
        dataIndex: 'user_phone',
        key: 'user_phone'
      },
      {
        title: '住址',
        dataIndex: 'user_address',
        key: 'user_address'
      },
      {
        title: '头像',
        dataIndex: 'user_avator',
        key: 'user_avator'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation'
      }
    ]
    const getUser = () => {
      getUserList(searchText.value).then(res => {
        if (res.success) {
          userList.value = res.list
          if (res.list.length === 0) {
            message.warning('未搜索到结果')
          }
        } else {
          message.error(res.message)
        }
      }).catch(err => message.error(err))
    }
    getUser()
    // eslint-disable-next-line camelcase
    const toContact = ({ user_id }) => {
      console.log(user_id)
      router.push({ path: '/messagePage', query: { user_id } })
    }
    return {
      searchText,
      userList,
      userColumns,
      getUser,
      toContact
    }
  }
})
</script>

<style lang="less" scoped>
.search-box {
  padding-bottom: 20px;
  /deep/ .ant-input-affix-wrapper {
    width: 300px;
    margin-right: 20px;
  }
}
.avator {
  width: 40px;
  height: 40px;
}
</style>
