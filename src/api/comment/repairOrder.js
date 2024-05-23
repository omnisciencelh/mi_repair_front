import axios from 'axios'

// 假设你的后端 API 路径前缀是 '/api'
const API_URL = process.env.VUE_APP_API

// 用户下单
export function UserRepairOrder (data) {
  return axios.post(`${API_URL}/user/orderRepair/submit`, data)
}
// 用户查询维修单
export function UserSearchOrder (data) {
  return axios.get(`${API_URL}/user/orderRepair/page`, data)
}
// 用户确认维修单
export function UserConfirmOrder (data) {
  return axios.put(`${API_URL}/user/orderRepair/check`, data)
}
// 工程师接单
export function WorkerAcceptOrder (id) {
  return axios.put(`${API_URL}/worker/orderRepair/confirm/${id}`)
}
// 工程师查询维修单
export function WorkerSearchOrder (id) {
  return axios.get(`${API_URL}/worker/orderRepair/page`)
}
