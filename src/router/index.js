import { createRouter, createWebHashHistory } from 'vue-router'
const LayOut = () => import('../views/layOut.vue')
const dataAnalysis = () => import('../views/dataAnalysis/dataAnalysis.vue')
const farmManage = () => import('../views/farmManage/farmManage.vue')
const landManage = () => import('../views/farmManage/landManage.vue')
const orderManage = () => import('../views/orderManage/orderManage.vue')
const showMap = () => import('../views/showMap/showMap.vue')
const userManage = () => import('../views/userManage/userManage.vue')
const messagePage = () => import('../views/messagePage/messagePage.vue')
const Login = () => import('../views/login/loginPage.vue')
const indexUpload = () => import('../views/dataManage/indexUpload.vue')
const fileUpload = () => import('../views/dataManage/fileUpload.vue')

const routes = [
  {
    path: '/',
    name: 'layOut',
    component: LayOut,
    redirect: '/dataAnalysis',
    children: [
      {
        name: 'dataAnalysis',
        path: '/dataAnalysis',
        component: dataAnalysis
      },
      {
        name: 'farmManage',
        path: '/farmManage',
        component: farmManage
      },
      {
        name: 'orderManage',
        path: '/orderManage',
        component: orderManage
      },
      {
        name: 'showMap',
        path: '/showMap',
        component: showMap
      },
      {
        name: 'userManage',
        path: '/userManage',
        component: userManage
      },
      {
        name: 'messagePage',
        path: '/messagePage',
        component: messagePage
      },
      {
        name: 'indexUpload',
        path: '/indexUpload',
        component: indexUpload
      },
      {
        name: 'fileUpload',
        path: '/fileUpload',
        component: fileUpload
      },
      {
        name: 'landManage',
        path: '/landManage',
        component: landManage
      }
    ]
  },
  {
    name: 'login',
    path: '/login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior () {
    return { left: 0, top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  if (to.fullPath === '/login') {
    return next()
  }
  if (localStorage.getItem('token')) {
    next()
  } else {
    next({ name: 'login' })
  }
})

export default router
