// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'
const TimeOut = 3600 // 定义超时时间

// 创建一个axios的实例
const service = axios.create(
    {
        baseURL: process.env.VUE_APP_BASE_API,
        // timeout: 3000
    }
)
// 请求拦截器
service.interceptors.request.use(config => {
    const token = store.getters.token
    if (token) {
        // 只有在有token的情况下 才有必要去检查时间戳是否超时
        if (IsCheckTimeOut()) {
            store.commit("user/updateToken");
            store.commit("user/updateUserInfo");
            router.push('/login');
            return Promise.reject(new Error('token超时'))
        }
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config // 必须要返回的
}, error => {
    return Promise.reject(error)
})
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
        // error 信息 里面 response的对象
        if (error.response && error.response.data && error.response.data.code === 10002) {
            // 当等于10002的时候 表示 后端告诉我token超时了
            store.commit("user/updateToken");
            store.commit("user/updateUserInfo");
            router.push('/login');
            return Message.error(error.response.data.message)
        } else {
            Message.error(error.message) // 提示错误信息
            return Promise.reject(error)
        }

    }
)
function IsCheckTimeOut() {
    let currentTime = Date.now()
    let timeStamp = getTimeStamp()
    return (currentTime - timeStamp) / 1000 > TimeOut
}
// 导出axios实例
export default service
