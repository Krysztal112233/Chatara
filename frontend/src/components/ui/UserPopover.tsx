import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Avatar,
  Divider,
  Button,
} from '@heroui/react'
import { PiSignOut, PiSignIn, PiUser } from 'react-icons/pi'
import { useAuth0 } from '@auth0/auth0-react'
import { useLocation } from '@tanstack/react-router'

interface UserPopoverProps {
  children: React.ReactNode
}

export function UserPopover({ children }: UserPopoverProps) {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0()

  const handleSignOut = () => {
    logout({ logoutParams: { returnTo: window.location.origin } }).catch(
      console.error
    )
  }

  const path = useLocation().href

  const handleSignIn = () => {
    loginWithRedirect({
      appState: { returnTo: path },
    }).catch(console.error)
  }

  return (
    <Popover placement='bottom-start' offset={10} showArrow>
      <PopoverTrigger>
        <div>{children}</div>
      </PopoverTrigger>
      <PopoverContent className='w-64'>
        {isAuthenticated ? (
          <div className='p-4 w-full'>
            {/* 已登录用户信息区域 */}
            <div className='flex items-center space-x-3 mb-4'>
              <Avatar
                src={user?.picture || 'https://i.pravatar.cc/150?u=user'}
                className='w-10 h-10 flex-shrink-0'
              />
              <div className='flex-1'>
                <h3 className='font-medium text-foreground text-sm'>
                  {user?.name || user?.email || '用户'}
                </h3>
                {user?.email && (
                  <p className='text-xs text-default-500'>{user.email}</p>
                )}
                <p className='text-xs text-default-500'>
                  已加入{' '}
                  {user?.created_at
                    ? Math.floor(
                        (Date.now() - new Date(user.created_at).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )
                    : 0}{' '}
                  天
                </p>
              </div>
            </div>

            <Divider className='my-3' />

            {/* 退出登录 */}
            <Button
              variant='light'
              color='danger'
              className='w-full justify-start h-8 text-sm'
              startContent={<PiSignOut size={14} />}
              onPress={handleSignOut}
            >
              退出登录
            </Button>
          </div>
        ) : (
          <div className='p-4 w-full'>
            {/* 未登录用户信息区域 */}
            <div className='flex items-center space-x-3 mb-4'>
              <Avatar
                icon={<PiUser className='text-sm' />}
                className='w-10 h-10 flex-shrink-0'
              />
              <div className='flex-1'>
                <h3 className='font-medium text-foreground text-sm'>新朋友</h3>
                <p className='text-xs text-default-500'>未登录</p>
              </div>
            </div>

            <Divider className='mb-3' />

            {/* 登录按钮 */}
            <Button
              variant='light'
              color='primary'
              className='w-full justify-start h-8 text-sm'
              startContent={<PiSignIn size={14} />}
              onPress={handleSignIn}
            >
              登录
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
