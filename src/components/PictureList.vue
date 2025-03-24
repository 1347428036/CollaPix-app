<template>
  <div class="picture-list">
    <!-- Image List -->
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
      :loading="loading"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item style="padding: 0">
          <!-- Single Image -->
          <a-card hoverable @click="doClickPicture(picture)">
            <template #cover>
              <img
                style="height: 10rem; object-fit: scale-down"
                :alt="picture.name"
                :src="picture.thumbnailUrl ?? picture.url"
                loading="lazy"
              />
            </template>
            <a-card-meta :title="picture.name">
              <template #description>
                <a-flex>
                  <a-tag color="green">
                    {{ picture.category ?? 'Default' }}
                  </a-tag>
                  <a-tag v-for="tag in picture.tags" :key="tag">
                    {{ tag }}
                  </a-tag>
                </a-flex>
              </template>
            </a-card-meta>
            <template v-if="showOp" #actions>
              <search-outlined @click="(e: any) => doSearch(picture, e)" />
              <share-alt-outlined @click="(e: any) => doShare(picture, e)" />
              <edit-outlined v-if="canEdit" @click="(e: any) => doEdit(picture, e)" />
              <delete-outlined v-if="canDelete" @click="(e: any) => doDelete(picture, e)" />
            </template>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
    <ShareModal ref="shareModalRef" :link="shareLink" :title="$t('sharePicture')" />
  </div>
</template>

<script setup lang="ts">
import type { PictureVo } from '@/api/api'
import { pictureController } from '@/api/apiFactory'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ShareAltOutlined,
} from '@ant-design/icons-vue'
import { ref } from 'vue'
import ShareModal from './ShareModal.vue'

interface Props {
  dataList?: PictureVo[]
  loading?: boolean
  showOp?: boolean
  canEdit?: boolean
  canDelete?: boolean
  onReload?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
  loading: false,
  showOp: false,
  canEdit: false,
  canDelete: false,
})

const router = useRouter()

const shareModalRef = ref()
const shareLink = ref<string>('')

const doClickPicture = (picture: PictureVo) => {
  router.push({
    path: `/picture/${picture.id}`,
  })
}

const doSearch = (picture: PictureVo, e: Event) => {
  e.stopPropagation()
  window.open(`/search/picture?pictureId=${picture.id}`)
}

const doShare = (picture: PictureVo, e: Event) => {
  e.stopPropagation()
  shareLink.value = `${window.location.protocol}//${window.location.host}/picture/${picture.id}`
  if (shareModalRef.value) {
    shareModalRef.value.openModal()
  }
}

const doEdit = (picture: PictureVo, e: Event) => {
  e.stopPropagation()
  router.push({
    path: '/picture/add',
    query: {
      id: picture.id,
      spaceId: picture.spaceId,
    },
  })
}

const doDelete = async (picture: PictureVo, e: Event) => {
  e.stopPropagation()
  const id = picture.id
  if (!id) {
    return
  }
  const res = await pictureController.deletePicture({ id })
  if (res) {
    message.success('Delete success')
    // Refresh outer data
    props.onReload?.()
  } else {
    message.error('Delete failed')
  }
}
</script>

<style scoped>
.picture-list {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
