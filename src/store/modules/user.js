import { getToken, setToken, removeToken, setTimeStamp } from "@/utils/auth"
import { userLogin, getUserInfo, getUserDetailById } from "@/api/user"
import { Message } from "element-ui"


const state = {
  token: getToken(),
  userInfo: {}
}
const mutations = {
  updateToken(state, token) {
    if (token) {
      state.token = token
      setToken(token)
    } else {
      state.token = null
      removeToken()
    }
  },
  updateUserInfo(state, userInfo) {
    if (userInfo) {
      state.userInfo = userInfo
    } else {
      state.userInfo = {}
    }
  }
}
const actions = {
  async login({ commit }, data) {
    try {
      const result = await userLogin(data)

      commit("updateToken", result)
      setTimeStamp()

    } catch (error) {
      Message.error(error.message)
      return Promise.reject(new Error(error.message))
    }
  },
  //用户信息
  async userInfo({ commit }) {
    try {
      const res = await getUserInfo()
      const baseInfo = await getUserDetailById(res.userId)
      const baseResult = { ...res, ...baseInfo }
      commit('updateUserInfo', baseResult)
      return res //做权限才用到
    } catch (error) {
      console.log(error);
    }
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
