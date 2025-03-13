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
import { ref, h, computed, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { PictureOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { SPACE_TYPE_ENUM } from '@/constant/spaceConstant'
import type { SpaceUserVo } from '@/api/api'
import { spaceUserController } from '@/api/apiFactory'
import { message } from 'ant-design-vue'

const loginUserStore = useLoginUserStore()
// Menu list
const fixedMenuItems = [
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
  {
    key: '/space/add?type=' + SPACE_TYPE_ENUM.TEAM,
    label: 'Create Team Space',
    icon: () => h(TeamOutlined),
  },
]

const teamSpaceList = ref<SpaceUserVo[]>([])
const menuItems = computed(() => {
  // No team spaces, only show fixed menu
  if (teamSpaceList.value.length < 1) {
    return fixedMenuItems
  }
  // Display team space group
  const teamSpaceSubMenus = teamSpaceList.value.map((spaceUser) => {
    const space = spaceUser.space
    return {
      key: '/space/' + spaceUser.spaceId,
      label: space?.spaceName,
    }
  })
  const teamSpaceMenuGroup = {
    type: 'group',
    label: 'My Team',
    key: 'teamSpace',
    children: teamSpaceSubMenus,
  }
  return [...fixedMenuItems, teamSpaceMenuGroup]
})

const router = useRouter()
// Currently selected menu
const current = ref<string[]>([])
// Listen to route changes and update the currently selected menu
router.afterEach((to) => {
  const spaceType = to.query.spaceType
  if (typeof spaceType === 'string' && Number.parseInt(spaceType) === SPACE_TYPE_ENUM.PRIVATE) {
    current.value = ['/space/my']
    return
  }
  current.value = [to.fullPath]
})

// Route navigation event
const doMenuClick = ({ key }: { key: string }) => {
  if (key === current.value[0]) {
    return
  }
  router.push(key)
}

// Load team space list
const fetchTeamSpaceList = async () => {
  const res = await spaceUserController.listMyTeamSpace()
  if (res) {
    teamSpaceList.value = res as unknown as SpaceUserVo[]
  } else {
    message.error('Loading my team space failed')
  }
}

/**
 * Watching component changes, loading team space list when user is logged in
 */
watchEffect(() => {
  // Load when logged in
  if (loginUserStore.getLoginUser().id) {
    fetchTeamSpaceList()
  }
})
</script>

<style scoped>
#global-sider .ant-layout-sider {
  background: none;
}
</style>
