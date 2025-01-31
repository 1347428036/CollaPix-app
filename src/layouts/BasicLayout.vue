<template>
  <div id="basicLayout">
    <a-layout class="layout">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <RouterView />
      </a-layout-content>
      <a-layout-footer class="footer"><span>CloudPicture</span></a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
import { RouterView } from 'vue-router'
</script>

<style scoped>
#basicLayout .layout {
  background-color: #efefef;
  min-height: 100vh;
}
#basicLayout .header {
  background-color: white;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}
#basicLayout .content {
  margin: 4.4rem 0 3.5rem 0;
  padding: 1rem 2rem 5rem 2rem;
  background-color: #ffff;
}
#basicLayout .footer {
  background-color: white;
  padding: 0.3rem;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
}
</style>
