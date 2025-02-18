import httpSender from '@/request'
import { UserControllerApi } from './api.ts'
import { PictureControllerApi } from './api.ts'
import { SpaceControllerApi } from './api.ts'

const BASE_URL = import.meta.env.VITE_BASE_URL

export const userController: UserControllerApi = new UserControllerApi(
  undefined,
  BASE_URL,
  httpSender,
)

export const pictureController: PictureControllerApi = new PictureControllerApi(
  undefined,
  BASE_URL,
  httpSender,
)

export const spaceController: SpaceControllerApi = new SpaceControllerApi(
  undefined,
  BASE_URL,
  httpSender,
)
