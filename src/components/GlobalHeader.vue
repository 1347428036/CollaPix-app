<template>
  <div id="globalHeader">
    <a-row :wrap="false">
      <a-col flex="16rem">
        <RouterLink to="/">
          <div class="title-bar">
            <img class="image" src="@/assets/Cloud-Picture-logo.png" alt="logo" />
            <div class="title">CollaPix</div>
          </div>
        </RouterLink></a-col
      >
      <a-col flex="auto"
        ><a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
          @click="doMenueClick"
      /></a-col>
      <a-col flex="12rem">
        <div class="user-login-status">
          <div v-if="loginUserStore.isLogin()">
            <a-dropdown placement="bottomRight" :arrow="{ pointAtCenter: false }">
              <a-space style="cursor: pointer">
                {{ userInfo.userName }}
                <a-avatar shape="square" :src="userInfo.userAvatar">
                  <template #icon><UserOutlined /></template>
                </a-avatar>
              </a-space>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <router-link to="/space/my"><UserOutlined /> My Space</router-link>
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:;" @click="doLogout"><LogoutOutlined /> Logout</a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <div v-else><a-button type="primary" href="/user/login">Login</a-button></div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import {
  FileImageOutlined,
  FolderOutlined,
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons-vue'
import type { MenuProps } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

const loginUserStore = useLoginUserStore()
const userInfo = computed(() => loginUserStore.getLoginUser())
const defaultItems = ref<MenuProps['items']>([
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: 'Home',
    title: 'Home',
  },
  {
    key: '/picture/add',
    icon: () => h(FileImageOutlined),
    label: 'Create Picture',
    title: 'Create Picture',
  },
  {
    key: '/admin/user-management',
    icon: () => h(UserOutlined),
    label: 'User Management',
    title: 'User Management',
  },
  {
    key: '/admin/picture-management',
    icon: () => h(FileImageOutlined),
    label: 'Picture Management',
    title: 'Picture Management',
  },
  {
    key: '/admin/space-management',
    icon: () => h(FolderOutlined),
    label: 'Space Management',
    title: 'Space Management',
  },
  {
    key: '/about',
    label: 'About',
    title: 'About',
  },
])

const router = useRouter()
/*
Highlight selected menu item
 */
const current = ref<string[]>([])
router.afterEach((to) => {
  current.value = [to.path]
})

const items = computed(() => {
  return filterMenu(defaultItems.value)
})

const filterMenu = (menus = [] as MenuProps['items']) => {
  return menus?.filter((item) => {
    if (typeof item?.key === 'string' && item?.key?.startsWith('/admin')) {
      if (!userInfo.value || userInfo.value.userRole !== 'admin') {
        return false
      }
    }

    return true
  })
}

const doMenueClick = ({ key }: { key: string }) => {
  router.push({
    path: key,
  })
}

const doLogout = () => {
  loginUserStore.logout()
  router.push({ path: '/user/login', replace: true })
}
</script>

<style scoped>
#globalHeader .title-bar {
  display: flex;
  align-items: center;
  margin-left: 1rem;
  height: 100%;
}
.image {
  width: 3.5rem;
  height: 3.5rem;
}
.title {
  color: black;
  font-size: 1.2rem;
  margin-left: 1rem;
  font-weight: bold;
}
</style>
