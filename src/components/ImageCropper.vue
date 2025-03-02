<template>
  <div>
    <a-modal
      class="image-cropper"
      v-model:open="open"
      title="Edit Image"
      :footer="false"
      width="50rem"
      @cancel="closeModal"
    >
      <vue-cropper
        ref="cropperRef"
        :img="imageUrl"
        :autoCrop="true"
        :fixedBox="false"
        :centerBox="true"
        :canMoveBox="true"
        :info="true"
        outputType="png"
      />
      <div style="margin-bottom: 1rem"></div>
      <!-- Collaborative editing operations -->
      <div class="image-edit-actions" v-if="isTeamSpace">
        <a-space>
          <a-button v-if="editingUser" disabled> {{ editingUser.userName }} is editing</a-button>
          <a-button v-if="canEnterEdit" type="primary" ghost @click="enterEdit"
            >Enter Edit</a-button
          >
          <a-button v-if="canExitEdit" danger ghost @click="exitEdit">Exit Edit</a-button>
        </a-space>
      </div>
      <div style="margin-bottom: 1rem"></div>
      <!-- Image operations -->
      <div class="image-cropper-actions">
        <a-space wrap>
          <a-button @click="rotateLeft" :disabled="!canEdit">Rotate Left</a-button>
          <a-button @click="rotateRight" :disabled="!canEdit">Rotate Right</a-button>
          <a-button @click="changeScale(1)" :disabled="!canEdit">Zoom In</a-button>
          <a-button @click="changeScale(-1)" :disabled="!canEdit">Zoom Out</a-button>
          <a-button type="primary" :loading="loading" @click="handleConfirm" :disabled="!canEdit">
            Confirm
          </a-button>
        </a-space>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import type { PictureVo, SpaceVo, UserVo } from '@/api/api.ts'
import { pictureController } from '@/api/apiFactory'
import {
  PICTURE_EDIT_ACTION_ENUM,
  PICTURE_EDIT_MESSAGE_TYPE_ENUM,
} from '@/constant/pictureConstant'
import { SPACE_TYPE_ENUM } from '@/constant/spaceConstant'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import PictureEditWebSocket from '@/util'
import { message } from 'ant-design-vue'
import { computed, onUnmounted, ref, watchEffect } from 'vue'

interface Props {
  imageUrl?: string
  picture?: PictureVo
  spaceId?: string
  space?: SpaceVo
  onSuccess?: (picture: PictureVo) => void
}

const props = defineProps<Props>()

// Editor component reference
const cropperRef = ref()
const open = ref(false)
const loading = ref(false)

// --------- Real-time editing ---------
const loginUserStore = useLoginUserStore()
const loginUser = loginUserStore.getLoginUser()
// The user who is currently editing
const editingUser = ref<UserVo>()
// No user is editing, can enter edit mode
const canEnterEdit = computed(() => {
  return !editingUser.value
})
// The current editor is the logged-in user, can exit edit mode
const canExitEdit = computed(() => {
  if (!isTeamSpace.value) {
    return true
  }
  return editingUser.value?.id === loginUser.id
})
// Can edit
const canEdit = computed(() => {
  return editingUser.value?.id === loginUser.id
})
// Whether it is a team space
const isTeamSpace = computed(() => {
  return props.space?.spaceType === SPACE_TYPE_ENUM.TEAM
})

let websocket: PictureEditWebSocket | null

