<template>
  <div class="space-usage-analyze">
    <a-flex gap="middle">
      <a-card title="Space Usage" style="width: 50%">
        <div style="height: 320px; text-align: center">
          <h3>
            {{ formatSize(data.usedSize) }} /
            {{ data.maxSize ? formatSize(data.maxSize) : 'Unlimited' }}
          </h3>
          <a-progress type="dashboard" :percent="data.sizeUsageRatio ?? 0" />
        </div>
      </a-card>
      <a-card title="Image Count" style="width: 50%">
        <div style="height: 320px; text-align: center">
          <h3>{{ data.usedCount }} / {{ data.maxCount ?? 'Unlimited' }}</h3>
          <a-progress type="dashboard" :percent="data.countUsageRatio ?? 0" />
        </div>
      </a-card>
    </a-flex>
  </div>
</template>

<script setup lang="ts">
import type { SpaceUsageAnalyzeResponse } from '@/api/api'
import { spaceAnalyzeController } from '@/api/apiFactory'
import { formatSize } from '@/util'
import { message } from 'ant-design-vue'
import { ref, watchEffect } from 'vue'

interface Props {
  queryAll?: boolean
  queryPublic?: boolean
  spaceId?: string
}

const props = withDefaults(defineProps<Props>(), {
  queryAll: false,
  queryPublic: false,
})

const data = ref<SpaceUsageAnalyzeResponse>({})
const loading = ref(true)

const fetchData = async () => {
  loading.value = true
  const res = await spaceAnalyzeController.getSpaceUsageAnalyze({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId,
  })
  if (res) {
    data.value = res
  } else {
    message.error('Failed to get data')
  }
  loading.value = false
}

/**
 * Watch variables, reload data when they change
 */
watchEffect(() => {
  fetchData()
})
</script>
