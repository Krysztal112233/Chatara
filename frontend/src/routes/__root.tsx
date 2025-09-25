import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useAtomValue } from 'jotai'
import { hideTanStackRouterDevtoolsAtom } from '@/store/devtoolsStore'
import { LeftTabs } from '@/components/layout/LeftTabs'

const RootLayout = () => {
  const hideTanStackRouterDevtools = useAtomValue(
    hideTanStackRouterDevtoolsAtom
  )
  return (
    <div className='flex h-screen bg-background'>
      <LeftTabs />
      <div className='flex-1'>
        <Outlet />
      </div>
      {!hideTanStackRouterDevtools && <TanStackRouterDevtools />}
    </div>
  )
}

export const Route = createRootRoute({ component: RootLayout })
