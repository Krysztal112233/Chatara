import { useEffect, useRef, type ReactNode } from 'react'
import { useAtom } from 'jotai'
import { Button, Tooltip } from '@heroui/react'
import { PiCaretLeft, PiCaretRight } from 'react-icons/pi'
import { sidebarWidthAtom, sidebarCollapsedAtom, isResizingAtom, isHoveringCollapseAtom } from '@/store/sidebarStore'
import { useWindowDimensions } from '@/hooks/useWindowDimensions'

interface LeftPanelProps {
  children: (isCollapsed: boolean) => ReactNode
  minWidthPercent?: number
  maxWidthPercent?: number
}

export function LeftPanel({
  children,
  minWidthPercent = 0.2,
  maxWidthPercent = 0.8
}: LeftPanelProps) {
  const [sidebarWidth, setSidebarWidth] = useAtom(sidebarWidthAtom)
  const [isResizing, setIsResizing] = useAtom(isResizingAtom)
  const [isCollapsed, setIsCollapsed] = useAtom(sidebarCollapsedAtom)
  const [isHoveringCollapse, setIsHoveringCollapse] = useAtom(isHoveringCollapseAtom)
  const { width: windowWidth } = useWindowDimensions()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const minWidth = windowWidth * minWidthPercent
  const maxWidth = windowWidth * maxWidthPercent

  const calculateClampedWidth = (clientX: number) => {
    const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left || 0
    const relativeX = clientX - sidebarLeft
    return Math.max(minWidth, Math.min(maxWidth, relativeX))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return
    
    const clampedWidth = calculateClampedWidth(e.clientX)
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
    <div className="relative flex">
      {/* 可调整大小的侧边栏 */}
      <div
        ref={sidebarRef}
        className={`bg-content1 flex flex-col relative group overflow-hidden ${
          isCollapsed ? '' : 'border-r border-divider'
        } ${isResizing ? '' : 'transition-all duration-300 ease-in-out'}`}
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

      {/* 折叠按钮 - 位于侧边栏右侧边缘 */}
      {!isCollapsed && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 z-10 transition-all duration-200 ${
            isHoveringCollapse ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
          style={{ left: `${sidebarWidth - 16}px` }}
          onMouseEnter={() => setIsHoveringCollapse(true)}
          onMouseLeave={() => setIsHoveringCollapse(false)}
        >
          <Tooltip content="折叠侧边栏" placement="right">
            <Button
              isIconOnly
              size="sm"
              className="bg-background/80 backdrop-blur-sm border border-divider shadow-lg hover:bg-background/90 text-default-600 hover:text-primary transition-all duration-200 w-8 h-8 min-w-8"
              onPress={toggleCollapse}
            >
              <PiCaretLeft size={16} />
            </Button>
          </Tooltip>
        </div>
      )}

      {/* 折叠状态下的悬浮按钮 */}
      {isCollapsed && (
        <div
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 transition-all duration-200 ${
            isHoveringCollapse ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
          onMouseEnter={() => setIsHoveringCollapse(true)}
          onMouseLeave={() => setIsHoveringCollapse(false)}
        >
          <Tooltip content="展开侧边栏" placement="right">
            <Button
              isIconOnly
              size="sm"
              className="bg-background/80 backdrop-blur-sm border border-divider shadow-lg hover:bg-background/90 text-default-600 hover:text-primary transition-all duration-200 w-8 h-8 min-w-8 ml-2"
              onPress={toggleCollapse}
            >
              <PiCaretRight size={16} />
            </Button>
          </Tooltip>
        </div>
      )}
    </div>
  )
}