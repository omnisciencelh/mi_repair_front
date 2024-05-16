import axios from 'axios'

// 假设你的后端 API 路径前缀是 '/api'
const API_URL = process.env.VUE_APP_API

// 用户登录
export function login (data) {
  return axios.post(`${API_URL}/user/login`, data)
}

// 用户注册
export function register (data) {
  return axios.post(`${API_URL}/user/reg`, data)
}
