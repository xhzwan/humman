import request from '@/utils/request'

export const userLogin = (data) => {
  return request({
    method: "post",
    url: "/sys/login",
    data
  })
}
export const getUserInfo = () => {
  return request({
    method: "post",
    url: "/sys/profile"
  })
}
export const getUserDetailById = (id) => {
  return request({
    url: `/sys/user/${id}`
  })
}
