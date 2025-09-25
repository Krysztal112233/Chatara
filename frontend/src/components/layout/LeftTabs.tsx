import { createLink, useLocation } from '@tanstack/react-router'
import { Button, Avatar, Tooltip } from '@heroui/react'
import { PiChatCircle, PiCompass } from 'react-icons/pi'
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher'

export const LinkButton = createLink(Button)

export function LeftTabs() {
  const location = useLocation()

  const tabs = [
    { path: '/chat', icon: <PiChatCircle />, label: '聊天' },
    { path: '/discover', icon: <PiCompass />, label: '发现' },
  ]

  return (
    <div className='w-16 bg-content2 border-r border-divider flex flex-col items-center py-4 justify-between'>
      <div className='flex flex-col items-center space-y-3'>
        <Tooltip content="用户设置" placement="right">
          <Avatar
            size="md"
            src="https://i.pravatar.cc/150?u=demo-user"
            className="w-10 h-10 cursor-pointer"
          />
        </Tooltip>
        
        <div className='flex flex-col items-center space-y-2'>
          {tabs.map((tab) => (
            <Tooltip key={tab.path} content={tab.label} placement="right">
              <LinkButton
                isIconOnly
                variant={location.pathname === tab.path ? 'solid' : 'light'}
                color={location.pathname === tab.path ? 'primary' : 'default'}
                size='lg'
                className='w-12 h-12 text-lg'
                to={tab.path}
              >
                {tab.icon}
              </LinkButton>
            </Tooltip>
          ))}
        </div>
      </div>
      
      <ThemeSwitcher />
    </div>
  )
}
