<template>
  <div id="space-analyze-page">
    <h2>
      Gallery space analyze -
      <span v-if="queryAll"> All spaces </span>
      <span v-else-if="queryPublic"> Public gallery </span>
      <span v-else>
        <a :href="`/space/${spaceId}`" target="_blank">ID：{{ spaceId }}</a>
      </span>
    </h2>
    <a-select
      v-if="isAdmin"
      :options="options"
      v-model:value="selectedOption"
      style="width: 15%; margin-bottom: 1rem"
    >
    </a-select>
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :md="12">
        <SpaceUsageAnalyze :spaceId="spaceId" :queryAll="queryAll" :queryPublic="queryPublic" />
      </a-col>
      <a-col :xs="24" :md="12">
        <SpaceCategoryAnalyze :spaceId="spaceId" :queryAll="queryAll" :queryPublic="queryPublic" />
      </a-col>
      <a-col :xs="24" :md="12">
        <SpaceTagAnalyze :spaceId="spaceId" :queryAll="queryAll" :queryPublic="queryPublic" />
      </a-col>
      <a-col :xs="24" :md="12">
        <SpaceSizeAnalyze :spaceId="spaceId" :queryAll="queryAll" :queryPublic="queryPublic" />
      </a-col>
      <a-col :xs="24" :md="12">
        <SpaceUserAnalyze
          :searchable="isAdmin"
          :spaceId="spaceId"
          :queryAll="queryAll"
          :queryPublic="queryPublic"
        />
      </a-col>
      <a-col :xs="24" :md="12">
        <SpaceRankAnalyze
          v-if="isAdmin && selectedOption !== 'mySpace'"
          :spaceId="spaceId"
          :queryAll="queryAll"
          :queryPublic="queryPublic"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import SpaceCategoryAnalyze from '@/components/analyze/SpaceCategoryAnalyze.vue'
import SpaceRankAnalyze from '@/components/analyze/SpaceRankAnalyze.vue'
import SpaceSizeAnalyze from '@/components/analyze/SpaceSizeAnalyze.vue'
import SpaceTagAnalyze from '@/components/analyze/SpaceTagAnalyze.vue'
import SpaceUsageAnalyze from '@/components/analyze/SpaceUsageAnalyze.vue'
import SpaceUserAnalyze from '@/components/analyze/SpaceUserAnalyze.vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const options = [
  {
    label: 'Public Space',
    value: 'publicSpace',
  },
  {
    label: 'All Spaces',
    value: 'allSpaces',
  },
  {
    label: 'My Space',
    value: 'mySpace',
  },
]

const selectedOption = ref<string>('mySpace')
const spaceId = computed(() => route.query.spaceId as string)

const queryAll = computed(() => route.query.queryAll === '1')
const queryPublic = computed(() => route.query.queryPublic === '1')

const loginUserStore = useLoginUserStore()
const loginUser = loginUserStore.getLoginUser()

const isAdmin = computed(() => loginUser.userRole === 'admin')

let updatingRoute = false

watch(selectedOption, (newValue) => {
  if (updatingRoute) return
  updatingRoute = true

  const queryParams = {
    ...route.query,
    queryAll: newValue === 'allSpaces' ? '1' : undefined,
    queryPublic: newValue === 'publicSpace' ? '1' : undefined,
  }

  router.replace({ query: queryParams }).then(() => {
    updatingRoute = false
  })
})

watch(
  () => route.query,
  (newQuery) => {
    if (updatingRoute) return
    updatingRoute = true

    if (newQuery.queryAll === '1') {
      selectedOption.value = 'allSpaces'
    } else if (newQuery.queryPublic === '1') {
      selectedOption.value = 'publicSpace'
    } else {
      selectedOption.value = 'mySpace'
    }

    updatingRoute = false
  },
  { immediate: true },
)
</script>
