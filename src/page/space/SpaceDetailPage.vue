<template>
  <div id="space-detail-page">
    <!-- Space info -->
    <a-flex justify="space-between">
      <h2>{{ space.spaceName }}(private space)</h2>
      <a-space size="middle">
        <a-button type="primary" :href="`/picture/add?spaceId=${id}`" target="_blank">
          + Create Picture
        </a-button>
        <a-button :icon="h(EditOutlined)" @click="doBatchEdit"> Batch edit</a-button>
        <a-tooltip :title="usedSpaceTooltip" placement="left">
          <a-progress type="circle" :percent="caclUsedSpaceSizePercent()" :size="42" />
        </a-tooltip>
      </a-space>
    </a-flex>
    <div style="height: 1rem"></div>
    <PictureSearchForm :onSearch="onSearch" />
    <a-form-item label="Search by dominant color" style="margin-top: 1rem">
      <color-picker format="hex" @pureColorChange="onColorChange" />
    </a-form-item>

    <!-- Picture list -->
    <PictureList
      :dataList="dataList"
      :loading="loading"
      :showOp="true"
      :onReload="fetchPictureData"
    />
    <a-pagination
      style="text-align: right"
      v-model:current="searchParams.current"
      v-model:pageSize="searchParams.pageSize"
      :total="total"
      :show-total="() => `Total amount ${total} / ${space.maxCount}`"
      @change="onPageChange"
    />
    <BatchEditModal
      ref="batchEditPictureModalRef"
      :spaceId="id"
      :pictureList="dataList"
      :onSuccess="onBatchEditPictureSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
import type { PagePictureVo, PictureQueryRequest, PictureVo, SpaceVo } from '@/api/api'
import { pictureController, spaceController } from '@/api/apiFactory'
import { formatSize } from '@/util'
import { message } from 'ant-design-vue'
import { computed, onMounted, ref, h } from 'vue'
import PictureList from '@/components/PictureList.vue'
import PictureSearchForm from '@/components/PictureSearchForm.vue'
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'
import BatchEditModal from '@/components/BatchEditModal.vue'
import { EditOutlined } from '@ant-design/icons-vue'

const props = defineProps<{
  id: string
}>()
const space = ref<SpaceVo>({})
// Data
const dataList = ref<PictureVo[]>([])
const total = ref(0)
const loading = ref(true)
const usedSpaceTooltip = computed(() => {
  if (space.value) {
    return `Used space ${formatSize(space.value.totalSize)} / ${formatSize(space.value.maxSize)}`
  }

  return 'Unknown'
})

// Search parameters
const searchParams = ref<PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'desc',
})

const batchEditPictureModalRef = ref()

onMounted(() => {
  fetchSpaceDetail()
  fetchPictureData()
})

const onPageChange = (page: number, pageSize: number) => {
  searchParams.value.current = page
  searchParams.value.pageSize = pageSize
  fetchPictureData()
}

const onSearch = (newSearchParams: PictureQueryRequest) => {
  searchParams.value = {
    ...searchParams.value,
    ...newSearchParams,
    current: 1,
  }
  fetchPictureData()
}

// Fetch data
const fetchPictureData = async () => {
  loading.value = true
  // Convert search parameters
  const params = {
    spaceId: String(props.id),
    publicSpace: false,
    ...searchParams.value,
  }
  const res = (await pictureController.listPictureVoByPage(params)) as PagePictureVo
  if (res) {
    dataList.value = res.records ?? []
    total.value = res.total ?? 0
  } else {
    message.error('Load data failed')
  }
  loading.value = false
}

// Fetch space details
const fetchSpaceDetail = async () => {
  try {
    const res = (await spaceController.getSpaceVoById(String(props.id))) as SpaceVo
    if (res) {
      space.value = res
    } else {
      message.error('Failed to load page details')
    }
  } catch (e: unknown) {
    message.error('Failed to load page details' + e)
  }
}

const caclUsedSpaceSizePercent = () => {
  if (space.value.totalSize && space.value.maxSize) {
    return ((space.value.totalSize * 100) / space.value.maxSize).toFixed(1)
  }

  return 0
}

const onColorChange = async (color: string) => {
  const res = await pictureController.searchPictureByColor({
    picColor: color,
    spaceId: props.id,
  })
  if (res && res instanceof Array) {
    const data = res ?? []
    dataList.value = data
    total.value = data.length
  } else {
    message.error('Search picture by color failed')
  }
}

const onBatchEditPictureSuccess = () => {
  fetchPictureData()
}

const doBatchEdit = () => {
  if (batchEditPictureModalRef.value) {
    batchEditPictureModalRef.value.openModal()
  }
}
</script>

<style scoped>
#space-detail-page {
  overflow: hidden;
}
</style>
