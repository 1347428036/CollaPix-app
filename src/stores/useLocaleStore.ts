import { KEY_LANG } from '@/constant/localStorageConstant'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLocaleStore = defineStore('localeStore', () => {
  const state = ref(localStorage.getItem(KEY_LANG) || 'en')

  function setLocale(lang: string) {
    state.value = lang
    localStorage.setItem(KEY_LANG, lang)
  }

  function getLocale() {
    return state
  }

  return { setLocale, getLocale }
})
