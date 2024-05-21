import axios from 'axios'

// 假设你的后端 API 路径前缀是 '/api'
const API_URL = process.env.VUE_APP_API

// 用户下单
export function UserRepairOrder (data) {
  return axios.post(`${API_URL}/user/orderRepair/submit`, data)
}
