import { createRouter, createWebHistory } from 'vue-router'
import HomePageVue from '@/page/HomePage.vue'
import UserLoginPageVue from '@/page/user/UserLoginPage.vue'
import UserRegisterPageVue from '@/page/user/UserRegisterPage.vue'
import UserManagementPageVue from '@/page/admin/UserManagementPage.vue'
import AddPicturePage from '@/page/picture/AddPicturePage.vue'
import PictureManagementPage from '@/page/admin/PictureManagementPage.vue'
import PictureDetailPage from '@/page/picture/PictureDetailPage.vue'
import AddPictureBatchPage from '@/page/picture/AddPictureBatchPage.vue'
import SpaceManagementPage from '@/page/admin/SpaceManagementPage.vue'
import AddSpacePage from '@/page/space/AddSpacePage.vue'
import MySpacePage from '@/page/space/MySpacePage.vue'
import SpaceDetailPage from '@/page/space/SpaceDetailPage.vue'
import SearchPicturePage from '@/page/picture/SearchPicturePage.vue'

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
      component: UserLoginPageVue,
    },
    {
      path: '/user/register',
      name: 'user register',
      component: UserRegisterPageVue,
    },
    {
      path: '/admin/user-management',
      name: 'user management',
      component: UserManagementPageVue,
    },
    {
      path: '/admin/picture-management',
      name: 'picture management',
      component: PictureManagementPage,
    },
    {
      path: '/admin/space-management',
      name: 'space management',
      component: SpaceManagementPage,
    },
    {
      path: '/picture/add',
      name: 'Create Picture',
      component: AddPicturePage,
    },
    {
      path: '/picture/add/batch',
      name: 'Create Picture Batch',
      component: AddPictureBatchPage,
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
      path: '/search/picture',
      name: 'Picture search',
      component: SearchPicturePage,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../page/AboutPage.vue'),
    },
  ],
})

export default router
