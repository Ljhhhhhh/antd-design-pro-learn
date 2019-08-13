import request from "@/utils/request";

export function fetchHome () {
  return request({
    url: '/manage/statistic/base_count.do',
    method: 'get'
  })
}