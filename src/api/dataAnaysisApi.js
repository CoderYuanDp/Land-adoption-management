import fetch from '@/service'

// 获取首页展示数据
const getAnaysisData = () => {
  return fetch({
    method: 'get',
    url: '/dataAnaysis/getAnaysisData'
  })
}

// 获取收入数据
const getPriceData = () => {
  return fetch({
    method: 'get',
    url: '/dataAnaysis/priceAnaysis'
  })
}

export {
  getAnaysisData,
  getPriceData
}
