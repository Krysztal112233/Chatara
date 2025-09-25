import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

// 左侧边栏宽度原子，持久化到 localStorage
export const sidebarWidthAtom = atomWithStorage('sidebar-width', 320)

// 左侧边栏是否折叠原子，持久化到 localStorage
export const sidebarCollapsedAtom = atomWithStorage('sidebar-collapsed', false)

// 是否正在调整大小的临时状态，不持久化
export const isResizingAtom = atom(false)

// 是否悬停在折叠按钮上的临时状态，不持久化
export const isHoveringCollapseAtom = atom(false)

// 右侧面板宽度原子，持久化到 localStorage
export const rightPanelWidthAtom = atomWithStorage('right-panel-width', 320)

// 右侧面板是否折叠原子，持久化到 localStorage
export const rightPanelCollapsedAtom = atomWithStorage('right-panel-collapsed', false)

// 右侧面板是否正在调整大小的临时状态，不持久化
export const rightPanelIsResizingAtom = atom(false)

// 右侧面板是否悬停在折叠按钮上的临时状态，不持久化
export const rightPanelIsHoveringCollapseAtom = atom(false)

// 右侧面板上部分高度比例原子，持久化到 localStorage (0-1之间的值)
export const rightPanelTopHeightRatioAtom = atomWithStorage('right-panel-top-height-ratio', 0.5)

// 右侧面板是否正在调整高度的临时状态，不持久化
export const rightPanelIsResizingHeightAtom = atom(false)

// 右侧面板是否悬停在高度调整手柄上的临时状态，不持久化
export const rightPanelIsHoveringHeightAtom = atom(false)