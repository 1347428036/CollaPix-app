<template>
  <a-modal v-model:open="open" :title="$t('shareModal.title')" :footer="false" @cancel="closeModal">
    <h4>{{ $t('shareModal.copyLink') }}</h4>
    <a-typography-link copyable>
      {{ link }}
    </a-typography-link>
    <div style="margin-bottom: 16px"></div>
    <h4>{{ $t('shareModal.scanQRCode') }}</h4>
    <a-qrcode :value="link" />
  </a-modal>
</template>

<script setup lang="ts">
import { ref} from 'vue'

/**
 * Define component props types
 */
interface Props {
  title: string
  link: string
}
/**
 * Assign default values to component props
 */
withDefaults(defineProps<Props>(), {
  title: () => 'Share',
  link: () => 'https://collapix.esmiao.com',
})

// Whether the modal is visible
const open = ref(false)

// Open the modal
const openModal = () => {
  open.value = true
}

// Close the modal
const closeModal = () => {
  open.value = false
}

// Expose functions to parent component
defineExpose({
  openModal,
})
</script>