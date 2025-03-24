<template>
  <div class="picture-search-form">
    <a-form
      :model="searchParamRef"
      name="search-bar"
      layout="inline"
      autocomplete="off"
      @finish="doSearch"
    >
      <a-form-item :label="$t('keywords')" name="keywords">
        <a-input
          v-model:value="searchParamRef.searchText"
          allow-clear
          :placeholder="$t('inputNameOrIntroduction')"
        >
        </a-input>
      </a-form-item>

      <a-form-item :label="$t('pictureCategory')" name="category">
        <a-select
          v-model:value="searchParamRef.category"
          :options="categoryOptions"
          allow-clear
          :placeholder="$t('inputCategoryName')"
        >
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('tag')" name="tags">
        <a-select
          v-model:value="searchParamRef.tags"
          mode="tags"
          :placeholder="$t('inputTags')"
          style="min-width: 10rem"
          allow-clear
          :options="tagOptions"
        />
      </a-form-item>
      <a-form-item :label="$t('editTime')" name="editTime">
        <a-range-picker
          style="width: 21rem"
          show-time
          v-model:value="dateRange"
          :placeholder="[$t('startTime'), $t('endTime')]"
          format="YYYY/MM/DD HH:mm:ss"
          :presets="rangePresets"
          @change="onRangeChange"
        />
      </a-form-item>
      <a-form-item :label="$t('name')" name="name">
        <a-input
          v-model:value="searchParamRef.name"
          :placeholder="$t('inputPictureName')"
          allow-clear
        />
      </a-form-item>
      <a-form-item :label="$t('introduction')" name="introduction">
        <a-input
          v-model:value="searchParamRef.introduction"
          :placeholder="$t('inputPictureIntroduction')"
          allow-clear
        />
      </a-form-item>
      <a-form-item :label="$t('width')" name="picWidth">
        <a-input-number v-model:value="searchParamRef.picWidth" />
      </a-form-item>
      <a-form-item :label="$t('height')" name="picHeight">
        <a-input-number v-model:value="searchParamRef.picHeight" />
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button type="primary" html-type="submit">{{ $t('search') }}</a-button>
          <a-button html-type="reset" @click="doClear">{{ $t('reset') }}</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import type { PictureQueryRequest, PictureTagCategory } from '@/api/api.js'
import { pictureController } from '@/api/apiFactory'
import { message } from 'ant-design-vue'
import { onMounted, reactive, ref } from 'vue'
import dayjs, { Dayjs } from 'dayjs'

interface Props {
  onSearch?: (searchParams: PictureQueryRequest) => void
}

type Option = {
  value: string
  label: string
}

const props = defineProps<Props>()
const searchParamRef = reactive<PictureQueryRequest>({})
const categoryOptions = ref<Array<Option>>([])
const tagOptions = ref<Array<Option>>([])
const dateRange = ref<[]>([])

const rangePresets = ref([
  { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()] },
])

onMounted(() => {
  getTagCategoryOptions()
})

const doSearch = () => {
  props.onSearch?.(searchParamRef)
}

const getTagCategoryOptions = async () => {
  const res = (await pictureController.listPictureTagCategory()) as PictureTagCategory
  if (res) {
    // Convert to select options
    tagOptions.value = (res.tags ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
    categoryOptions.value = (res.categories ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
  } else {
    message.error('Loading options failed')
  }
}

/**
 * Trigger when the date range changed
 * @param dates
 * @param dateStrings
 */
const onRangeChange = (dates: Dayjs[]) => {
  if (!dates) {
    dateRange.value = []
    return
  }

  if (dates.length < 2) {
    searchParamRef.startEditTime = undefined
    searchParamRef.endEditTime = undefined
  } else {
    searchParamRef.startEditTime = dates[0].format('YYYY-MM-DD HH:mm:ss')
    searchParamRef.endEditTime = dates[1].format('YYYY-MM-DD HH:mm:ss')
  }
}

const doClear = () => {
  // Reset all search params
  Object.keys(searchParamRef).forEach((key) => {
    ;(searchParamRef as Record<string, unknown>)[key] = undefined
  })
  dateRange.value = []
  props.onSearch?.(searchParamRef)
}
</script>
<style scoped>
.picture-search-form .ant-form-item {
  margin-top: 1rem;
}
</style>
