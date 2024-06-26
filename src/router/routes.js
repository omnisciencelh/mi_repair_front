import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      // 首页
      {
        path: 'index',
        name: 'index',
        meta: {
          auth: true
        },
        component: _import('system/index')
      },
      // 演示页面
      {
        path: 'userOrder',
        name: '用户下单',
        meta: {
          title: '用户下单',
          auth: true
        },
        component: _import('user/order')
      },
      // 用户下单记录
      {
        path: 'myOrder',
        name: '订单记录',
        meta: {
          title: '订单记录',
          auth: true
        },
        component: _import('user/myOrder')
      },
      // 用户支付流水
      {
        path: 'payList',
        name: '订单记录',
        meta: {
          title: '订单记录',
          auth: true
        },
        component: _import('user/payList')
      },
      {
        path: 'applyMaterial',
        name: '申请材料',
        meta: {
          title: '申请材料',
          auth: true
        },
        component: _import('worder/applyMaterial')
      },
      {
        path: 'repair',
        name: '维修工单',
        meta: {
          title: '维修工单',
          auth: true
        },
        component: _import('worder/repair')
      },
      // 所有维修工单列表
      {
        path: 'repairList',
        name: '工单列表',
        meta: {
          title: '工单列表',
          auth: true
        },
        component: _import('worder/repairList')
      },
      // 系统 前端日志
      {
        path: 'log',
        name: 'log',
        meta: {
          title: '前端日志',
          auth: true
        },
        component: _import('system/log')
      },
      // 刷新页面 必须保留
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: _import('system/function/refresh')
      },
      // 页面重定向 必须保留
      {
        path: 'redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: _import('system/function/redirect')
      }
    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: _import('system/login')
  },
  {
    path: '/reg',
    name: 'reg',
    component: _import('system/reg')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: _import('system/error/404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
