<template>
  <div class="login-box">
    <div class="login-container">
      <div class="show-img"></div>
      <div class="form-box">
        <span class="text-sty">登录</span>
        <a-input v-model:value="loginForm.userId" placeholder="请输入账户名" />
        <a-input-password v-model:value="loginForm.password" placeholder="请输入密码" />
        <a-button type="primary" @click="login">登录</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue'
import { loginByForm } from '@/api/commonApi'
import { message } from 'ant-design-vue'
import router from '@/router'
import store from '@/store'

export default defineComponent({
  setup () {
    const loginForm = reactive({
      userId: '',
      password: ''
    })

    const login = () => {
      if (loginForm.userId === '' || loginForm.password === '') {
        message.warn('账户或密码不能为空')
        return
      }
      loginByForm(loginForm).then(res => {
        if (res.success) {
          message.success('登录成功')
          localStorage.setItem('userName', 'Admin')
          localStorage.setItem('token', res.token)
          store.commit('setUserInfo', res.data)
          router.push('/')
        } else {
          message.error('账号或密码错误')
        }
      }).catch(err => message.error(err))
    }

    return {
      loginForm,
      login
    }
  }
})
</script>

<style lang="less" scoped>
.login-box {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url(/src/assets/bg.jpg) no-repeat fixed center;
  background-size: cover;
  backdrop-filter: blur(15px);
  .login-container {
    width: 95vw;
    height: 90vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, .8);
    border-radius: 10px;
  }
  .form-box {
    min-width: 500px;
    height: 400px;
    background-color: rgba(255, 255, 255, 1);
    padding: 50px 20px 150px 20px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .text-sty {
      font-size: 20px;
      font-weight: 800;
    }
  }
}
</style>
