<template>
  <div id="space-detail-page">
    <!-- Space info -->
    <a-flex justify="space-between">
      <h2>
        {{ space.spaceName }}({{ SPACE_TYPE_MAP[space.spaceType ?? SPACE_TYPE_ENUM.PRIVATE] }})
      </h2>
      <a-space size="middle">
        <a-button
          v-if="canManageSpaceUser && SPACE_TYPE_ENUM.TEAM === space.spaceType"
          type="primary"
          ghost
          :icon="h(TeamOutlined)"
          @click="openSpaceUserManagementModal"
        >
          Member management
        </a-button>
        <a-button
          v-if="canUploadPicture"
          type="primary"
          :href="`/picture/add?spaceId=${id}`"
          target="_blank"
        >
          + Create picture
        </a-button>
        <a-button
          type="primary"
          ghost
          :icon="h(BarChartOutlined)"
          :href="`/analyze/space?spaceId=${id}`"
          target="_blank"
        >
          Space analyze
        </a-button>

        <a-button v-if="canEditPicture" :icon="h(EditOutlined)" @click="doBatchEdit">
          Batch edit</a-button
        >
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
      :can-edit="canEditPicture"
      :can-delete="canDeletePicture"
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

    <!-- Space User Management Modal -->
    <a-modal
      v-model:visible="isSpaceUserManagementModalVisible"
      title="Member Management"
      width="80%"
      :footer="null"
      @cancel="closeSpaceUserManagementModal"
    >
      <SpaceUserManagementPage :spaceId="id" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import type { PagePictureVo, PictureQueryRequest, PictureVo, SpaceVo } from '@/api/api'
import { pictureController, spaceController } from '@/api/apiFactory'
import { formatSize } from '@/util'
import { message } from 'ant-design-vue'
import { computed, onMounted, ref, h, watch } from 'vue'
import PictureList from '@/components/PictureList.vue'
import PictureSearchForm from '@/components/PictureSearchForm.vue'
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'
import BatchEditModal from '@/components/BatchEditModal.vue'
import SpaceUserManagementPage from '@/page/admin/SpaceUserManagementPage.vue'
import { BarChartOutlined, EditOutlined, TeamOutlined } from '@ant-design/icons-vue'
import { SPACE_PERMISSION_ENUM, SPACE_TYPE_ENUM, SPACE_TYPE_MAP } from '@/constant/spaceConstant'

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

// 通用权限检查函数
function createPermissionChecker(permission: string) {
  return computed(() => {
    return (space.value.permissions ?? []).includes(permission)
  })
}

// 定义权限检查
const canManageSpaceUser = createPermissionChecker(SPACE_PERMISSION_ENUM.SPACE_USER_MANAGE)
const canUploadPicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_UPLOAD)
const canEditPicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_EDIT)
const canDeletePicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_DELETE)

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

// Space User Management Modal Logic
const isSpaceUserManagementModalVisible = ref(false)

const openSpaceUserManagementModal = () => {
  isSpaceUserManagementModalVisible.value = true
}

const closeSpaceUserManagementModal = () => {
  isSpaceUserManagementModalVisible.value = false
}

watch(
  () => props.id,
  () => {
    fetchSpaceDetail()
    fetchPictureData()
  },
)
</script>

<style scoped>
#space-detail-page {
  overflow: hidden;
}
</style>
