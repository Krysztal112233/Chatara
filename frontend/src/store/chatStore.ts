import { atom } from 'jotai'

// 当前选中的角色ID
export const selectedCharacterIdAtom = atom<string | null>(null)

// 当前选中的会话ID
export const selectedSessionIdAtom = atom<string | null>(null)
