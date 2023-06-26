import fetch from '@/service'

// 上传轮播图
const addLunbo = (data) => {
  return fetch({
    method: 'post',
    url: '/dataManage/addLunbo',
    // 'get' ? 'params' : 'data'
    data
  })
}

// 删除轮播图
const delLunbo = (data) => {
  return fetch({
    method: 'post',
    url: '/dataManage/delLunbo',
    // 'get' ? 'params' : 'data'
    data
  })
}

// 获取轮播图
const getLunbo = () => {
  return fetch({
    method: 'get',
    url: '/dataManage/getALLLunbo'
  })
}

// 上传轮播图
const addHotFarm = (data) => {
  return fetch({
    method: 'post',
    url: '/dataManage/addHotfarm',
    // 'get' ? 'params' : 'data'
    data
  })
}

const getALLhot = () => {
  return fetch({
    method: 'get',
    url: '/dataManage/getALLhot'
  })
}

const delHotFarm = (data) => {
  return fetch({
    method: 'post',
    url: '/dataManage/delHotFarm',
    // 'get' ? 'params' : 'data'
    data
  })
}
export {
  addLunbo,
  delLunbo,
  getLunbo,
  addHotFarm,
  getALLhot,
  delHotFarm
}
