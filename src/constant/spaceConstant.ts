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

// Space type enum
export const SPACE_TYPE_ENUM = {
  PRIVATE: 0,
  TEAM: 1,
}

export const SPACE_TYPE_MAP: Record<number, string> = {
  0: 'Private Space',
  1: 'Team Space',
}

// Space type options mapping
export const SPACE_TYPE_OPTIONS = Object.keys(SPACE_TYPE_MAP).map((key) => {
  // Convert string [key] to number
  const value = Number(key)
  return {
    label: SPACE_TYPE_MAP[value],
    value,
  }
})

// Space role enum
export const SPACE_ROLE_ENUM = {
  VIEWER: 'viewer',
  EDITOR: 'editor',
  ADMIN: 'admin',
} as const

export const SPACE_ROLE_MAP: Record<string, string> = {
  viewer: 'Viewer',
  editor: 'Editor',
  admin: 'Administrator',
}

// Space user role options
export const SPACE_ROLE_OPTIONS = Object.keys(SPACE_ROLE_MAP).map((key) => {
  return {
    label: SPACE_ROLE_MAP[key],
    value: key,
  }
})

/**
 * Space permissions
 */
export const SPACE_PERMISSION_ENUM = {
  SPACE_USER_MANAGE: 'spaceUser:manage',
  PICTURE_VIEW: 'picture:view',
  PICTURE_UPLOAD: 'picture:upload',
  PICTURE_EDIT: 'picture:edit',
  PICTURE_DELETE: 'picture:delete',
} as const
