<template>
  <div>
    <a-modal v-model:open="open" :title="$t('batchEditPictures')" :footer="false" @cancel="closeModal">
      <a-typography-paragraph type="secondary"
        >{{ $t('onlyAppliesToCurrentPage') }}</a-typography-paragraph
      >
      <!-- Form items -->
      <a-form layout="vertical" :model="formData" @finish="handleSubmit">
        <a-form-item :label="$t('category')" name="category">
          <a-auto-complete
            v-model:value="formData.category"
            :options="categoryOptions"
            :placeholder="$t('inputCategoryName')"
            allowClear
          />
        </a-form-item>
        <a-form-item :label="$t('tagLabel')" name="tags">
          <a-select
            v-model:value="formData.tags"
            :options="tagOptions"
            mode="tags"
            :placeholder="$t('inputTags')"
            allowClear
          />
        </a-form-item>
        <a-form-item :label="$t('tagNamingRuleLabel')" name="nameRule">
          <a-input
            v-model:value="formData.nameRule"
            :placeholder="$t('tagNamingRulePlaceholder')"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">{{ $t('submit') }}</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import type { PictureTagCategory, PictureVo } from '@/api/api.ts'
import { pictureController } from '@/api/apiFactory'
import type { PictureEditByBatchRequest } from '@/api/api.ts'

interface Props {
  pictureList: PictureVo[]
  spaceId: string
  onSuccess: () => void
}

type Option = {
  value: string
  label: string
}

const props = withDefaults(defineProps<Props>(), {})
const open = ref(false)

const openModal = () => {
  open.value = true
}

const closeModal = () => {
  open.value = false
}

const formData = reactive({
  category: '',
  tags: [],
  nameRule: '',
})

const categoryOptions = ref<Array<Option>>([])
const tagOptions = ref<Array<Option>>([])

onMounted(() => {
  getTagCategoryOptions()
})

const getTagCategoryOptions = async () => {
  const res = (await pictureController.listPictureTagCategory()) as PictureTagCategory
  if (res) {
    // Convert to select options
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
    message.error('Loading options failed')
  }
}

const handleSubmit = async (values: PictureEditByBatchRequest) => {
  if (!props.pictureList) {
    return
  }
  try {
    const res = await pictureController.editPictureByBatch({
      pictureIdList: props.pictureList
        .map((picture) => picture.id)
        .filter((id): id is string => id !== undefined),
      spaceId: props.spaceId,
      ...values,
    })
    if (res) {
      message.success('Update success')
      closeModal()
      props.onSuccess?.()
    } else {
      message.error('Update failed')
    }
  } finally {
    resetForm()
  }
}

const resetForm = () => {
  formData.category = ''
  formData.tags = []
  formData.nameRule = ''
}

defineExpose({
  openModal,
})
</script>
