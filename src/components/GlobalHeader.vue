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
                    <router-link to="/space/my">
                      <a-button type="link" :icon="h(UserOutlined)"
                        >&nbsp; {{ $t('mySpace') }}
                      </a-button>
                    </router-link>
                  </a-menu-item>
                  <a-menu-item>
                    <router-link to="/user/settings">
                      <a-button type="link" :icon="h(SettingOutlined)">
                        &nbsp;{{ $t('settings') }}</a-button
                      >
                    </router-link>
                  </a-menu-item>
                  <a-menu-item>
                    <a-button type="link" :icon="h(LogoutOutlined)" @click="doLogout" danger>
                      &nbsp;{{ $t('logout') }}</a-button
                    >
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <div v-else>
            <a-button type="primary" href="/user/login">{{ $t('login') }}</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { computed, h, ref } from 'vue'
import {
  FileImageOutlined,
  FolderOutlined,
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue'
import type { MenuProps } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const loginUserStore = useLoginUserStore()
const userInfo = computed(() => loginUserStore.getLoginUser())
const defaultItems = ref<MenuProps['items']>([
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: 'home',
    title: 'home',
  },
  {
    key: '/picture/add',
    icon: () => h(FileImageOutlined),
    label: 'createPicture',
    title: 'createPicture',
  },
  {
    key: '/admin/user-management',
    icon: () => h(UserOutlined),
    label: 'userManagement',
    title: 'userManagement',
  },
  {
    key: '/admin/picture-management',
    icon: () => h(FileImageOutlined),
    label: 'pictureManagement',
    title: 'pictureManagement',
  },
  {
    key: '/admin/space-management',
    icon: () => h(FolderOutlined),
    label: 'spaceManagement',
    title: 'spaceManagement',
  },
  {
    key: '/about',
    label: 'about',
    title: 'about',
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
  return menus
    ?.filter((item) => {
      if (typeof item?.key === 'string' && item?.key?.startsWith('/admin')) {
        if (!userInfo.value || userInfo.value.userRole !== 'admin') {
          return false
        }
      }

      return true
    })
    .map((item) => {
      if (item && 'label' in item && 'title' in item) {
        return {
          ...item,
          label: t(item.label),
          title: t(item.title!),
        }
      }
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
