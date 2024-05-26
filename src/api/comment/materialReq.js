import { request } from '@/api/service'

const API_URL = process.env.VUE_APP_API

/**
 *  工程师查询申请材料表
 * @param data
 * @returns {*}
 */
export function getMaterialReq (data) {
  return request({
    url: `${API_URL}/worker/material/page`,
    method: 'post',
    data: data
  })
}
