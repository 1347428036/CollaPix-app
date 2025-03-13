import { ref } from 'vue'
import { defineStore } from 'pinia'
import { type LoginUserVo } from '@/api/api'
import { userController } from '@/api/apiFactory'
import type { UserVo } from '@/api/api'

const UNLOGIN_USER = {
  userName: 'Unlogin',
  userAvatar: '',
}
const USER_INFO_KEY = 'loginUser'

const userInfoRef = ref<LoginUserVo>(UNLOGIN_USER)

export const useLoginUserStore = defineStore('loginUser', () => {
  async function fetchLoginUser() {
    const loginUser = loadUserFromStorage()
    if (!loginUser || loginUser === UNLOGIN_USER) {
      const userInfo = await userController.getLoginUser()
      if (userInfo) {
        userInfoRef.value = userInfo as LoginUserVo
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo))
      } else {
        userInfoRef.value = UNLOGIN_USER
        localStorage.removeItem(USER_INFO_KEY)
      }
    }
    userInfoRef.value = loginUser

    return userInfoRef.value
  }

  function getLoginUser(): UserVo {
    if (!userInfoRef.value || userInfoRef.value === UNLOGIN_USER) {
      fetchLoginUser()
    }

    return userInfoRef.value
  }
  function setLoginUser(newLoginUser: LoginUserVo) {
    userInfoRef.value = newLoginUser
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(newLoginUser))
  }

  function isLogin() {
    return userInfoRef.value.id !== undefined
  }

  function clearUserInfoCache() {
    userInfoRef.value = UNLOGIN_USER
    localStorage.removeItem(USER_INFO_KEY)
  }

  async function logout() {
    await userController.userLogout()
    clearUserInfoCache()
  }

  function loadUserFromStorage(): LoginUserVo {
    const userJson = localStorage.getItem(USER_INFO_KEY)
    if (userJson) {
      return JSON.parse(userJson)
    }

    return UNLOGIN_USER
  }

  return { fetchLoginUser, setLoginUser, getLoginUser, isLogin, clearUserInfoCache, logout }
})
