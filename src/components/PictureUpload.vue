<template>
  <div class="picture-upload">
    <a-upload
      list-type="picture-card"
      :show-upload-list="false"
      :custom-request="handleUpload"
      :before-upload="beforeUpload"
    >
      <img v-if="imageUrl" :src="imageUrl" alt="picture" />
      <div v-else>
        <loading-outlined v-if="loading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text">Click or Drag picture</div>
      </div>
    </a-upload>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { UploadFile } from 'ant-design-vue'
import type { PictureVo } from '@/api/api.ts'
import { pictureController } from '@/api/apiFactory'

interface Props {
  picture?: PictureVo
  spaceId?: string
  onSuccess?: (newPicture: PictureVo) => void
}

const props = defineProps<Props>()
const loading = ref<boolean>(false)
const imageUrl = computed(() => props.picture?.url)
/**
 * Upload
 * @param file
 */
const handleUpload = async ({ file }: never) => {
  loading.value = true
  try {
    const id = props.picture ? props.picture.id : undefined

    const res = await pictureController.uploadPicture(file, id, props.spaceId)
    if (res) {
      message.success('Picture upload success')
      // Pass the uploaded image information to the parent component
      props.onSuccess?.(res as PictureVo)
    } else {
      message.error('Picture upload failed')
    }
  } finally {
    loading.value = false
  }
}

const beforeUpload = (file: UploadFile) => {
  if (!file) {
    return false
  }

  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('You can only upload JPG or PNG file!')
  }
  const isLt2M = file.size && file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!')
  }
  return isJpgOrPng && isLt2M
}
</script>
<style scoped>
.picture-upload :deep(.ant-upload) {
  width: 100% !important;
  height: 100% !important;
  min-width: 10rem;
  min-height: 10rem;
}

.picture-upload img {
  max-width: 100%;
  max-height: 30rem;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
