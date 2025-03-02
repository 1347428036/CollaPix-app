<template>
  <a-modal
    class="image-out-painting"
    v-model:open="open"
    title="AI Out Painting"
    :footer="false"
    @cancel="closeModal"
  >
    <a-row :gutter="16">
      <a-col span="12">
        <h4>Original Image</h4>
        <img :src="picture?.url" :alt="picture?.name" style="max-width: 100%" />
      </a-col>
      <a-col span="12">
        <h4>Outpainting Result</h4>
        <img
          v-if="resultImageUrl"
          :src="resultImageUrl"
          :alt="picture?.name"
          style="max-width: 100%"
        />
      </a-col>
    </a-row>
    <div style="margin-bottom: 16px"></div>
    <a-flex gap="16" justify="center">
      <a-button type="primary" ghost :loading="!!taskId" @click="createTask">Generate Image</a-button>
      <a-button type="primary" :loading="uploadLoading" @click="handleUpload">Apply Result</a-button>
    </a-flex>
  </a-modal>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { message } from 'ant-design-vue'
import type { PictureVo } from '@/api/api'
import { pictureController } from '@/api/apiFactory'
import type { PictureUploadRequest } from '@/api/api'

interface Props {
  picture?: PictureVo
  spaceId?: string
  onSuccess?: (newPicture: PictureVo) => void
}

const props = defineProps<Props>()
const open = ref(false)
const resultImageUrl = ref<string>()
const uploadLoading = ref<boolean>(false)

const taskId = ref<string>()
let pollingTimer: NodeJS.Timeout = null

const createTask = async () => {
  if (!props.picture?.id) {
    return
  }
  const res = await pictureController.createPictureOutPaintingTask({
    pictureId: props.picture.id,
    parameters: {
      xScale: 2,
      yScale: 2,
    },
  })
  if (res) {
    message.success('Task created successfully, please wait patiently and do not exit the interface')
    taskId.value = res.output.taskId
    startPolling()
  } else {
    console.error('Create task failed, ' + res.message)
    message.error('Create task failed')
  }
}

const clearPolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
    taskId.value = undefined
  }
}

const startPolling = () => {
  if (!taskId.value) return

  pollingTimer = setInterval(async () => {
    try {
      const res = await pictureController.getPictureOutPaintingTaskStatus(taskId.value)
      if (res) {
        const taskResult = res.output
        if (taskResult.taskStatus === 'SUCCEEDED') {
          message.success('Outpainting task succeeded')
          resultImageUrl.value = taskResult.outputImageUrl
          clearPolling()
        } else if (taskResult.taskStatus === 'FAILED') {
          message.error('Outpainting task failed')
          clearPolling()
        }
      }
    } catch (error) {
      console.error('Polling task status failed', error)
      message.error('Failed to detect task status, please try again later')
      clearPolling()
    }
  }, 3000)
}

const handleUpload = async () => {
  uploadLoading.value = true
  try {
    const params: PictureUploadRequest = {
      url: resultImageUrl.value,
      spaceId: props.spaceId,
    }
    if (props.picture) {
      params.id = props.picture.id
    }
    const res = await pictureController.uploadPictureByUrl(params)
    if (res) {
      message.success('Image upload succeeded')
      // Pass the uploaded image information to the parent component
      props.onSuccess?.(res)
      // Close the modal
      closeModal()
    } else {
      message.error('Image upload failed')
    }
  } catch (error) {
    console.error(error)
    message.error('Image upload failed')
  } finally {
    uploadLoading.value = false
  }
}

const openModal = () => {
  open.value = true
}

const closeModal = () => {
  open.value = false
}

// Clear the timer to avoid memory leaks
onUnmounted(() => {
  clearPolling()
})

defineExpose({
  openModal,
})
</script>

<style scoped>
.image-out-painting {
  text-align: center;
}
</style>