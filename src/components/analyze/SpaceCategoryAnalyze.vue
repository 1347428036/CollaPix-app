<template>
  <div class="space-category-analyze">
    <a-card title="Space usage by Category">
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
import type { SpaceCategoryAnalyzeResponse } from '@/api/api'
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

const dataList = ref<SpaceCategoryAnalyzeResponse[]>([])
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
  const res = await spaceAnalyzeController.getSpaceCategoryAnalyze({
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
  const categories = dataList.value.map((item) => item.category)
  const countData = dataList.value.map((item) => item.count)
  const sizeData = dataList.value.map((item) => (item.totalSize ?? 0 / (1024 * 1024)).toFixed(2))

  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Image Count', 'Total Image Size'], top: 'bottom' },
    xAxis: { type: 'category', data: categories },
    yAxis: [
      {
        type: 'value',
        name: 'Image Count',
        axisLine: { show: true, lineStyle: { color: '#5470C6' } },
      },
      {
        type: 'value',
        name: 'Total Image Size (MB)',
        position: 'right',
        axisLine: { show: true, lineStyle: { color: '#91CC75' } },
        splitLine: {
          lineStyle: {
            color: '#91CC75',
            type: 'dashed',
          },
        },
      },
    ],
    series: [
      { name: 'Image Count', type: 'bar', data: countData, yAxisIndex: 0 },
      { name: 'Total Image Size', type: 'bar', data: sizeData, yAxisIndex: 1 },
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
