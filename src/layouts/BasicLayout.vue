<template>
  <div id="basicLayout">
    <a-layout class="layout">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout>
        <GlobalSlider class="sider" />
        <a-layout-content class="content">
          <RouterView />
        </a-layout-content>
      </a-layout>

      <a-layout-footer class="footer"><span>CollaPix</span></a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalSlider from '@/components/GlobalSider.vue'
import { RouterView } from 'vue-router'
</script>

<style scoped>
#basicLayout .layout {
  background-color: #efefef;
  min-height: 100vh;
}
#basicLayout .header {
  background-color: white;
  margin-bottom: 1px;
}
#basicLayout .content {
  margin: 0 0 3.5rem 0;
  padding: 1rem 2rem 1rem 2rem;
  background-color: #ffff;
  height: calc(100vh - 8rem);
  overflow: auto;
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
  z-index: 100;
}

#basicLayout .sider {
  background: #fff;
  margin-top: 0;
  border-right: 0.5px solid #eee;
}

#basicLayout :deep(.ant-menu-root) {
  border-bottom: none !important;
  border-inline-end: none !important;
}
</style>
