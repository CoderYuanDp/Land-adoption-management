<template>
  <div class="container">
    <div class="left-tab">
      <div class="search-box">
        <a-input v-model:value="userName" placeholder="请输入用户名称" block allow-clear :maxlength="10"/>
        <a-button type="primary" @click="getUser">搜索</a-button>
      </div>
      <template v-for="(item, index) in userList" :key="item.user_id">
        <div :class="['user', index === activeIndex ? 'active' : '']" @click="selectUser(index,item)">
          <img :src="item.user_avator" alt="">
          <span>{{item.user_nickname}}</span>
        </div>
      </template>
    </div>
    <div class="content">
      <div class="user-name">{{selectUserName}}</div>
      <div class="message-box" ref="msgbox">
        <a-empty v-if="activeIndex===-1" :description="null" style="padding-top: 250px;"/>
        <template v-if="activeIndex!==-1">
          <template v-for="(item,  index) in messageArr" :key="index">
            <div class="admin-msg" v-if="item.from === 'admin' && item.to === nowUser.user_id">
              <span class="msg">{{item.content}}</span>
              <img src="../../assets/logo.png" class="avator" alt="">
            </div>
            <div class="user-msg" v-if="item.to === 'admin' && item.from === 'server' || item.from === nowUser.user_id">
              <img :src="nowUser.user_avator" class="avator" alt="">
              <span class="msg">{{item.content}}</span>
            </div>
          </template>
        </template>
      </div>
      <div class="send-box">
        <a-input v-model:value.trim="sendText" placeholder="请输入" :disabled="activeIndex===-1" :maxlength="100" style="width: 95%;" @keyup.enter="send"/>
        <a-button type="primary" @click="send">发送</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onBeforeUnmount, watch } from 'vue'
import { getUserList } from '@/api/userManageApi'
import { message } from 'ant-design-vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  setup () {
    const socket = new WebSocket('wss://dpweb.club:3000/link')
    socket.onopen = (e) => {
      message.success('连接成功')
    }
    socket.onerror = (e) => {
      message.error(e)
      socket.close()
      messageArr.value = []
    }
    const messageArr = ref([])
    if (!localStorage.getItem('messageArr')) {
      messageArr.value = []
      localStorage.setItem('messageArr', JSON.stringify(messageArr.value))
    } else {
      messageArr.value = JSON.parse(localStorage.getItem('messageArr'))
    }
    const msgbox = ref(null)
    socket.onmessage = (wsObj) => {
      messageArr.value.push(JSON.parse(wsObj.data))
      setTimeout(() => {
        msgbox.value.scrollTop = msgbox.value.scrollHeight
      }, 50)
      localStorage.setItem('messageArr', JSON.stringify(messageArr.value))
    }

    const sendMsg = (msg) => {
      socket.send(JSON.stringify(msg))
    }
    const userName = ref('')
    const sendText = ref('')
    const userList = ref([])
    const getUser = () => {
      getUserList(userName.value).then(res => {
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
    const activeIndex = ref(-1)
    const nowUser = ref({})
    const selectUserName = ref('')
    const selectUser = (index, item) => {
      activeIndex.value = index
      nowUser.value = item
      selectUserName.value = item.user_nickname
    }

    const id = useRoute().query.user_id
    watch(userList, (newList) => {
      if (id && newList.length !== 0) {
        newList.forEach((item, index) => {
          if (item.user_id === Number(id)) {
            selectUser(index, item)
          }
        })
      }
    })

    const send = () => {
      if (nowUser.value.user_id === undefined || !sendText.value === '') {
        return
      }
      sendMsg({
        userInfo: nowUser.value,
        content: sendText.value,
        from: 'admin',
        to: nowUser.value.user_id
      })
      sendText.value = ''
    }
    onBeforeUnmount(() => {
      socket.close()
      messageArr.value = []
      console.log('销毁socket')
    })

    return {
      userName,
      sendText,
      getUser,
      userList,
      selectUser,
      nowUser,
      activeIndex,
      selectUserName,
      messageArr,
      send,
      msgbox
    }
  }
})
</script>

<style lang="less" scoped>
.container {
  display: flex;
  height: calc(100vh - 46px);
  padding-top: 0;
  .left-tab {
    width: 300px;
    height: 100%;
    margin-right: 10px;
    padding: 10px;
    overflow: scroll;
    &::-webkit-scrollbar{
        width: 8px;
      }
       //滚动的滑块
      &::-webkit-scrollbar-thumb{
        width: 7px;
        border-radius:5px;
        background-color: #ccc//滚动条的颜色
      }
       //内层滚动槽
      &::-webkit-scrollbar-track-piece{
        width: 8px;
        background-color:rgb(255, 255, 255) ;
      }
    .search-box {
      margin-bottom: 20px;
    }
    :deep(.ant-input-affix-wrapper) {
      width: 190px;
      margin-right: 10px;
    }
    .user {
      width: 100%;
      padding: 5px;
      margin-bottom: 10px;
      border-radius: 5px;
      img {
        width: 40px;
        height: 40px;
        margin-right: 20px;
      }
      span {
        font-size: 13px;
        font-weight: 500;
      }
    }
    .active {
      background-color: rgba(197, 197, 197, 0.1);
    }
  }
  .content {
    height: 100%;
    flex: 1;
    position: relative;
    background-color: rgba(197, 197, 197, 0.1);
    border: 1px solid rgba(197, 197, 197, 0.5);
    .send-box {
      width: 100%;
      display: flex;
      justify-content: space-between;
      background-color: #fff;
      position: absolute;
      z-index: 2;
      bottom: 0;
    }
    .user-name {
      width: 100%;
      height: 40px;
      line-height: 40px;
      padding-left: 40px;
      text-align: center;
      font-size: 14px;
      font-weight: 600px;
      background-color: #fff;
      position: absolute;
      top: 0;
      z-index: 2;
    }
    .message-box {
      position: absolute;
      width: 100%;
      padding-top: 40px;
      padding-bottom: 32px;
      padding-left: 20px;
      padding-right: 20px;
      top: 0;
      bottom: 0;
      z-index: 1;
      overflow: scroll;
      &::-webkit-scrollbar{
        width: 8px;
      }
       //滚动的滑块
      &::-webkit-scrollbar-thumb{
        width: 7px;
        border-radius:5px;
        background-color: #ccc//滚动条的颜色
      }
       //内层滚动槽
      &::-webkit-scrollbar-track-piece{
        width: 8px;
        background-color:rgb(255, 255, 255) ;
      }
    }
  }
  .admin-msg {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }
  .avator {
    width: 40px;
    height: 40px;
    margin: 5px 10px 0 10px;
    border: 1px solid #dcdcdc;
    border-radius: 50%;
  }
  .msg {
    display: inline-block;
    max-width: 400px;
    min-height: 40px;
    padding: 10px;
    background-color: rgb(255, 255, 255);
    border: 1px solid rgba(186, 186, 186, 0.3);
    border-radius: 5px;
  }
  .user-msg {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 10px;
  }

}
</style>
