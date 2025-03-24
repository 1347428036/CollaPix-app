<template>
  <div class="url-picture-upload">
    <a-input-group compact style="margin-bottom: 16px">
      <a-input
        v-model:value="fileUrl"
        style="width: calc(100% - 9rem)"
        :placeholder="$t('pictureUploadPage.inputPictureUrl')"
      />
      <a-button type="primary" :loading="loading" @click="handleUpload" style="width: 9rem"
        >{{ $t('submit') }}</a-button
      >
    </a-input-group>
    <div class="img-wrapper">
      <a-image v-if="picture?.url" :src="picture?.url" alt="url picture" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import type { PictureUploadRequest, PictureVo } from '@/api/api.ts'
import { pictureController } from '@/api/apiFactory'
import { useI18n } from 'vue-i18n'

interface Props {
  picture?: PictureVo
  onSuccess?: (newPicture: PictureVo) => void
}

const props = defineProps<Props>()
const { t } = useI18n()
const loading = ref<boolean>(false)
const fileUrl = ref<string>()

/**
 * Upload
 */
const handleUpload = async () => {
  loading.value = true
  try {
    const params: PictureUploadRequest = { url: fileUrl.value }
    if (props.picture) {
      params.id = props.picture.id
    }
    const res = await pictureController.uploadPictureByUrl(params) as PictureVo
    if (res) {
      message.success(t('pictureUploadPage.pictureUploadSuccess'))
      // Pass the uploaded picture information to the parent component
      props.onSuccess?.(res)
    } else {
      message.error(t('pictureUploadPage.pictureUploadFailed'))
    }
  } finally {
    loading.value = false
  }
}
</script>
<style scoped>
.url-picture-upload .img-wrapper {
  max-width: 100%;
  max-height: 30rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
  text-align: center;
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
