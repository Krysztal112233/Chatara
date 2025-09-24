import { atomWithStorage } from 'jotai/utils'

// TanStack Router 调试工具是否隐藏，持久化到 localStorage
export const hideTanStackRouterDevtoolsAtom = atomWithStorage('hideTanstackRouterDevtools', false)