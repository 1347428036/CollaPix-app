import httpSender from '@/request'
import { UserControllerApi } from './api'

const BASE_URL = import.meta.env.VITE_BASE_URL

export const userController = new UserControllerApi(undefined, BASE_URL, httpSender)
