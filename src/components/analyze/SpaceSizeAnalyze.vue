<template>
  <div class="space-size-analyze">
    <a-card title="Space Size Usage">
      <v-chart
        ref="chartRef"
        :option="options"
        style="height: 320px; max-width: 100%"
        :loading="loading"
      />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import type { SpaceSizeAnalyzeResponse } from '@/api/api'
import { spaceAnalyzeController } from '@/api/apiFactory'
import { message } from 'ant-design-vue'
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import VChart from 'vue-echarts'
import 'echarts'

interface Props {
  queryAll?: boolean
  queryPublic?: boolean
  spaceId?: string
}

const props = withDefaults(defineProps<Props>(), {
  queryAll: false,
  queryPublic: false,
})

const dataList = ref<SpaceSizeAnalyzeResponse[]>([])
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
  const res = await spaceAnalyzeController.getSpaceSizeAnalyze({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId,
  })
  if (res) {
    dataList.value = res ?? []
  } else {
    message.error('Failed to load data')
  }
  loading.value = false
}

const options = computed(() => {
  const pieData = dataList.value.map((item) => ({
    name: item.sizeRange,
    value: item.count,
  }))

  return {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      top: 'bottom',
    },
    series: [
      {
        name: 'Picture size',
        type: 'pie',
        radius: '50%',
        data: pieData,
      },
    ],
  }
})

/**
 * Watch variables, reload data when they change
 */
watchEffect(() => {
  fetchData()
})
</script>
