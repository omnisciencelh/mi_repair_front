import { request } from '@/api/service'

const API_URL = process.env.VUE_APP_API

/**
 *  查询进度表
 * @param data
 * @returns {*}
 */
export function getSchedule (data) {
  return request({
    url: `${API_URL}/schedule/get`,
    method: 'post',
    data: data
  })
}
