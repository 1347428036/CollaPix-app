<template>
  <div class="space-tag-analyze">
    <a-card title="Gallery Tag Usage">
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
import type { SpaceTagAnalyzeResponse } from '@/api/api'
import { spaceAnalyzeController } from '@/api/apiFactory'
import { message } from 'ant-design-vue'
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import VChart from 'vue-echarts'
import 'echarts'
import 'echarts-wordcloud'

interface Props {
  queryAll?: boolean
  queryPublic?: boolean
  spaceId?: string
}

const props = withDefaults(defineProps<Props>(), {
  queryAll: false,
  queryPublic: false,
})

const dataList = ref<SpaceTagAnalyzeResponse[]>([])
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
  const res = await spaceAnalyzeController.getSpaceTagAnalyze({
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
  const tagData = dataList.value.map((item) => ({
    name: item.tag,
    value: item.count,
  }))

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => `${params.name}: ${params.value} times`,
    },
    series: [
      {
        type: 'wordCloud',
        gridSize: 10,
        sizeRange: [12, 50], // 字体大小范围
        rotationRange: [-90, 90],
        shape: 'circle',
        textStyle: {
          color: () =>
            `rgb(${Math.round(Math.random() * 255)}, ${Math.round(
              Math.random() * 255,
            )}, ${Math.round(Math.random() * 255)})`, // 随机颜色
        },
        data: tagData,
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
