import { request } from '@/api/service'
const API_URL = process.env.VUE_APP_API
// 用户下单
export function UserRepairOrder (data) {
  return request({
    url: `${API_URL}/user/orderRepair/submit`,
    method: 'post',
    data: data
  })
}

// 用户查询维修单
export function UserSearchOrder (data) {
  return request({
    url: `${API_URL}/user/orderRepair/page`,
    method: 'post',
    data: data
  })
}
// 用户确认工单
export function UserConfirmOrder (id) {
  return request({
    url: `${API_URL}/user/orderRepair/check?orderId=${id}`,
    method: 'put',
    data: null
  })
}
// 用户取消工单
export function UserCancelOrder (id) {
  return request({
    url: `${API_URL}/user/orderRepair/cancel?orderId=${id}`,
    method: 'delete',
    data: null
  })
}
// 工程师接单
export function WorkerAcceptOrder (id) {
  // 使用request函数发送注册请求，它会自动添加token
  return request({
    url: `${API_URL}/worker/orderRepair/confirm?id=${id}`,
    method: 'put',
    data: null
  })
}
// 工程师查询维修单
export function WorkerSearchOrder (data) {
  return request({
    url: `${API_URL}/worker/orderRepair/page`,
    method: 'post',
    data: data
  })
}
// 工程师维修成功
export function repairSuccess (orderId) {
  return request({
    url: `${API_URL}/worker/orderRepair/repairSuccess?id=${orderId}`,
    method: 'put'
  })
}
// 工程师维修失败
export function repairFailed (orderId) {
  return request({
    url: `${API_URL}/worker/orderRepair/repairFailed?id=${orderId}`,
    method: 'put'
  })
}

// 工程师归还设备
export function returnDevice (orderId) {
  return request({
    url: `${API_URL}/worker/orderRepair/returnDevice?id=${orderId}`,
    method: 'put'
  })
}
