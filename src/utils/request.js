// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import { Message } from "element-ui"

// 创建一个axios的实例
const service = axios.create(
    {
        baseURL: process.env.VUE_APP_BASE_API,
        timeout: 3000
    }
)
// 请求拦截器
service.interceptors.request.use(

)
// 响应拦截器
service.interceptors.response.use(
    res => {
        const { success, message, data } = res.data
        if (success) {
            return data
        } else {
            Message.error(message)
            return Promise.reject(new Error(message))
        }
    },
    error => {
        Message.error(error.message)
        return Promise.reject(error)
    }
)

// 导出axios实例
export default service
