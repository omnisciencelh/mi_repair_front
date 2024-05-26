import { request } from '@/api/service'

const API_URL = process.env.VUE_APP_API

/**
 *  工程师查询库存
 * @param data
 * @returns {*}
 */
export function getStorage (data) {
  return request({
    url: `${API_URL}/storage/page`,
    method: 'post',
    data: data
  })
}

/**
 * 工程师提交材料申请
 * @param data
 * @returns {*}
 */
export function materialsApply (data) {
  return request({
    url: `${API_URL}//worker/repair/materials`,
    method: 'post',
    data: data
  })
}
