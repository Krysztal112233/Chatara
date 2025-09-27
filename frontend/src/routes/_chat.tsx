import { createFileRoute, Outlet } from '@tanstack/react-router'
import { LeftTabs } from '@/components/layout/LeftTabs'
import { BottomNav } from '@/components/layout/BottomNav'

export const Route = createFileRoute('/_chat')({
  component: ChatLayoutComponent,
})

function ChatLayoutComponent() {
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
    </div>
  )
}