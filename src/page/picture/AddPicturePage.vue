<template>
  <div id="add-picture-page">
    <h2 style="margin-bottom: 1rem">{{ route.query?.id ? 'Update Picture' : 'Create Picture' }}</h2>
    <a-typography-paragraph v-if="spaceId" type="secondary">
      Save to space<a :href="`/space/${spaceId}`" target="_blank">{{ spaceId }}</a>
    </a-typography-paragraph>

    <!-- Choose upload type -->
    <a-tabs v-model:activeKey="uploadType"
      >>
      <a-tab-pane key="file" tab="File upload">
        <PictureUpload :picture="picture" :spaceId="spaceId" :onSuccess="onSuccess" />
      </a-tab-pane>
      <a-tab-pane key="url" tab="URL upload" force-render>
        <UrlPictureUpload :picture="picture" :spaceId="spaceId" :onSuccess="onSuccess" />
      </a-tab-pane>
    </a-tabs>

    <a-form v-if="picture.id" layout="vertical" :model="pictureForm" @finish="handleSubmit">
      <a-form-item label="Name" name="name">
        <a-input v-model:value="pictureForm.name" placeholder="Please input name" />
      </a-form-item>
      <a-form-item label="Introduction" name="introduction">
        <a-textarea
          v-model:value="pictureForm.introduction"
          placeholder="Please input introduction"
          :rows="2"
          :autoSize="{ minRows: 2, maxRows: 5 }"
          allowClear
        />
      </a-form-item>
      <a-form-item label="Category" name="category">
        <a-auto-complete
          v-model:value="pictureForm.category"
          placeholder="Please input category"
          :options="categoryOptions"
          allowClear
        />
      </a-form-item>
      <a-form-item label="Tag" name="tags">
        <a-select
          v-model:value="pictureForm.tags"
          mode="tags"
          :options="tagOptions"
          placeholder="Please input tag"
          allowClear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">Create</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import type { PictureEditRequest, PictureTagCategory, PictureVo } from '@/api/api'
import { pictureController } from '@/api/apiFactory'
import PictureUpload from '@/components/PictureUpload.vue'
import { message } from 'ant-design-vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UrlPictureUpload from '@/components/UrlPictureUpload.vue'

const pictureForm = reactive<PictureEditRequest>({})

const picture = ref<PictureVo>({})
const router = useRouter()
const route = useRoute()
const uploadType = ref<'file' | 'url'>('file')
const spaceId = computed(() => route.query?.spaceId as string)

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
  getOldPicture()
})

/**
 * Submit form
 * @param request
 */
const handleSubmit = async (request: PictureEditRequest) => {
  const pictureId = picture.value.id
  if (!pictureId) {
    return
  }

  request.id = pictureId
  request.spaceId = spaceId.value ? spaceId.value : picture.value.spaceId
  const res = await pictureController.editPicture(request)
  if (res) {
    message.success('Update Success')
    router.push({
      path: `/picture/${pictureId}`,
    })
  } else {
    message.error('Create Failed')
  }
}

const onSuccess = (newPicture: PictureVo) => {
  picture.value = newPicture
  pictureForm.name = newPicture.name
}

const getTagCategoryOptions = async () => {
  const res = (await pictureController.listPictureTagCategory()) as PictureTagCategory
  if (res) {
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

const getOldPicture = async () => {
  const pictureId = route.query.id as string
  if (pictureId) {
    const res = (await pictureController.getPictureVoById(pictureId)) as PictureVo
    if (res) {
      picture.value = res
      pictureForm.name = res.name
      pictureForm.introduction = res.introduction
      pictureForm.category = res.category
      pictureForm.tags = res.tags
    }
  }
}
</script>

<style scoped>
#add-picture-page {
  max-width: 45rem;
  margin: 0 auto;
}
</style>
