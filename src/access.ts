import { message } from 'ant-design-vue'
import router from './router'
import { useLoginUserStore } from './stores/useLoginUserStore'
import { computed } from 'vue'

/**
 * Overall access permission validation.
 */
router.beforeEach((to, from, next) => {
  const loginUserStore = useLoginUserStore()
  const loginUser = computed(() => loginUserStore.getLoginUser())
  const toUrl = to.fullPath
  if (toUrl.startsWith('/admin')) {
    if (!loginUser.value || loginUser.value.userRole !== 'admin') {
      message.error('No permission')
      next(`/user/login?redirect=${toUrl}`)

      return
    }
  }

  next()
})
