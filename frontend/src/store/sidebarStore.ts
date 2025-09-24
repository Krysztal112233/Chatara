import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

// 侧边栏宽度原子，持久化到 localStorage
export const sidebarWidthAtom = atomWithStorage('sidebar-width', 320)

// 侧边栏是否折叠原子，持久化到 localStorage
export const sidebarCollapsedAtom = atomWithStorage('sidebar-collapsed', false)

// 是否正在调整大小的临时状态，不持久化
export const isResizingAtom = atom(false)

// 是否悬停在折叠按钮上的临时状态，不持久化
export const isHoveringCollapseAtom = atom(false)