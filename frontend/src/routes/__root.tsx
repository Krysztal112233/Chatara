import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useAtomValue } from 'jotai'
import { hideTanStackRouterDevtoolsAtom } from '@/store/devtoolsStore'

const RootLayout = () => {
  const hideTanStackRouterDevtools = useAtomValue(hideTanStackRouterDevtoolsAtom)
  return (
    <>
      <Outlet />
      {!hideTanStackRouterDevtools && <TanStackRouterDevtools />}
  </>
  )
}

export const Route = createRootRoute({ component: RootLayout })