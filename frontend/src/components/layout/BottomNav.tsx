import { createLink, useLocation } from '@tanstack/react-router'
import { Button } from '@heroui/react'
import { PiChatCircle, PiCompass, PiUser } from 'react-icons/pi'

export const LinkButton = createLink(Button)

const navItems = [
  {
    path: '/chat',
    icon: PiChatCircle,
    label: '聊天',
  },
  {
    path: '/discover',
    icon: PiCompass,
    label: '发现',
  },
  {
    path: '/profile',
    icon: PiUser,
    label: '我的',
  },
]

export function BottomNav() {
  const location = useLocation()

  return (
    <div className='md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-divider z-50'>
      <div className='flex items-center justify-around px-2 py-3'>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon

          return (
            <LinkButton
              key={item.path}
              to={item.path}
              variant='light'
              className={`flex flex-col h-16 min-w-20 px-4 py-2 ${
                isActive
                  ? 'text-primary'
                  : 'text-default-500 hover:text-default-700'
              }`}
            >
              <Icon
                size={20}
                className={`mb-1 ${isActive ? 'fill-current' : ''}`}
              />
              <span className='text-xs'>{item.label}</span>
            </LinkButton>
          )
        })}
      </div>
    </div>
  )
}
