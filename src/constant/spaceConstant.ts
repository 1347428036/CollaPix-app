// Space level enum
export const SPACE_LEVEL_ENUM = {
  COMMON: 0,
  PROFESSIONAL: 1,
  FLAGSHIP: 2,
} as const

// Space level text mapping
export const SPACE_LEVEL_MAP: Record<number, string> = {
  0: 'Common',
  1: 'Professional',
  2: 'Flagship',
}

// Space level options mapping
export const SPACE_LEVEL_OPTIONS = Object.keys(SPACE_LEVEL_MAP).map((key) => {
  const value = Number(key) // Convert string key to number
  return {
    label: SPACE_LEVEL_MAP[value],
    value,
  }
})
