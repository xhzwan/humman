import { getToken, setToken, removeToken } from "@/utils/auth"
import { userLogin } from "@/api/user"
import { Message } from "element-ui"

const state = {
  token: getToken()
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
  }
}
const actions = {
  async login({ commit }, data) {
    try {
      const result = await userLogin(data)

      commit("updateToken", result)

    } catch (error) {
      Message.error(error.message)
      return Promise.reject(new Error(error.message))
    }
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
