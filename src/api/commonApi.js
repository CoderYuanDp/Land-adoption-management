import fetch from '@/service'

// 登录
const loginByForm = (form) => {
  return fetch({
    method: 'post',
    url: '/login',
    // 'get' ? 'params' : 'data'
    data: form
  })
}

// 上传
const uploadFile = (form) => {
  return fetch({
    method: 'post',
    url: '/uploadFile',
    headers: { 'Content-Type': 'multipart/form-data; charset=utf-8' },
    data: form
  })
}

const delFile = (form) => {
  return fetch({
    method: 'post',
    url: '/delFile',
    data: form
  })
}
// 获取上传文件列表
const getUploadFiles = () => {
  return fetch({
    method: 'get',
    url: '/getUploadFilesList'
  })
}
export {
  loginByForm,
  uploadFile,
  getUploadFiles,
  delFile
}
