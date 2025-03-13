<template>
  <div id="add-picture-page">
    <h2 style="margin-bottom: 1rem">{{ route.query?.id ? 'Update Picture' : 'Create Picture' }}</h2>
    <a-typography-paragraph v-if="spaceId && spaceId !== PUBLIC_SPACE_ID" type="secondary">
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
    <!-- Picture editing -->
    <div v-if="picture.id" class="edit-bar">
      <a-space>
        <a-button :icon="h(EditOutlined)" @click="doEditPicture">Edit picture</a-button>
        <a-button type="primary" ghost :icon="h(FullscreenOutlined)" @click="doImageOutPainting"
          >AI Out-Painting</a-button
        >
      </a-space>
      <ImageCropper
        ref="imageCropperRef"
        :imageUrl="picture?.url"
        :picture="picture"
        :space-id="spaceId"
        :space="space"
        @success="onCropSuccess"
      />
      <ImageOutPainting
        ref="imageOutPaintingRef"
        :picture="picture"
        :space-id="spaceId"
        @success="onOutPaintingSuccess"
      />
    </div>

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
        <a-button type="primary" html-type="submit" style="width: 100%">{{
          route.query?.id ? 'Update' : 'Create'
        }}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import type { PictureEditRequest, PictureTagCategory, PictureVo, SpaceVo } from '@/api/api'
import { pictureController, spaceController } from '@/api/apiFactory'
import PictureUpload from '@/components/PictureUpload.vue'
import { message } from 'ant-design-vue'
import { computed, onMounted, reactive, ref, h, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UrlPictureUpload from '@/components/UrlPictureUpload.vue'
import ImageCropper from '@/components/ImageCropper.vue'
import ImageOutPainting from '@/components/ImageOutPainting.vue'
import { EditOutlined, FullscreenOutlined } from '@ant-design/icons-vue'
import { PUBLIC_SPACE_ID } from '@/constant/spaceConstant'

const pictureForm = reactive<PictureEditRequest>({})

const picture = ref<PictureVo>({})
const router = useRouter()
const route = useRoute()
const uploadType = ref<'file' | 'url'>('file')
const spaceId = computed(() => route.query?.spaceId as string)
// Picture editing modal ref
const imageCropperRef = ref()
const imageOutPaintingRef = ref()

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
const space = ref<SpaceVo>()

// 获取空间信息
const fetchSpace = async () => {
  // 获取数据
  if (spaceId.value) {
    const res = await spaceController.getSpaceVoById(spaceId.value)
    if (res) {
      space.value = res as SpaceVo
    }
  }
}

watchEffect(() => {
  fetchSpace()
})

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

const doEditPicture = () => {
  if (imageCropperRef.value) {
    imageCropperRef.value.openModal()
  }
}

const onCropSuccess = (newPicture: PictureVo) => {
  picture.value = newPicture
}

const doImageOutPainting = () => {
  if (imageOutPaintingRef.value) {
    imageOutPaintingRef.value.openModal()
  }
}

const onOutPaintingSuccess = (newPicture: PictureVo) => {
  picture.value = newPicture
}
</script>

<style scoped>
#add-picture-page {
  max-width: 45rem;
  margin: 0 auto;
}

#add-picture-page .edit-bar {
  text-align: center;
  margin: 1rem 0;
}
</style>
