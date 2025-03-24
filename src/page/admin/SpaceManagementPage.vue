<template>
  <div id="space-management-page">
    <a-flex justify="space-between">
      <h2>{{ $t('spaceManagementPage.title') }}</h2>
      <a-space>
        <a-button type="primary" href="/space/add" target="_blank">+ {{ $t('spaceManagementPage.createSpaceButton') }}</a-button>
        <a-button type="primary" ghost href="/analyze/space?queryPublic=1" target="_blank"
          >{{ $t('spaceManagementPage.analyzePublicSpaceButton') }}</a-button
        >
        <a-button type="primary" ghost href="/analyze/space?queryAll=1" target="_blank"
          >{{ $t('spaceManagementPage.analyzeAllSpaceButton') }}</a-button
        >
      </a-space>
    </a-flex>
    <div style="margin-bottom: 2rem"></div>
    <a-form
      :model="searchParamRef"
      name="search-bar"
      layout="inline"
      autocomplete="off"
      @finish="doSearch"
    >
      <a-form-item :label="$t('spaceNameLabel')" name="spaceName">
        <a-input
          v-model:value="searchParamRef.spaceName"
          allow-clear
          :placeholder="$t('spaceNamePlaceholder')"
        >
        </a-input>
      </a-form-item>
      <a-form-item :label="$t('spaceLevelLabel')" name="spaceLevel">
        <a-select
          v-model:value="searchParamRef.spaceLevel"
          :options="SPACE_LEVEL_OPTIONS"
          allow-clear
          style="min-width: 10rem"
          :placeholder="$t('spaceLevelPlaceholder')"
        >
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('spaceManagementPage.spaceTypeLabel')" name="spaceType">
        <a-select
          v-model:value="searchParamRef.spaceType"
          :options="SPACE_TYPE_OPTIONS"
          :placeholder="$t('spaceManagementPage.spaceTypePlaceholder')"
          style="min-width: 10rem"
          allow-clear
        />
      </a-form-item>
      <a-form-item :label="$t('spaceManagementPage.userIdLabel')" name="userId">
        <a-input
          v-model:value="searchParamRef.userId"
          :placeholder="$t('spaceManagementPage.userIdPlaceholder')"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">{{ $t('search') }}</a-button>
      </a-form-item>
    </a-form>
    <div style="height: 2rem"></div>
    <a-table
      :columns="columns"
      :data-source="dataRef"
      :pagination="pagination"
      :loading="loading"
      :scroll="{ x: 'max-content', y: 'calc(100vh - 27rem)' }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'spaceLevel'">
          <a-tag>{{ SPACE_LEVEL_MAP[record.spaceLevel] }}</a-tag>
        </template>
        <template v-if="column.dataIndex === 'spaceType'">
          <a-tag>{{ SPACE_TYPE_MAP[record.spaceType] }}</a-tag>
        </template>
        <template v-if="column.dataIndex === 'spaceUseInfo'">
          <div>Size: {{ formatSize(record.totalSize) }} / {{ formatSize(record.maxSize) }}</div>
          <div>Amount: {{ record.totalCount }} / {{ record.maxCount }}</div>
        </template>
        <template v-else-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.dataIndex === 'editTime'">
          {{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space wrap size="5">
            <a-button
              type="link"
              size="small"
              :href="`/analyze/space?spaceId=${record.id}`"
              target="_blank"
            >
              {{ $t('spaceManagementPage.analyzeButton') }}
            </a-button>
            <a-button
              type="link"
              size="small"
              :href="`/space/add?id=${record.id}&type=${record.spaceType}`"
              target="_blank"
            >
              {{ $t('edit') }}
            </a-button>
            <a-button type="link" size="small" danger @click="doDelete(record.id)">{{ $t('delete') }}</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'
import { formatSize } from '@/util'
import type { PageSpaceVo, SpaceQueryRequest, SpaceVo } from '@/api/api'
import {
  SPACE_LEVEL_MAP,
  SPACE_LEVEL_OPTIONS,
  SPACE_TYPE_MAP,
  SPACE_TYPE_OPTIONS,
} from '@/constant/spaceConstant'
import { spaceController } from '@/api/apiFactory'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const columns = [
  {
    title: t('id'),
    dataIndex: 'id',
    width: 80,
  },
  {
    title: t('spaceNameLabel'),
    dataIndex: 'spaceName',
    width: 100,
  },
  {
    title: t('spaceLevelLabel'),
    dataIndex: 'spaceLevel',
    width: 100,
  },
  {
    title: t('spaceManagementPage.spaceTypeLabel'),
    dataIndex: 'spaceType',
    width: 100,
  },
  {
    title: t('spaceManagementPage.spaceUseInfoLabel'),
    dataIndex: 'spaceUseInfo',
    ellipsis: true,
    width: 160,
  },
  {
    title: t('spaceManagementPage.userIdLabel'),
    dataIndex: 'userId',
    width: 80,
  },
  {
    title: t('createTime'),
    dataIndex: 'createTime',
    width: 160,
  },
  {
    title: t('editTime'),
    dataIndex: 'editTime',
    width: 160,
  },
  {
    title: t('action'),
    key: 'action',
    width: 160,
  },
]

const dataRef = ref<SpaceVo[]>([])
const totalRef = ref(0)
const loading = ref(false)
const searchParamRef = reactive<SpaceQueryRequest>({
  current: 1,
  pageSize: 5,
  sortField: 'createTime',
  sortOrder: 'desc',
})

const pagination = computed(() => {
  return {
    current: searchParamRef.current,
    pageSize: searchParamRef.pageSize,
    total: totalRef.value,
    showSizeChanger: true,
    showTotal: (total: number) => t('total') + `: ${total}`,
    onChange: (page: number, pageSize: number) => {
      searchParamRef.current = page
      searchParamRef.pageSize = pageSize
      fetchSpaceList()
    },
  }
})

onMounted(() => {
  fetchSpaceList()
})

const fetchSpaceList = async () => {
  loading.value = true
  const res = (await spaceController.listSpaceByPage(searchParamRef)) as PageSpaceVo
  dataRef.value = res.records ?? []
  totalRef.value = res.total ?? 0
  loading.value = false
}

const doSearch = () => {
  searchParamRef.current = 1
  fetchSpaceList()
}

const doDelete = async (id: string) => {
  await spaceController.deleteSpace({ id: id })
  message.success('Delete Success')
  fetchSpaceList()
}
</script>

<style scoped></style>
