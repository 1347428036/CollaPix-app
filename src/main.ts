import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import App from './App.vue'
import router from './router'
import 'ant-design-vue/dist/reset.css'
import '@/access.ts'
import VueCropper from 'vue-cropper'
import 'vue-cropper/dist/index.css'
import { createI18n } from 'vue-i18n'
import zh from '@/i18n/zh.ts'
import en from '@/i18n/en.ts'

// lazy loading example: https://vue-i18n.intlify.dev/guide/advanced/lazy.html
const i18n = createI18n({
  locale: 'en',
  legacy: false,
  messages: {
    zh,
    en
  }
})
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)
app.use(VueCropper)
app.use(i18n)

app.mount('#app')
