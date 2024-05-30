import { request } from '@/api/service'

// 假设你的后端 API 路径前缀是 '/api'
const API_URL = process.env.VUE_APP_API

// 上传图片
export function uploadImages (data, orderId) {
  return request({
    url: `${API_URL}/file/${orderId}/batchUpload`,
    method: 'post',
    data: data
  })
}

// 预览图片
export function preview (orderId) {
  return request({
    url: `${API_URL}/file/${orderId}/preview`,
    method: 'get'
  })
}

// 上传视频
export function uploadVideo (file, orderId) {
  return request({
    url: `${API_URL}/file/${orderId}/uploadVideo`,
    method: 'post',
    data: file
  })
}
