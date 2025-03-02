export const PIC_REVIEW_STATUS_ENUM = {
  REVIEWING: 0,
  PASS: 1,
  REJECT: 2,
}

export const PIC_REVIEW_STATUS_MAP: Record<number, string> = {
  0: 'Pending Review',
  1: 'Passed',
  2: 'Rejected',
}

/**
 * Review status "select" options
 */
export const PIC_REVIEW_STATUS_OPTIONS = Object.entries(PIC_REVIEW_STATUS_MAP).map(
  ([key, label]) => {
    return {
      label: label,
      value: parseInt(key, 10),
    }
  },
)

export const PICTURE_EDIT_MESSAGE_TYPE_ENUM = {
  INFO: 'INFO',
  ERROR: 'ERROR',
  ENTER_EDIT: 'ENTER_EDIT',
  EXIT_EDIT: 'EXIT_EDIT',
  EDIT_ACTION: 'EDIT_ACTION',
}

export const PICTURE_EDIT_MESSAGE_TYPE_MAP = {
  INFO: 'Send info',
  ERROR: 'Send error',
  ENTER_EDIT: 'Enter edit status',
  EXIT_EDIT: 'Exit edit status',
  EDIT_ACTION: 'Execute edit action',
}

export const PICTURE_EDIT_ACTION_ENUM = {
  ZOOM_IN: 'ZOOM_IN',
  ZOOM_OUT: 'ZOOM_OUT',
  ROTATE_LEFT: 'ROTATE_LEFT',
  ROTATE_RIGHT: 'ROTATE_RIGHT',
}

export const PICTURE_EDIT_ACTION_MAP = {
  ZOOM_IN: 'Zoom in',
  ZOOM_OUT: 'Zoom out',
  ROTATE_LEFT: 'Rotate left',
  ROTATE_RIGHT: 'Rotate right',
}
