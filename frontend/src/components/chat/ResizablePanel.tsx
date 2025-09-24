import { useEffect, type ReactNode } from 'react'
import { useAtom } from 'jotai'
import { Button } from '@heroui/react'
import { sidebarWidthAtom, sidebarCollapsedAtom, isResizingAtom, isHoveringCollapseAtom } from '@/store/sidebarStore'

interface ResizablePanelProps {
  children: (isCollapsed: boolean) => ReactNode
  minWidthPercent?: number
  maxWidthPercent?: number
}

export function ResizablePanel({
  children,
  minWidthPercent = 0.2,
  maxWidthPercent = 0.8
}: ResizablePanelProps) {
  const [sidebarWidth, setSidebarWidth] = useAtom(sidebarWidthAtom)
  const [isResizing, setIsResizing] = useAtom(isResizingAtom)
  const [isCollapsed, setIsCollapsed] = useAtom(sidebarCollapsedAtom)
  const [isHoveringCollapse, setIsHoveringCollapse] = useAtom(isHoveringCollapseAtom)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return

    const containerWidth = window.innerWidth
    const newWidth = e.clientX
    const minWidth = containerWidth * minWidthPercent
    const maxWidth = containerWidth * maxWidthPercent

    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))
    setSidebarWidth(clampedWidth)
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
    setIsHoveringCollapse(false)
  }

  const handleMouseUp = () => {
    setIsResizing(false)
  }

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  return (
    <>
      {/* 可调整大小的侧边栏 */}
      <div
        className="bg-content1 border-r border-divider flex flex-col relative transition-all duration-300 ease-in-out group overflow-hidden"
        style={{ width: `${isCollapsed ? 0 : sidebarWidth}px` }}
      >
        {children(isCollapsed)}

        {/* 拖拽手柄 */}
        {!isCollapsed && (
          <div
            className={`absolute right-0 top-0 w-1 h-full cursor-col-resize transition-colors ${
              isHoveringCollapse ? 'bg-primary/20' : ''
            }`}
            onMouseDown={handleMouseDown}
            onMouseEnter={() => setIsHoveringCollapse(true)}
            onMouseLeave={() => setIsHoveringCollapse(false)}
          >
            <div className={`w-full h-full ${isHoveringCollapse ? 'bg-primary/40' : ''}`} />
          </div>
        )}
      </div>

      {/* 折叠按钮 - 位于侧边栏外部右侧边缘 */}
      {!isCollapsed && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 z-10 transition-all duration-200 ${
            isHoveringCollapse ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
          style={{ left: `${sidebarWidth - 16}px` }}
          onMouseEnter={() => setIsHoveringCollapse(true)}
          onMouseLeave={() => setIsHoveringCollapse(false)}
        >
          <Button
            isIconOnly
            size="sm"
            className="bg-background/80 backdrop-blur-sm border border-divider shadow-lg hover:bg-background/90 text-default-600 hover:text-primary transition-all duration-200 w-8 h-8 min-w-8"
            onPress={toggleCollapse}
          >
            ‹
          </Button>
        </div>
      )}

      {/* 折叠状态下的悬浮按钮 */}
      {isCollapsed && (
        <div
          className="fixed left-0 top-1/2 -translate-y-1/2 z-20 transition-all duration-200"
          onMouseEnter={() => setIsHoveringCollapse(true)}
          onMouseLeave={() => setIsHoveringCollapse(false)}
        >
          <Button
            isIconOnly
            size="sm"
            className={`bg-background/80 backdrop-blur-sm border border-divider shadow-lg hover:bg-background/90 text-default-600 hover:text-primary transition-all duration-200 w-8 h-8 min-w-8 ml-2 ${
              isHoveringCollapse ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
            onPress={toggleCollapse}
          >
            ›
          </Button>
        </div>
      )}
    </>
  )
}