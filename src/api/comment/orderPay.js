import { request } from '@/api/service'
const API_URL = process.env.VUE_APP_API
// 用户下单
export function UserSearchOrderPay (data) {
  return request({
    url: `${API_URL}/user/pay/page`,
    method: 'post',
    data: data
  })
}
