<template>
  <div id="add-space-batch-page">
    <h2 style="margin-bottom: 1rem">Create Space</h2>
    <a-form layout="vertical" :model="formData" @finish="handleSubmit">
      <a-form-item label="Space name" name="spaceName">
        <a-input v-model:value="formData.spaceName" placeholder="Please input space name" />
      </a-form-item>
      <a-form-item label="Space Level" name="spaceLevel">
        <a-select
          v-model:value="formData.spaceLevel"
          :options="SPACE_LEVEL_OPTIONS"
          placeholder="Please select space level"
          style="min-width: 10rem"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%" :loading="loading"
          >Create or Update</a-button
        >
      </a-form-item>
    </a-form>
    <a-card title="Space level introduction">
      <a-typography-paragraph>
        * Currently, only the basic version can be activated, if you need to upgrade the space,
        please contact us
        <a href="https://codefather.cn" target="_blank">Coder Chen</a>。
      </a-typography-paragraph>
      <a-typography-paragraph v-for="(spaceLevel, index) in spaceLevelList" :key="index">
        <a-tag>{{ spaceLevel.text }}</a-tag
        >： Size {{ formatSize(spaceLevel.maxSize) }}， Amount
        {{ spaceLevel.maxCount }}
      </a-typography-paragraph>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { type SpaceVo, type SpaceAddRequest } from '@/api/api'
import { spaceController } from '@/api/apiFactory'
import { SPACE_LEVEL_ENUM, SPACE_LEVEL_OPTIONS } from '@/constant/spaceConstant'
import { formatSize } from '@/util'
import { message } from 'ant-design-vue'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const formData = reactive<SpaceAddRequest>({ spaceName: '', spaceLevel: SPACE_LEVEL_ENUM.COMMON })
const spaceLevelList = ref<{ text: string; maxSize: number; maxCount: number }[]>([])

const loading = ref(false)
const router = useRouter()
const route = useRoute()

const oldSpaceRef = ref<SpaceVo>()

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
    if (spaceId) {
      res = await spaceController.updateSpace({ id: spaceId, ...request })
    } else {
      res = await spaceController.addSpace(request)
    }

    if (res) {
      message.success('Create or Update Success')
      // Jump to home page
      router.push({
        path: `/space/${res}`,
      })
    } else {
      message.error('Create or Update space failed')
    }
  } finally {
    loading.value = false
  }
}

const fetchSpaceLevelList = async () => {
  const res = await spaceController.listSpaceLevel()
  if (res) {
    spaceLevelList.value = res
  } else {
    message.error('Loading space level failed')
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
      message.error('Failed to load page details')
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
