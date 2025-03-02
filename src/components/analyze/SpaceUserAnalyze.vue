<template>
  <div class="space-user-analyze">
    <a-card title="User Space usage">
      <v-chart
        ref="chartRef"
        :option="options"
        style="height: 320px; max-width: 100%"
        :loading="loading"
      />
      <template #extra>
        <a-space>
          <a-segmented v-model:value="timeDimension" :options="timeDimensionOptions" />
          <a-input-search
            v-if="searchable"
            placeholder="Please input user id"
            enter-button="Search user"
            @search="doSearch"
          />
        </a-space>
      </template>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import type { SpaceUserAnalyzeResponse } from '@/api/api'
import { spaceAnalyzeController } from '@/api/apiFactory'
import { message } from 'ant-design-vue'
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import VChart from 'vue-echarts'
import 'echarts'

interface Props {
  queryAll?: boolean
  queryPublic?: boolean
  spaceId?: string
  searchable: boolean
}
const userId = ref<string>()
const timeDimension = ref<string>('day')
const timeDimensionOptions = [
  {
    label: 'Day',
    value: 'day',
  },
  {
    label: 'Weekly',
    value: 'week',
  },
  {
    label: 'Monthly',
    value: 'month',
  },
]

const props = withDefaults(defineProps<Props>(), {
  queryAll: false,
  queryPublic: false,
  searchable: false,
})

const dataList = ref<SpaceUserAnalyzeResponse[]>([])
const loading = ref(true)
const chartRef = ref()

const handleResize = () => {
  if (chartRef.value) {
    chartRef.value.resize()
  }
}

function useDebounce<T extends (...args: unknown[]) => void>(fn: T, delay: number) {
  let timer: number | null = null
  return function (this: unknown, ...args: unknown[]) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

const debuncedResize = useDebounce(handleResize, 200)
onMounted(() => {
  window.addEventListener('resize', debuncedResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', debuncedResize)
})

const fetchData = async () => {
  loading.value = true
  const res = await spaceAnalyzeController.getSpaceUserAnalyze({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId,
    timeDimension: timeDimension.value,
    userId: userId.value,
  })
  if (res) {
    dataList.value = res ?? []
  } else {
    message.error('Failed to load data')
  }
  loading.value = false
}

const options = computed(() => {
  const periods = dataList.value.map((item) => item.period)
  const counts = dataList.value.map((item) => item.count)

  return {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: periods, name: 'Time period' },
    yAxis: { type: 'value', name: 'Upload count' },
    series: [
      {
        name: 'Upload count',
        type: 'line',
        data: counts,
        smooth: true,
        emphasis: {
          focus: 'series',
        },
      },
    ],
  }
})

const doSearch = (value: string) => {
  userId.value = value
}

/**
 * Watch variables, reload data when they change
 */
watchEffect(() => {
  fetchData()
})
</script>
