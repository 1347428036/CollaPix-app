<template>
  <div id="add-picture-batch-page">
    <h2 style="margin-bottom: 1rem">Create Picture</h2>
    <a-form layout="vertical" :model="formData" @finish="handleSubmit">
      <a-form-item label="Search Text" name="searchText">
        <a-input v-model:value="formData.searchText" placeholder="Please input search text" />
      </a-form-item>
      <a-form-item label="Picture count" name="count">
        <a-input-number
          v-model:value="formData.count"
          placeholder="Please input number"
          style="min-width: 10rem"
          :min="1"
          :max="30"
        />
      </a-form-item>
      <a-form-item label="Name prefix" name="namePrefix">
        <a-input
          v-model:value="formData.namePrefix"
          placeholder="Please input name prefix, will auto add series number"
          :options="categoryOptions"
          allowClear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%" :loading="loading"
          >Execute Job</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import type { PictureTagCategory, PictureUploadByBatchRequest } from '@/api/api'
import { pictureController } from '@/api/apiFactory'
import { message } from 'ant-design-vue'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const formData = reactive<PictureUploadByBatchRequest>({ count: 10 })

const loading = ref(false)
const router = useRouter()
const categoryOptions = ref<{ value: string; label: string }[]>([
  {
    value: '',
    label: '',
  },
])
const tagOptions = ref<{ value: string; label: string }[]>([
  {
    value: '',
    label: '',
  },
])

onMounted(() => {
  getTagCategoryOptions()
})

/**
 * Submit form
 * @param request
 */
const handleSubmit = async (request: PictureUploadByBatchRequest) => {
  loading.value = true
  try {
    const res = await pictureController.uploadPictureByBatch(request)
    if (res) {
      message.success(`Execute Success, total: ${res}`)
      // Jump to home page
      router.push({
        path: '/',
      })
    } else {
      message.error('Execute Failed')
    }
  } finally {
    loading.value = false
  }
}

// 获取标签和分类选项
const getTagCategoryOptions = async () => {
  const res = (await pictureController.listPictureTagCategory()) as PictureTagCategory
  if (res) {
    // 转换成下拉选项组件接受的格式
    tagOptions.value = (res.tags ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
    categoryOptions.value = (res.categories ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
  } else {
    message.error('Load options failed')
  }
}
</script>

<style scoped>
#add-picture-batch-page {
  max-width: 45rem;
  margin: 0 auto;
}
</style>
