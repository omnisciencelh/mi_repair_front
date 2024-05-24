import axios from 'axios'
import {request} from "@/api/service";

// 假设你的后端 API 路径前缀是 '/api'
const API_URL = process.env.VUE_APP_API

// 用户登录
// export function login (data) {
//   return axios.post(`${API_URL}/user/login`, data)
// }
export function login (data) {
  return request({
    url: `${API_URL}/user/login`,
    method: 'post',
    data: data
  })
}

// 用户注册
// export function register (data) {
//   return axios.post(`${API_URL}/user/reg`, data)
// }
export function register (data) {
  return request({
    url: `${API_URL}/user/reg`,
    method: 'post',
    data: data
  })
}
