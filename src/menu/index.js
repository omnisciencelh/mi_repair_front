import { uniqueId } from 'lodash'

/**
 * @description 给菜单数据补充上 path 字段
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
function supplementPath (menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children ? {
      children: supplementPath(e.children)
    } : {}
  }))
}

export const menuHeader = supplementPath([
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '用户应用',
    icon: 'folder-o',
    children: [
      { path: '/userOrder', title: '用户下单' },
      { path: '/myOrder', title: '下单记录' },
      { path: '/payList', title: '账单流水' }
    ]
  },
  {
    title: '工程师应用',
    icon: 'folder-o',
    children: [
      { path: '/repairList', title: '工单列表' },
      { path: '/applyMaterial', title: '申请材料' }
      // { path: '/repair', title: '维修列表' },
    ]
  }
])

export const menuAside = supplementPath([
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '用户功能',
    icon: 'folder-o',
    children: [
      { path: '/userOrder', title: '用户下单' },
      { path: '/myOrder', title: '下单记录' },
      { path: '/payList', title: '账单流水' }
    ]
  },
  {
    title: '工程师功能',
    icon: 'folder-o',
    children: [
      { path: '/repairList', title: '工单列表' },
      { path: '/applyMaterial', title: '申请材料' }
      // { path: '/repair', title: '我的维修列表' },
    ]
  }
])
