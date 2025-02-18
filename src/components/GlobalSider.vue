<template>
  <div id="global-sider">
    <a-layout-sider
      class="sider"
      width="200"
      v-if="loginUserStore.isLogin()"
      breakpoint="lg"
      collapsedWidth="0"
    >
      <a-menu
        mode="inline"
        v-model:selectedKeys="current"
        :items="menuItems"
        @click="doMenuClick"
      />
    </a-layout-sider>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { useRouter } from 'vue-router'
import { PictureOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

const loginUserStore = useLoginUserStore()
// Menu list
const menuItems = [
  {
    key: '/',
    label: 'Public Space',
    icon: () => h(PictureOutlined),
  },
  {
    key: '/space/my',
    label: 'My Space',
    icon: () => h(UserOutlined),
  },
]

const router = useRouter()

// Currently selected menu
const current = ref<string[]>([])
// Listen to route changes and update the currently selected menu
router.afterEach((to) => {
  current.value = [to.path]
})

// Route navigation event
const doMenuClick = ({ key }: { key: string }) => {
  router.push({
    path: key,
  })
}
</script>

<style scoped>
#global-sider .ant-layout-sider {
  background: none;
}
</style>
