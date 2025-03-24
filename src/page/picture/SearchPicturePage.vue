<template>
  <div id="search-picture-page">
    <h2 style="margin-bottom: 1rem">Search by picture</h2>
    <h3 style="margin: 1rem 0">Origional picture</h3>
    <a-card style="width: 13rem">
      <template #cover>
        <img
          style="height: 10rem; object-fit: scale-down"
          :alt="picture.name"
          :src="picture.thumbnailUrl ?? picture.url"
        />
      </template>
    </a-card>
    <h3 style="margin: 1rem 0">Analyze result</h3>
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
    >
      <template #renderItem="{ item }">
        <a-list-item style="padding: 0">
          <a :href="item.fromUrl" target="_blank">
            <a-card>
              <template #cover>
                <img style="height: 10rem; object-fit: scale-down" :src="item.thumbUrl" />
              </template>
            </a-card>
          </a>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { pictureController } from '@/api/apiFactory'
import type { PictureVo } from '@/api/api.ts'
import type { ImageSearchResult } from '@/api/api.ts'

const route = useRoute()
const pictureId = route.query.pictureId as string
const picture = ref<PictureVo>({})
const dataList = ref<ImageSearchResult[]>([])

onMounted(() => {
  fetchPictureDetail()
  fetchData()
})

const fetchData = async () => {
  const res = await pictureController.searchPictureByPicture({
    pictureId: pictureId,
  }) as unknown as ImageSearchResult[]
  if (res) {
    dataList.value = res ?? []
  } else {
    message.error('Loading data failed')
  }
}

// Fetch picture details
const fetchPictureDetail = async () => {
  try {
    const res = await pictureController.getPictureVoById(pictureId) as PictureVo
    if (res) {
      picture.value = res
    } else {
      message.error('Failed to load page details')
    }
  } catch (e: unknown) {
    console.error('Error fetching picture details:', e)
    message.error('Failed to load page details')
  }
}
</script>
