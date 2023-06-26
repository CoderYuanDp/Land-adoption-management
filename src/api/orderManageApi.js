import fetch from '@/service'

// 添加农场
const getOrder = (data) => {
  return fetch({
    method: 'post',
    url: '/miniApp/getOrder',
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

const editOrderStatus = (data) => {
  return fetch({
    method: 'post',
    url: '/orderManage/editOrderStatus',
    headers: { 'Content-Type': 'application/json' },
    data
  })
}
export {
  getOrder,
  editOrderStatus
}
