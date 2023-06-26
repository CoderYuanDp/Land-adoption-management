import fetch from '@/service'

// 添加农场
const addFarm = (data) => {
  return fetch({
    method: 'post',
    url: '/farmManage/addFarm',
    data
  })
}

// 修改农场
const editFarm = (data) => {
  return fetch({
    method: 'post',
    url: '/farmManage/editFarm',
    data
  })
}

// 获取农场
const getFarmList = (farmName) => {
  return fetch({
    method: 'get',
    url: '/farmManage/getFarm',
    headers: { 'Content-Type': 'application/json' },
    params: { farmName: farmName }
  })
}

// 删除农场
const delFarm = (data) => {
  return fetch({
    method: 'post',
    url: '/farmManage/delFarm',
    data
  })
}

// 获取土地
const getLandList = (farmId) => {
  return fetch({
    method: 'get',
    url: '/farmManage/getLand',
    headers: { 'Content-Type': 'application/json' },
    params: { farmId }
  })
}

const addLand = (data) => {
  return fetch({
    method: 'post',
    url: '/farmManage/addLand',
    data
  })
}

const delLand = (data) => {
  return fetch({
    method: 'post',
    url: '/farmManage/delLand',
    data
  })
}

export {
  addFarm,
  editFarm,
  getFarmList,
  delFarm,
  getLandList,
  addLand,
  delLand
}
