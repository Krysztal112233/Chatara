import { createLink, useLocation } from '@tanstack/react-router'
import { Button, Avatar, Tooltip } from '@heroui/react'
import { PiChatCircle, PiCompass, PiUser } from 'react-icons/pi'
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher'
import { UserPopover } from '@/components/ui/UserPopover'
import { useAuth0 } from '@auth0/auth0-react'

export const LinkButton = createLink(Button)

export function LeftTabs() {
  const location = useLocation()
  const { isAuthenticated, user } = useAuth0()

  const tabs = [
    { path: '/chat', icon: <PiChatCircle />, label: '聊天' },
    { path: '/discover', icon: <PiCompass />, label: '发现' },
  ]

  return (
    <div className='w-16 bg-content2 border-r border-divider flex flex-col items-center py-4 justify-between'>
      <div className='flex flex-col items-center space-y-3'>
        <UserPopover>
          <Tooltip content="用户设置" placement="right">
            {isAuthenticated ? (
              <Avatar
                src={user?.picture || "https://i.pravatar.cc/150?u=demo-user"}
                className="w-10 h-10 cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-background flex-shrink-0"
              />
            ) : (
              <Avatar
                icon={<PiUser className="text-lg" />}
                className="w-10 h-10 cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-background flex-shrink-0"
              />
            )}
          </Tooltip>
        </UserPopover>
        
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
