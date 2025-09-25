import { useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import { Button, Tooltip, Divider } from '@heroui/react'
import {
  PiCaretLeft,
  PiCaretRight,
  PiStar,
  PiGear,
  PiChartLine,
  PiShield,
  PiPlus,
  PiStarFill,
} from 'react-icons/pi'
import {
  rightPanelWidthAtom,
  rightPanelCollapsedAtom,
  rightPanelIsResizingAtom,
  rightPanelIsHoveringCollapseAtom,
  rightPanelTopHeightRatioAtom,
  rightPanelIsResizingHeightAtom,
  rightPanelIsHoveringHeightAtom,
} from '@/store/sidebarStore'
import { useWindowDimensions } from '@/hooks/useWindowDimensions'

export interface ConversationItem {
  id: number
  title: string
  starred?: boolean
}

export interface ConversationGroup {
  title: string
  items: ConversationItem[]
}

export interface RoleSettings {
  title: string
  descriptions: string[]
}

interface RightPanelProps {
  minWidthPercent?: number
  maxWidthPercent?: number
  minHeightPercent?: number
  maxHeightPercent?: number
  roleSettings: RoleSettings
  conversations: ConversationGroup[]
  onNewSession?: () => void
  onRoleSettingsClick?: () => void
  onConversationClick?: (conversationId: number) => void
}

export function RightPanel({
  minWidthPercent = 0.2,
  maxWidthPercent = 0.5,
  minHeightPercent = 0.2,
  maxHeightPercent = 0.8,
  roleSettings,
  conversations,
  onNewSession,
  onRoleSettingsClick,
  onConversationClick,
}: RightPanelProps) {
  const [panelWidth, setPanelWidth] = useAtom(rightPanelWidthAtom)
  const [isWidthResizing, setIsWidthResizing] = useAtom(
    rightPanelIsResizingAtom
  )
  const [isCollapsed, setIsCollapsed] = useAtom(rightPanelCollapsedAtom)
  const [isHoveringCollapse, setIsHoveringCollapse] = useAtom(
    rightPanelIsHoveringCollapseAtom
  )
  const [topHeightRatio, setTopHeightRatio] = useAtom(
    rightPanelTopHeightRatioAtom
  )
  const [isHeightResizing, setIsHeightResizing] = useAtom(
    rightPanelIsResizingHeightAtom
  )
  const [isHoveringHeight, setIsHoveringHeight] = useAtom(
    rightPanelIsHoveringHeightAtom
  )

  const { width: windowWidth } = useWindowDimensions()
  const panelRef = useRef<HTMLDivElement>(null)
  const minWidth = windowWidth * minWidthPercent
  const maxWidth = windowWidth * maxWidthPercent

  const calculateClampedWidth = (clientX: number) => {
    const panelRight =
      panelRef.current?.getBoundingClientRect().right || windowWidth
    const relativeX = panelRight - clientX
    return Math.max(minWidth, Math.min(maxWidth, relativeX))
  }

  const calculateClampedHeightRatio = (clientY: number) => {
    const panelRect = panelRef.current?.getBoundingClientRect()
    if (!panelRect) return topHeightRatio

    const relativeY = clientY - panelRect.top
    const totalHeight = panelRect.height
    const ratio = relativeY / totalHeight

    return Math.max(minHeightPercent, Math.min(maxHeightPercent, ratio))
  }

  const handleWidthMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsWidthResizing(true)
  }

  const handleHeightMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsHeightResizing(true)
  }

  const handleWidthMouseMove = (e: MouseEvent) => {
    if (!isWidthResizing) return

    const clampedWidth = calculateClampedWidth(e.clientX)
    setPanelWidth(clampedWidth)
  }

  const handleHeightMouseMove = (e: MouseEvent) => {
    if (!isHeightResizing) return

    const clampedRatio = calculateClampedHeightRatio(e.clientY)
    setTopHeightRatio(clampedRatio)
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
    setIsHoveringCollapse(false)
  }

  const handleMouseUp = () => {
    setIsWidthResizing(false)
    setIsHeightResizing(false)
  }

  useEffect(() => {
    if (isWidthResizing || isHeightResizing) {
      if (isWidthResizing) {
        document.addEventListener('mousemove', handleWidthMouseMove)
      }
      if (isHeightResizing) {
        document.addEventListener('mousemove', handleHeightMouseMove)
      }
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = isWidthResizing ? 'col-resize' : 'row-resize'
      document.body.style.userSelect = 'none'
    } else {
      document.removeEventListener('mousemove', handleWidthMouseMove)
      document.removeEventListener('mousemove', handleHeightMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    return () => {
      document.removeEventListener('mousemove', handleWidthMouseMove)
      document.removeEventListener('mousemove', handleHeightMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isWidthResizing, isHeightResizing])

  return (
    <div className='relative flex'>
      {/* 折叠状态下的悬浮按钮 */}
      {isCollapsed && (
        <div
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 transition-all duration-200 ${
            isHoveringCollapse ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
          onMouseEnter={() => setIsHoveringCollapse(true)}
          onMouseLeave={() => setIsHoveringCollapse(false)}
        >
          <Tooltip content='展开右侧面板' placement='left'>
            <Button
              isIconOnly
              size='sm'
              className='bg-background/80 backdrop-blur-sm border border-divider shadow-lg hover:bg-background/90 text-default-600 hover:text-primary transition-all duration-200 w-8 h-8 min-w-8 mr-2'
              onPress={toggleCollapse}
            >
              <PiCaretLeft size={16} />
            </Button>
          </Tooltip>
        </div>
      )}

      {/* 可调整大小的右侧面板 */}
      <div
        ref={panelRef}
        className={`bg-content1 flex flex-col relative group overflow-hidden ${
          isCollapsed ? '' : 'border-l border-divider'
        } ${
          isWidthResizing || isHeightResizing
            ? ''
            : 'transition-all duration-300 ease-in-out'
        }`}
        style={{ width: `${isCollapsed ? 0 : panelWidth}px` }}
      >
        {!isCollapsed && (
          <>
            {/* 角色设定区域 - 上半部分 */}
            <div
              className='border-b border-divider flex flex-col relative'
              style={{ height: `${topHeightRatio * 100}%` }}
            >
              <div className='p-4 flex-1 overflow-y-auto'>
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='text-lg font-semibold'>
                    {roleSettings.title}
                  </h3>
                  <Button
                    isIconOnly
                    size='sm'
                    variant='light'
                    onPress={onRoleSettingsClick}
                  >
                    <PiGear className='text-lg' />
                  </Button>
                </div>

                <div className='text-xs text-foreground-500 space-y-1'>
                  {roleSettings.descriptions.map((desc, index) => (
                    <p key={index}>{desc}</p>
                  ))}
                </div>
              </div>

              {/* 高度调整手柄 */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 cursor-row-resize transition-colors ${
                  isHoveringHeight ? 'bg-primary/20' : ''
                }`}
                onMouseDown={handleHeightMouseDown}
                onMouseEnter={() => setIsHoveringHeight(true)}
                onMouseLeave={() => setIsHoveringHeight(false)}
              >
                <div
                  className={`w-full h-full ${
                    isHoveringHeight ? 'bg-primary/40' : ''
                  }`}
                />
              </div>
            </div>

            {/* 会话列表区域 - 下半部分 */}
            <div
              className='flex-1 overflow-y-auto p-4 flex flex-col'
              style={{ height: `${(1 - topHeightRatio) * 100}%` }}
            >
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold'>
                  对话历史 (
                  {conversations.reduce(
                    (acc, group) => acc + group.items.length,
                    0
                  )}
                  )
                </h3>
                <div className='flex gap-1'>
                  <Button isIconOnly size='sm' variant='light'>
                    <PiChartLine className='text-lg' />
                  </Button>
                  <Button isIconOnly size='sm' variant='light'>
                    <PiShield className='text-lg' />
                  </Button>
                </div>
              </div>

              {/* 新建会话按钮 */}
              <div className='mb-4'>
                <Button
                  className='w-full'
                  color='default'
                  variant='flat'
                  startContent={<PiPlus size={16} />}
                  onPress={onNewSession}
                >
                  新建会话
                </Button>
              </div>

              <div className='flex-1 overflow-y-auto space-y-4'>
                {conversations.map((group, groupIndex) => (
                  <div key={groupIndex}>
                    <h4 className='text-sm font-medium text-foreground-600 mb-2'>
                      {group.title}
                    </h4>
                    <div className='space-y-1'>
                      {group.items.map((item) => (
                        <div
                          key={item.id}
                          className='flex items-center gap-2 p-2 rounded-lg hover:bg-content2 cursor-pointer transition-colors'
                          onClick={() => onConversationClick?.(item.id)}
                        >
                          {item.starred ? (
                            <PiStarFill className='text-sm text-primary fill-current' />
                          ) : (
                            <PiStar className='text-sm text-foreground-400' />
                          )}
                          <span className='text-sm text-foreground-700 flex-1 truncate'>
                            {item.title}
                          </span>
                        </div>
                      ))}
                    </div>
                    {groupIndex < conversations.length - 1 && (
                      <Divider className='my-3' />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 宽度拖拽手柄 */}
            <div
              className={`absolute left-0 top-0 w-1 h-full cursor-col-resize transition-colors ${
                isHoveringCollapse ? 'bg-primary/20' : ''
              }`}
              onMouseDown={handleWidthMouseDown}
              onMouseEnter={() => setIsHoveringCollapse(true)}
              onMouseLeave={() => setIsHoveringCollapse(false)}
            >
              <div
                className={`w-full h-full ${
                  isHoveringCollapse ? 'bg-primary/40' : ''
                }`}
              />
            </div>
          </>
        )}
      </div>

      {/* 折叠按钮 - 位于面板左侧边缘 */}
      {!isCollapsed && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 z-10 transition-all duration-200 ${
            isHoveringCollapse ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
          style={{ right: `${panelWidth - 16}px` }}
          onMouseEnter={() => setIsHoveringCollapse(true)}
          onMouseLeave={() => setIsHoveringCollapse(false)}
        >
          <Tooltip content='折叠右侧面板' placement='left'>
            <Button
              isIconOnly
              size='sm'
              className='bg-background/80 backdrop-blur-sm border border-divider shadow-lg hover:bg-background/90 text-default-600 hover:text-primary transition-all duration-200 w-8 h-8 min-w-8'
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
