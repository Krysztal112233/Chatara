import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useAtomValue } from 'jotai'
import { hideTanStackRouterDevtoolsAtom } from '@/store/devtoolsStore'
import { LeftTabs } from '@/components/layout/LeftTabs'
import { BottomNav } from '@/components/layout/BottomNav'

const RootLayout = () => {
  const hideTanStackRouterDevtools = useAtomValue(
    hideTanStackRouterDevtoolsAtom
  )
  return (
    <div className='flex h-screen bg-background'>
      {/* 桌面端左侧导航 */}
      <div className='hidden md:flex'>
        <LeftTabs />
      </div>
      
      {/* 主内容区域 */}
      <div className='flex-1 flex flex-col md:pb-0 pb-16'>
        <Outlet />
      </div>
      
      {/* 移动端底部导航 */}
      <BottomNav />
      
      {!hideTanStackRouterDevtools && <TanStackRouterDevtools />}
    </div>
  )
}

export const Route = createRootRoute({ component: RootLayout })
