<template>
  <div id="app">
    <a-config-provider :locale="localeRef">
      <BasicLayout />
    </a-config-provider>
  </div>
</template>

<script setup lang="ts">
import BasicLayout from '@/layouts/BasicLayout.vue'
import { useLoginUserStore } from './stores/useLoginUserStore'
import { onMounted, ref, watch } from 'vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import enUS from 'ant-design-vue/es/locale/en_US';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { useI18n } from 'vue-i18n'
import { useLocaleStore } from './stores/useLocaleStore';

const { locale } = useI18n()
const localeRef = ref(enUS)
const userLoginStore = useLoginUserStore()
const localStore = useLocaleStore()

onMounted(() => {
  if (!userLoginStore.isLogin()) {
    userLoginStore.fetchLoginUser()
  }
  locale.value = localStore.getLocale().value
  setLocale(localStore.getLocale().value)
})

watch(locale, (newLocale) => {
  setLocale(newLocale)
})

const setLocale = function (lang: string) {
  if (lang === 'en') {
    localeRef.value = enUS
    localStore.setLocale('en')
    dayjs.locale('en')
  } else {
    localeRef.value = zhCN
    localStore.setLocale('zh')
    dayjs.locale('zh-cn')
  }
}
</script>

<style scoped></style>