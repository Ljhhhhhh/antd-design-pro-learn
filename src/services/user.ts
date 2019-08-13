import request from "@/utils/request";

interface listParams {
  current: number
  pageSize?: number
}

export function fetchUser({current, pageSize = 10}: listParams) {
  return request('/manage/user/list.do', {
    method: 'POST',
    data: {
      pageNum: current,
      pageSize
    }
  })
}