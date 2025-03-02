<template>
  <div id="space-user-management-page">
    <h2>Team space user management</h2>
    <div style="margin-bottom: 2rem"></div>
    <a-form layout="inline" :model="formData" @finish="handleSubmit">
      <a-form-item label="User ID" name="userId">
        <a-input v-model:value="formData.userId" placeholder="please input user id" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">Add user</a-button>
      </a-form-item>
    </a-form>

    <div style="height: 2rem"></div>
    <a-table :columns="columns" :data-source="dataRef">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userInfo'">
          <a-space>
            <a-avatar :src="record.user?.userAvatar" />
            {{ record.user?.userName }}
          </a-space>
        </template>
        <template v-if="column.dataIndex === 'spaceRole'">
          <a-select
            v-model:value="record.spaceRole"
            :options="SPACE_ROLE_OPTIONS"
            @change="(value: string) => editSpaceRole(value, record)"
            :disabled="record.userId === loginUser.id"
          />
        </template>
        <template v-else-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space wrap>
            <a-button
              type="link"
              danger
              @click="doDelete(record.id)"
              :disabled="record.userId === loginUser.id"
              >Delete</a-button
            >
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'
import type { SpaceUserAddRequest, SpaceUserVo } from '@/api/api'
import { SPACE_ROLE_OPTIONS } from '@/constant/spaceConstant'
import { spaceUserController } from '@/api/apiFactory'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

const columns = [
  {
    title: 'User',
    dataIndex: 'userInfo',
  },
  {
    title: 'Role',
    dataIndex: 'spaceRole',
  },
  {
    title: 'Create Time',
    dataIndex: 'createTime',
  },
  {
    title: 'Action',
    key: 'action',
  },
]

interface Props {
  spaceId: string
}

const props = defineProps<Props>()
const dataRef = ref<SpaceUserVo[]>([])
const formData = reactive<SpaceUserAddRequest>({})
const loginUser = useLoginUserStore().getLoginUser()

const handleSubmit = async () => {
  const spaceId = props.spaceId
  if (!spaceId) {
    return
  }
  const res = await spaceUserController.addSpaceUser({
    spaceId,
    ...formData,
  })
  if (res) {
    message.success('Add success')
    fetchData()
  } else {
    message.error('Failed to add')
  }
}

const fetchData = async () => {
  const spaceId = props.spaceId
  if (!spaceId) {
    return
  }
  const res = await spaceUserController.listSpaceUser({ spaceId })
  if (res) {
    dataRef.value = res ?? []
  } else {
    message.error('Loading data failed')
  }
}

onMounted(() => {
  fetchData()
})

const editSpaceRole = async (value: string, record: SpaceUserVo) => {
  const res = await spaceUserController.editSpaceUser({
    id: record.id,
    spaceRole: value,
  })
  if (res) {
    message.success('Edit success')
  } else {
    message.error('Edit failed')
  }
}

const doDelete = async (id: string) => {
  if (!id) {
    return
  }
  const res = await spaceUserController.deleteSpaceUser({ id })
  if (res) {
    message.success('Delete success')
    fetchData()
  } else {
    message.error('Delete failed')
  }
}
</script>

<style scoped></style>
