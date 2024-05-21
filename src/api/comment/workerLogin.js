import axios from 'axios'

// 假设你的后端 API 路径前缀是 '/api'
const API_URL = process.env.VUE_APP_API

// 用户登录
export function WorkerLogin (data) {
  return axios.post(`${API_URL}/work/login`, data)
}

// 用户注册
export function WorkerReg (data) {
  return axios.post(`${API_URL}/work/reg`, data)
}
