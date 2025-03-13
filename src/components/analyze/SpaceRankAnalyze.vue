<template>
  <div class="space-size-analyze">
    <a-card title="Space Using Ranking">
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
import type { SpaceVo } from '@/api/api'
import { spaceAnalyzeController } from '@/api/apiFactory'
import { message } from 'ant-design-vue'
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import VChart from 'vue-echarts'
import 'echarts'

interface Props {
  topN?: number
}

const props = withDefaults(defineProps<Props>(), {
  topN: 10,
})

const dataList = ref<SpaceVo[]>([])
const loading = ref(true)
const chartRef = ref()

const handleResize = () => {
  if (chartRef.value) {
    chartRef.value.resize()
  }
}

function useDebounce(fn: { (): void; (): void }, delay: number) {
  let timer: number | null = null
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn()
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
  const res = (await spaceAnalyzeController.getSpaceRankAnalyze({
    topN: props.topN,
  })) as unknown as SpaceVo[]
  if (res) {
    dataList.value = res ?? []
  } else {
    message.error('Failed to load data')
  }
  loading.value = false
}

const options = computed(() => {
  const spaceNames = dataList.value.map((item) => item.spaceName)
  const usageData = dataList.value.map((item) => ((item.totalSize ?? 0) / (1024 * 1024)).toFixed(2))

  return {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: spaceNames,
    },
    yAxis: {
      type: 'value',
      name: 'Space usage (MB)',
    },
    series: [
      {
        name: 'Space usage (MB)',
        type: 'bar',
        data: usageData,
        itemStyle: {
          color: '#5470C6',
        },
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