// Initialize WebSocket connection and bind events
const initWebsocket = () => {
  const pictureId = props.picture?.id
  if (!pictureId || !open.value) {
    return
  }
  // Prevent previous connections from not being released
  if (websocket) {
    websocket.disconnect()
  }
  // Create WebSocket instance
  websocket = new PictureEditWebSocket(pictureId)
  // Establish WebSocket connection
  websocket.connect()

  // Listen for notification messages
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.INFO, (msg) => {
    console.log('Received notification message:', msg)
    message.info(msg.message)
  })

  // Listen for error messages
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.ERROR, (msg) => {
    console.log('Received error message:', msg)
    message.error(msg.message)
  })

  // Listen for entering edit state messages
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.ENTER_EDIT, (msg) => {
    console.log('Received entering edit state message:', msg)
    message.info(msg.message)
    editingUser.value = msg.user
  })

  // Listen for edit action messages
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.EDIT_ACTION, (msg) => {
    console.log('Received edit action message:', msg)
    message.info(msg.message)
    switch (msg.editAction) {
      case PICTURE_EDIT_ACTION_ENUM.ROTATE_LEFT:
        cropperRef.value.rotateLeft()
        break
      case PICTURE_EDIT_ACTION_ENUM.ROTATE_RIGHT:
        cropperRef.value.rotateRight()
        break
      case PICTURE_EDIT_ACTION_ENUM.ZOOM_IN:
        cropperRef.value.changeScale(1)
        break
      case PICTURE_EDIT_ACTION_ENUM.ZOOM_OUT:
        cropperRef.value.changeScale(-1)
        break
    }
  })

  // Listen for exiting edit state messages
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.EXIT_EDIT, (msg) => {
    console.log('Received exiting edit state message:', msg)
    message.info(msg.message)
    editingUser.value = undefined
  })
}

// Enter edit state
const enterEdit = () => {
  if (websocket) {
    // Send enter edit state message
    websocket.sendMessage({
      type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.ENTER_EDIT,
    })
  }
}

// Exit edit state
const exitEdit = () => {
  if (websocket) {
    // Send exit edit state message
    websocket.sendMessage({
      type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.EXIT_EDIT,
    })
  }
}

// Edit image actions
const editAction = (action: string) => {
  if (websocket) {
    // Send edit action request
    websocket.sendMessage({
      type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.EDIT_ACTION,
      editAction: action,
    })
  }
}

// Open modal
const openModal = () => {
  open.value = true
}

// Close modal
const closeModal = () => {
  open.value = false
  // Disconnect
  if (websocket) {
    exitEdit()
    websocket.disconnect()
  }
  editingUser.value = undefined
}

// Rotate left
const rotateLeft = () => {
  cropperRef.value.rotateLeft()
  editAction(PICTURE_EDIT_ACTION_ENUM.ROTATE_LEFT)
}

// Rotate right
const rotateRight = () => {
  cropperRef.value.rotateRight()
  editAction(PICTURE_EDIT_ACTION_ENUM.ROTATE_RIGHT)
}

// Scale
const changeScale = (num: number) => {
  cropperRef.value.changeScale(num)
  if (num > 0) {
    editAction(PICTURE_EDIT_ACTION_ENUM.ZOOM_IN)
  } else {
    editAction(PICTURE_EDIT_ACTION_ENUM.ZOOM_OUT)
  }
}

// Confirm cropping
const handleConfirm = () => {
  cropperRef.value.getCropBlob((blob: Blob) => {
    const fileName = (props.picture?.name || 'image') + '.png'
    const file = new File([blob], fileName, { type: blob.type })
    // Upload image
    handleUpload(file)
  })
}

/**
 * Upload
 * @param file
 */
const handleUpload = async (file: File) => {
  loading.value = true
  try {
    const res = (await pictureController.uploadPicture(
      file,
      props.picture?.id,
      props.spaceId,
    )) as PictureVo
    if (res) {
      message.success('Image upload successful')
      // Pass the uploaded image information to the parent component
      props.onSuccess?.(res)
      closeModal()
    } else {
      message.error('Image upload failed')
    }
  } catch (error) {
    console.error('Image upload failed:', error)
    message.error('Image upload failed')
  } finally {
    loading.value = false
  }
}

watchEffect(() => {
  if (isTeamSpace.value) {
    initWebsocket()
  }
})

onUnmounted(() => {
  // Disconnect
  if (websocket) {
    websocket.disconnect()
  }
  editingUser.value = undefined
})

// Expose functions to the parent component
defineExpose({
  openModal,
})
</script>

<style scoped>
.image-cropper .vue-cropper {
  width: 100%;
  height: 30rem;
}
</style>
