<template>
  <div id="user-management-page">
    <a-form
      :model="searchParamRef"
      name="search-bar"
      layout="inline"
      autocomplete="off"
      @finish="doSearch"
    >
      <a-form-item :label="$t('userAccount')" name="userAccount">
        <a-input v-model:value="searchParamRef.userAccount" allow-clear> </a-input>
      </a-form-item>
      <a-form-item :label="$t('userManagementPage.userName')" name="userName">
        <a-input v-model:value="searchParamRef.userName" allow-clear> </a-input>
      </a-form-item>
      <a-form-item>
        <a-button :disabled="disabled" type="primary" html-type="submit">{{
          $t('searchButton')
        }}</a-button>
      </a-form-item>
    </a-form>
    <div style="height: 2rem"></div>
    <a-table :columns="columns" :data-source="dataRef" :pagination="pagination" :loading="loading">
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
          <a-button danger @click="doDelete(record.id)">{{ $t('deleteButton') }}</a-button>
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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: t('userAccount'),
    dataIndex: 'userAccount',
    key: 'userAccount',
  },
  {
    title: t('userManagementPage.userName'),
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    title: t('userManagementPage.userAvatar'),
    key: 'userAvatar',
    dataIndex: 'userAvatar',
  },
  {
    title: t('userManagementPage.userProfile'),
    key: 'userProfile',
    dataIndex: 'userProfile',
  },
  {
    title: t('userManagementPage.userRole'),
    key: 'userRole',
    dataIndex: 'userRole',
  },
  {
    title: t('createTime'),
    key: 'createTime',
    dataIndex: 'createTime',
  },
  {
    title: t('action'),
    key: 'action',
  },
]

const dataRef = ref<UserVo[]>([])
const totalRef = ref(0)
const loading = ref(false)
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
    showTotal: (total: number) => t('total') + `: ${total}`,
    onChange: (page: number, pageSize: number) => {
      searchParamRef.current = page
      searchParamRef.pageSize = pageSize
      fetchUserList()
    },
    pageSizeOptions: ['10', '15', '20'],
  }
})

const fetchUserList = async () => {
  loading.value = true
  const res = (await userController.listUser(searchParamRef)) as PageUserVo
  dataRef.value = res.records ?? []
  totalRef.value = res.total ?? 0
  loading.value = false
}

const doSearch = () => {
  searchParamRef.current = 1
  fetchUserList()
}

const doDelete = async (id: string) => {
  await userController.deleteUser({ id: id })
  message.success(t('deleteSuccess'))
  fetchUserList()
}

onMounted(() => {
  fetchUserList()
})
</script>
