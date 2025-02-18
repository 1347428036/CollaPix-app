<template>
  <a-modal v-model:open="open" title="Share picture" :footer="false" @cancel="closeModal">
    <h4>Copy share link</h4>
    <a-typography-link copyable>
      {{ link }}
    </a-typography-link>
    <div style="margin-bottom: 16px"></div>
    <h4>Scan QR code to view on mobile</h4>
    <a-qrcode :value="link" />
  </a-modal>
</template>

<script setup lang="ts">
import { defineProps, ref, withDefaults, defineExpose } from 'vue'

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
const props = withDefaults(defineProps<Props>(), {
  title: () => 'Share',
  link: () => 'https://laoyujianli.com/share/yupi',
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
