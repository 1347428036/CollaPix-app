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
