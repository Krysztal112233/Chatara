import { Button } from '@heroui/react'
import { PiList, PiCaretLeft } from 'react-icons/pi'

interface ChatHeaderProps {
  title: string
  description: string
  avatar?: string
  onHistoryClick?: () => void
  onBackClick?: () => void
  showBackButton?: boolean
}

export function ChatHeader({
  title,
  description,
  avatar,
  onHistoryClick,
  onBackClick,
  showBackButton = false,
}: ChatHeaderProps) {
  return (
    <div className='h-16 bg-content1 border-b border-divider px-4 md:px-6 flex items-center justify-between'>
      <div className='flex items-center space-x-3'>
        {/* 移动端返回按钮 */}
        {showBackButton && (
          <Button
            isIconOnly
            size='sm'
            variant='light'
            className='md:hidden'
            onPress={onBackClick}
          >
            <PiCaretLeft size={18} />
          </Button>
        )}

        <div className='flex-shrink-0 w-8 h-8 flex items-center justify-center text-xl'>
          {avatar || '🎭'}
        </div>
        <div>
          <h2 className='font-semibold text-foreground'>{title}</h2>
          <p className='text-xs text-default-500'>{description}</p>
        </div>
      </div>

      <div className='flex items-center space-x-2'>
        {/* 移动端会话历史按钮 */}
        {onHistoryClick && (
          <Button
            isIconOnly
            size='sm'
            variant='light'
            className='md:hidden'
            onPress={onHistoryClick}
          >
            <PiList size={18} />
          </Button>
        )}

        {/* 桌面端更多选项按钮 */}
        <Button
          isIconOnly
          size='sm'
          variant='light'
          className='text-default-500 hidden md:flex'
        >
          ⋯
        </Button>
      </div>
    </div>
  )
}
