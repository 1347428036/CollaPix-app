import { createRouter, createWebHistory } from 'vue-router'
import HomePageVue from '@/page/HomePage.vue'
import UserLoginPageVue from '@/page/user/UserLoginPage.vue'
import UserRegisterPageVue from '@/page/user/UserRegisterPage.vue'
import UserManagementPageVue from '@/page/admin/UserManagementPage.vue'

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
