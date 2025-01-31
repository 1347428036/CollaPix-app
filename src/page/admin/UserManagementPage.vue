<template>
  <div id="user-management-page">
    <a-form
      :model="searchParamRef"
      name="search-bar"
      layout="inline"
      autocomplete="off"
      @finish="doSearch"
    >
      <a-form-item label="User Account" name="userAccount">
        <a-input v-model:value="searchParamRef.userAccount" allow-clear> </a-input>
      </a-form-item>

      <a-form-item label="User Name" name="userName">
        <a-input v-model:value="searchParamRef.userName" allow-clear> </a-input>
      </a-form-item>

      <a-form-item>
        <a-button :disabled="disabled" type="primary" html-type="submit">Search</a-button>
      </a-form-item>
    </a-form>
    <div style="height: 2rem"></div>
    <a-table :columns="columns" :data-source="dataRef" :pagination="pagination">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userAvatar'">
          <img :src="record.userAvatar" :width="60" />
        </template>
        <template v-else-if="column.dataIndex === 'userRole'">
          <a-tag v-if="record.userRole === 'admin'" color="blue">
            {{ record.userRole }}
          </a-tag>
          <a-tag v-else color="green">
            {{ record.userRole }}
          </a-tag>
        </template>
        <template v-else-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-button danger @click="doDelete(record.id)">Delete</a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { type UserQueryRequest, type PageUserVo, type UserVo } from '@/api/api'
import { userController } from '@/api/apiFactory'
import { computed, onMounted, reactive, ref } from 'vue'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'

const columns = [
  {
    title: 'User ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Account',
    dataIndex: 'userAccount',
    key: 'userAccount',
  },
  {
    title: 'User Name',
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    title: 'Avatar',
    key: 'userAvatar',
    dataIndex: 'userAvatar',
  },
  {
    title: 'Profile',
    key: 'userProfile',
    dataIndex: 'userProfile',
  },
  {
    title: 'Role',
    key: 'userRole',
    dataIndex: 'userRole',
  },
  {
    title: 'Create Time',
    key: 'createTime',
    dataIndex: 'createTime',
  },
  {
    title: 'Action',
    key: 'action',
  },
]

const dataRef = ref<UserVo[]>([])
const totalRef = ref(0)
const searchParamRef = reactive<UserQueryRequest>({
  current: 1,
  pageSize: 10,
})
const disabled = computed(() => {
  return !searchParamRef.userAccount && !searchParamRef.userName
})
const pagination = computed(() => {
  return {
    current: searchParamRef.current,
    pageSize: searchParamRef.pageSize,
    total: totalRef.value,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `Total ${total} items`,
    onChange: (page: number, pageSize: number) => {
      searchParamRef.current = page
      searchParamRef.pageSize = pageSize
      fetchUserList()
    },
  }
})

const fetchUserList = async () => {
  const res = (await userController.listUser(searchParamRef)) as PageUserVo
  dataRef.value = res.records ?? []
  totalRef.value = res.total ?? 0
}

const doSearch = () => {
  searchParamRef.current = 1
  fetchUserList()
}

const doDelete = async (id: string) => {
  await userController.deleteUser({ id: id })
  message.success('Delete Success')
  fetchUserList()
}

onMounted(() => {
  fetchUserList()
})
</script>
