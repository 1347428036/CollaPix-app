import { createRouter, createWebHistory } from 'vue-router'
import HomePageVue from '@/page/HomePage.vue'
import AddPicturePage from '@/page/picture/AddPicturePage.vue'
import PictureDetailPage from '@/page/picture/PictureDetailPage.vue'
import AddSpacePage from '@/page/space/AddSpacePage.vue'
import MySpacePage from '@/page/space/MySpacePage.vue'
import SpaceDetailPage from '@/page/space/SpaceDetailPage.vue'
import SearchPicturePage from '@/page/picture/SearchPicturePage.vue'
import UserSettingsPage from '@/page/user/UserSettingsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePageVue,
    },
    {
      path: '/user/login',
      name: 'user login',
      component: () => import('@/page/user/UserLoginPage.vue'),
    },
    {
      path: '/user/register',
      name: 'user register',
      component: () => import('@/page/user/UserRegisterPage.vue'),
    },
    {
      path: '/admin/user-management',
      name: 'user management',
      component: () => import('@/page/admin/UserManagementPage.vue'),
    },
    {
      path: '/admin/picture-management',
      name: 'picture management',
      component: () => import('@/page/admin/PictureManagementPage.vue'),
    },
    {
      path: '/admin/space-management',
      name: 'space management',
      component: () => import('@/page/admin/SpaceManagementPage.vue'),
    },
    {
      path: '/picture/add',
      name: 'Create Picture',
      component: AddPicturePage,
    },
    {
      path: '/picture/add/batch',
      name: 'Create Picture Batch',
      component: () => import('@/page/picture/AddPictureBatchPage.vue'),
    },
    {
      path: '/picture/:id',
      name: 'Picture detail',
      component: PictureDetailPage,
      props: true,
    },
    {
      path: '/space/add',
      name: 'Create Space',
      component: AddSpacePage,
    },
    {
      path: '/space/my',
      name: 'My Space',
      component: MySpacePage,
    },
    {
      path: '/space/:id',
      name: 'Space detail',
      component: SpaceDetailPage,
      props: true,
    },
    {
      path: '/analyze/space',
      name: 'Space Analyze',
      component: () => import('@/page/space/SpaceAnalyzePage.vue'),
    },
    {
      path: '/search/picture',
      name: 'Picture search',
      component: SearchPicturePage,
    },
    {
      path: '/space/user/management/:spaceId',
      name: 'Space user management',
      component: () => import('@/page/admin/SpaceUserManagementPage.vue'),
      props: true,
    },
    {
      path: '/user/settings',
      name: 'User settings',
      component: UserSettingsPage,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/page/AboutPage.vue'),
    },
  ],
})

export default router
