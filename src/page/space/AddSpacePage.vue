<template>
  <div id="add-space-batch-page">
    <h2 style="margin-bottom: 1rem">
      {{ route.query?.id ? $t('update') : $t('create') }} {{ SPACE_TYPE_MAP[spaceType] }}
    </h2>
    <a-form layout="vertical" :model="formData" @finish="handleSubmit">
      <a-form-item :label="$t('spaceNameLabel')" name="spaceName">
        <a-input v-model:value="formData.spaceName" :placeholder="$t('spaceNamePlaceholder')" />
      </a-form-item>
      <a-form-item :label="$t('spaceLevelLabel')" name="spaceLevel">
        <a-select
          v-model:value="formData.spaceLevel"
          :options="SPACE_LEVEL_OPTIONS"
          :placeholder="$t('spaceLevelPlaceholder')"
          style="min-width: 10rem"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%" :loading="loading"
          >{{ $t('addSpacePage.createOrUpdateButton') }}</a-button
        >
      </a-form-item>
    </a-form>
    <a-card :title="$t('addSpacePage.spaceLevelIntroductionTitle')">
      <a-typography-paragraph>
        * {{ $t('addSpacePage.spaceLevelIntroductionText') }}
        <a href="#" target="_blank">Coder Chen</a>。
      </a-typography-paragraph>
      <a-typography-paragraph v-for="(spaceLevel, index) in spaceLevelList" :key="index">
        <a-tag>{{ spaceLevel.text }}</a-tag
        >： {{ $t('size') }} {{ formatSize(spaceLevel.maxSize) }}， {{ $t('addSpacePage.amountLabel') }}
        {{ spaceLevel.maxCount }}
      </a-typography-paragraph>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { type SpaceVo, type SpaceAddRequest, type SpaceLevel } from '@/api/api'
import { spaceController } from '@/api/apiFactory'
import {
  SPACE_LEVEL_ENUM,
  SPACE_LEVEL_OPTIONS,
  SPACE_TYPE_ENUM,
  SPACE_TYPE_MAP,
} from '@/constant/spaceConstant'
import { formatSize } from '@/util'
import { message } from 'ant-design-vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const { t } = useI18n()
const formData = reactive<SpaceAddRequest>({ spaceName: '', spaceLevel: SPACE_LEVEL_ENUM.COMMON })
const spaceLevelList = ref<{ text?: string; maxSize?: number; maxCount?: number }[]>([])

const loading = ref(false)
const router = useRouter()
const route = useRoute()

const oldSpaceRef = ref<SpaceVo>()

const spaceType = computed(() => {
  if (route.query?.type) {
    return Number(route.query.type)
  }
  return SPACE_TYPE_ENUM.PRIVATE
})

onMounted(() => {
  fetchSpaceLevelList()
  fetchOldSpace()
})

/**
 * Submit form
 * @param request
 */
const handleSubmit = async (request: SpaceAddRequest) => {
  loading.value = true
  const spaceId = oldSpaceRef.value?.id
  let res
  try {
    let responseSpaceId = spaceId
    if (spaceId) {
      res = await spaceController.updateSpace({ id: spaceId, ...request })
    } else {
      request.spaceType = spaceType.value
      res = await spaceController.addSpace(request)
      responseSpaceId = res as unknown as string
    }

    if (res) {
      message.success(t('addSpacePage.createOrUpdateSuccessMessage'))
      // Jump to home page
      router.push({
        path: `/space/${responseSpaceId}`,
      })
    } else {
      message.error(t('addSpacePage.createOrUpdateErrorMessage'))
    }
  } finally {
    loading.value = false
  }
}

const fetchSpaceLevelList = async () => {
  const res = await spaceController.listSpaceLevel() as unknown as SpaceLevel[]
  if (res) {
    spaceLevelList.value = res
  } else {
    message.error(t('addSpacePage.loadSpaceLevelErrorMessage'))
  }
}

const fetchOldSpace = async () => {
  const spaceId = route.query.id as string
  if (spaceId) {
    const res = (await spaceController.getSpaceVoById(spaceId)) as SpaceVo
    if (res) {
      oldSpaceRef.value = res
      formData.spaceName = res.spaceName
      formData.spaceLevel = res.spaceLevel
    } else {
      message.error(t('addSpacePage.loadPageDetailsErrorMessage'))
    }
  }
}
</script>

<style scoped>
#add-space-batch-page {
  max-width: 45rem;
  margin: 0 auto;
}
</style>
