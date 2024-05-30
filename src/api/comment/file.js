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
