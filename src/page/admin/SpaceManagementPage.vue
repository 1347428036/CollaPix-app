<template>
  <div id="space-management-page">
    <a-flex justify="space-between">
      <h2>Space management</h2>
      <a-space>
        <a-button type="primary" href="/space/add" target="_blank">+ Create Space</a-button>
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
      <a-form-item label="Space name" name="spaceName">
        <a-input
          v-model:value="searchParamRef.spaceName"
          allow-clear
          placeholder="Input space name"
        >
        </a-input>
      </a-form-item>
      <a-form-item label="Space Level" name="spaceLevel">
        <a-select
          v-model:value="searchParamRef.spaceLevel"
          :options="SPACE_LEVEL_OPTIONS"
          allow-clear
          style="min-width: 10rem"
          placeholder="Select space level"
        >
        </a-select>
      </a-form-item>
      <a-form-item label="User ID" name="userId">
        <a-input
          v-model:value="searchParamRef.userId"
          placeholder="Please input user id"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">Search</a-button>
      </a-form-item>
    </a-form>
    <div style="height: 2rem"></div>
    <a-table
      :columns="columns"
      :data-source="dataRef"
      :pagination="pagination"
      :scroll="{ x: 'max-content', y: 'calc(100vh - 27rem)' }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'spaceLevel'">
          <a-tag>{{ SPACE_LEVEL_MAP[record.spaceLevel] }}</a-tag>
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
          <a-space wrap>
            <a-button type="link" :href="`/space/add?id=${record.id}`" target="_blank"
              >Edit</a-button
            >
            <a-button type="link" danger @click="doDelete(record.id)">Delete</a-button>
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
import { SPACE_LEVEL_MAP, SPACE_LEVEL_OPTIONS } from '@/constant/spaceConstant'
import { spaceController } from '@/api/apiFactory'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: 'Space Name',
    dataIndex: 'spaceName',
    width: 100,
  },
  {
    title: 'Space Level',
    dataIndex: 'spaceLevel',
    width: 100,
  },
  {
    title: 'Space Use Info',
    dataIndex: 'spaceUseInfo',
    ellipsis: true,
    width: 160,
  },
  {
    title: 'User ID',
    dataIndex: 'userId',
    width: 80,
  },
  {
    title: 'Create time',
    dataIndex: 'createTime',
    width: 160,
  },
  {
    title: 'Edit time',
    dataIndex: 'editTime',
    width: 160,
  },
  {
    title: 'Action',
    key: 'action',
    width: 80,
  },
]

const dataRef = ref<SpaceVo[]>([])
const totalRef = ref(0)
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
    showTotal: (total: number) => `Total ${total} items`,
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
  const res = (await spaceController.listSpaceByPage(searchParamRef)) as PageSpaceVo
  dataRef.value = res.records ?? []
  totalRef.value = res.total ?? 0
}

const doSearch = () => {
  searchParamRef.current = 1
  fetchSpaceList()
}

const doDelete = async (id: string) => {
  await spaceController.deleteSpacec({ id: id })
  message.success('Delete Success')
  fetchSpaceList()
}
</script>

<style scoped></style>
