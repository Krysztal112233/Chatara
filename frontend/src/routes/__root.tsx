import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useAtomValue } from 'jotai'
import { hideTanStackRouterDevtoolsAtom } from '@/store/devtoolsStore'
import { Providers } from '@/providers'

const RootLayout = () => {
  const hideTanStackRouterDevtools = useAtomValue(
    hideTanStackRouterDevtoolsAtom
  )
  return (
    <Providers>
      <div className='min-h-screen bg-background'>
        <Outlet />
        {!hideTanStackRouterDevtools && <TanStackRouterDevtools />}
      </div>
    </Providers>
  )
}

export const Route = createRootRoute({ component: RootLayout })
