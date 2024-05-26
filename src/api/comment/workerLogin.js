import { request } from '@/api/service'

const API_URL = process.env.VUE_APP_API

// 用户登录
export function WorkerLogin (data) {
  return request({
    url: `${API_URL}/worker/login`,
    method: 'post',
    data: data
  })
}
// 用户注册
export function WorkerReg (data) {
  debugger
  return request({
    url: `${API_URL}/worker/reg`,
    method: 'post',
    data: data
  })
}
