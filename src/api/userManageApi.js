import fetch from '@/service'

// 获取农场
const getUserList = (name) => {
  return fetch({
    method: 'post',
    url: '/userManage/getUser',
    headers: { 'Content-Type': 'application/json' },
    data: { nickname: name }
  })
}

export {
  getUserList
}
