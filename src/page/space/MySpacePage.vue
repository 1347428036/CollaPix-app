<template>
  <div id="mySpace">
    <p>Jumping to the page, please wait...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { spaceController } from '@/api/apiFactory'
import type { PageSpaceVo } from '@/api/api'

const router = useRouter()
const loginUserStore = useLoginUserStore()

// Validate user space on page loaded
onMounted(() => {
  checkUserSpace()
})

// Validate user space
const checkUserSpace = async () => {
  const loginUser = loginUserStore.getLoginUser()
  if (!loginUser?.id) {
    router.replace('/user/login')
    return
  }
  // Fetch user's space
  const res = (await spaceController.listSpaceVoByPage({
    userId: loginUser.id,
    current: 1,
    pageSize: 1,
  })) as PageSpaceVo
  if (res) {
    if (res.records && res.records.length > 0) {
      const space = res.records[0]
      router.replace(`/space/${space.id}`)
    } else {
      router.replace('/space/add')
      message.warn('Please create a space first')
    }
  } else {
    message.error('Loading my space failed')
  }
}
</script>
