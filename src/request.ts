import { message } from 'ant-design-vue'
import axios from 'axios'

const httpSender = axios.create({
  baseURL: import.meta.env.VITE_BASE_URI,
  timeout: 60000,
  withCredentials: true,
})

// Add a request interceptor
httpSender.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  },
)

// Add a response interceptor
httpSender.interceptors.response.use(
  async function (response) {
    const { data } = response
    if (data.code === 20000) {
      return data.data
    }
    if (data.code === 40100) {
      if (
        !window.location.pathname.includes('/user/login') &&
        !window.location.pathname.includes('/user/register')
      ) {
        // Delay initialization useLoginUserStore
        const { useLoginUserStore } = await import('./stores/useLoginUserStore')
        const useUserStore = useLoginUserStore()
        useUserStore.clearUserInfoCache()
        await message.warning('Please login')
        window.location.href = `/user/login?redirect=${window.location.href}`
      }
    }
    return null
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  },
)

export default httpSender
