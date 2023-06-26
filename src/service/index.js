import axios from 'axios'
import router from '@/router'
const fetch = axios.create({
  baseURL: '',
  timeout: 5000
})

fetch.interceptors.request.use(config => {
  // 请求拦截器
  if (localStorage.getItem('token')) {
    // 判断token是否存在
    config.headers.Authorization = 'Bearer ' + localStorage.getItem('token')
  }
  return config
}, err => {
  return Promise.reject(err)
})

// res => res.data  取出data数据，将来调用接口的时候直接拿到的就是后台的数据
fetch.interceptors.response.use(res => {
  if (res.status === 401) {
    router.push('/login')
    return
  }
  return res.data
}, err => {
  return Promise.reject(err)
})

export default fetch
