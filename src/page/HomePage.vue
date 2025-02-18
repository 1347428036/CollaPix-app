<template>
  <div id="home-page">
    <!-- Search Bar -->
    <div class="search-bar">
      <a-input-search
        placeholder="Search from a vast collection of images"
        v-model:value="searchParams.searchText"
        enter-button="Search"
        size="large"
        @search="doSearch"
      />
    </div>
    <!-- Categories + Tags -->
    <a-tabs v-model:activeKey="selectedCategory" @change="doSearch">
      <a-tab-pane key="all" tab="All" />
      <a-tab-pane v-for="category in categoryList" :key="category" :tab="category" />
    </a-tabs>
    <div class="tag-bar">
      <span style="margin-right: 8px">Tags:</span>
      <a-space :size="[0, 8]" wrap>
        <a-checkable-tag
          v-for="(tag, index) in tagList"
          :key="tag"
          v-model:checked="selectedTagList[index]"
          @change="doSearch"
        >
          {{ tag }}
        </a-checkable-tag>
      </a-space>
    </div>

    <!-- Image List -->
    <PictureList class="picture-list" :dataList="dataList" :loading="loading" />
    <a-pagination
      v-model:current="searchParams.current"
      v-model:pageSize="searchParams.pageSize"
      :total="total"
      @change="onPageChange"
      style="text-align: right"
    ></a-pagination>
  </div>
</template>

<script lang="ts" setup>
import type { PagePictureVo, PictureQueryRequest, PictureTagCategory, PictureVo } from '@/api/api'
import { pictureController } from '@/api/apiFactory'
import PictureList from '@/components/PictureList.vue'
import { message } from 'ant-design-vue'
import { onMounted, reactive, ref } from 'vue'

// Data
const dataList = ref<PictureVo[]>([])
const total = ref(0)
const loading = ref(true)

const categoryList = ref<string[]>([])
const selectedCategory = ref<string>('all')
const tagList = ref<string[]>([])
const selectedTagList = ref<boolean[]>([])

// Search parameters
const searchParams = reactive<PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'desc',
})

// Fetch data on page load
onMounted(() => {
  getTagCategoryOptions()
  fetchData()
})

const onPageChange = (page: number, pageSize: number) => {
  searchParams.current = page
  searchParams.pageSize = pageSize
  fetchData()
}

// Fetch data
const fetchData = async () => {
  loading.value = true
  // Convert search parameters
  const params = {
    ...searchParams,
    tags: [] as string[],
  }
  if (selectedCategory.value !== 'all') {
    params.category = selectedCategory.value
  }
  selectedTagList.value.forEach((useTag, index) => {
    if (useTag) {
      params.tags.push(tagList.value[index])
    }
  })
  const res = (await pictureController.listPictureVoByPage(params)) as PagePictureVo
  if (res) {
    dataList.value = res.records ?? []
    total.value = res.total ?? 0
  } else {
    message.error('Load data failed')
  }
  loading.value = false
}

const doSearch = () => {
  // Reset search parameters
  searchParams.current = 1
  fetchData()
}

const getTagCategoryOptions = async () => {
  const res = (await pictureController.listPictureTagCategory()) as PictureTagCategory
  if (res) {
    // Convert to the format accepted by the dropdown component
    categoryList.value = res.categories ?? []
    tagList.value = res.tags ?? []
  } else {
    message.error('Load tags failed')
  }
}
</script>

<style scoped>
#home-page .search-bar {
  max-width: 30rem;
  margin: 0 auto 1rem;
}

#home-page .tag-bar {
  margin-bottom: 1rem;
}

#home-page .picture-list {
  max-height: calc(100vh - 24rem);
}
</style>
