<template>
  <div>
    {{ $t('language') }}:
    <a-dropdown>
      <template #overlay>
        <a-menu @click="handleMenuClick">
          <a-menu-item key="en"> English </a-menu-item>
          <a-menu-item key="zh"> 中文 </a-menu-item>
        </a-menu>
      </template>

      <a-button>
        {{ currentLanguage }}
        <DownOutlined />
      </a-button>
    </a-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { DownOutlined } from '@ant-design/icons-vue'

const { locale } = useI18n()
const currentLanguage = computed(() => (locale.value === 'en' ? 'English' : '中文'))

const handleMenuClick = (e: {key: string}) => {
  changeLanguage(e.key)
}

const changeLanguage = (lang: string) => {
  locale.value = lang
}
</script>

<style scoped>
</style>
