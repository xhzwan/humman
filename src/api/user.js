import request from '@/utils/request'

export const userLogin = (data) => {
  return request({
    method: "post",
    url: "/sys/login",
    data
  })
}
