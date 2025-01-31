<template>
  <div id="globalHeader">
    <a-row :wrap="false">
      <a-col flex="16rem">
        <RouterLink to="/">
          <div class="title-bar">
            <img class="image" src="@/assets/Cloud-Picture-logo.png" alt="logo" />
            <div class="title">CloudPicture</div>
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
          <div v-if="userInfo.id">
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
                    <a href="javascript:;" @click="doLogout">Logout</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:;">2nd menu item</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:;">3rd menu item</a>
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
import { HomeOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons-vue'
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
    key: '/admin/user-management',
    icon: () => h(UserOutlined),
    label: 'User Management',
    title: 'User Management',
  },
  {
    key: '/sub1',
    icon: () => h(SettingOutlined),
    label: 'Navigation Three - Submenu',
    title: 'Navigation Three - Submenu',
    children: [
      {
        type: 'group',
        label: 'Item 1',
        children: [
          {
            label: 'Option 1',
            key: 'setting:1',
          },
          {
            label: 'Option 2',
            key: 'setting:2',
          },
        ],
      },
      {
        type: 'group',
        label: 'Item 2',
        children: [
          {
            label: 'Option 3',
            key: 'setting:3',
          },
          {
            label: 'Option 4',
            key: 'setting:4',
          },
        ],
      },
    ],
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
