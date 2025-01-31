<template>
  <div id="app">
    <BasicLayout />
  </div>
</template>

<script setup lang="ts">
import BasicLayout from '@/layouts/BasicLayout.vue'
import { useLoginUserStore } from './stores/useLoginUserStore'
import { onMounted } from 'vue'

const userLoginStore = useLoginUserStore()

onMounted(() => {
  if (!userLoginStore.isLogin()) {
    userLoginStore.fetchLoginUser()
  }
})
</script>

<style scoped></style>
