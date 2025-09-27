import { createFileRoute, useLocation } from '@tanstack/react-router'
import { Head } from '@unhead/react'
import { Avatar, Switch, Divider, Button } from '@heroui/react'
import { useTheme } from '@heroui/use-theme'
import { PiSignOut, PiMoon, PiUser } from 'react-icons/pi'
import { useAuth0 } from '@auth0/auth0-react'

export const Route = createFileRoute('/_chat/profile')({
  component: Profile,
})

function Profile() {
  const { theme, setTheme } = useTheme()
  const { isAuthenticated, user, logout, loginWithRedirect } = useAuth0()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

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
    <>
      <Head>
        <title>我的</title>
      </Head>
      <div className='h-full bg-background overflow-y-auto'>
        {/* 顶部用户信息区域 */}
        <div className='bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-content1 dark:to-content2 p-6'>
          <div className='flex items-center space-x-4'>
            <Avatar
              size='lg'
              src={
                isAuthenticated
                  ? user?.picture || 'https://i.pravatar.cc/150?u=user'
                  : undefined
              }
              icon={
                !isAuthenticated ? <PiUser className='text-xl' /> : undefined
              }
              className='w-16 h-16'
            />
            <div className='flex-1'>
              <h2 className='text-xl font-semibold text-foreground'>
                {isAuthenticated
                  ? user?.name || user?.email || '用户'
                  : '新朋友'}
              </h2>
              {isAuthenticated && user?.email && (
                <p className='text-sm text-foreground-600'>{user.email}</p>
              )}
              {isAuthenticated && (
                <div className='flex items-center mt-2'>
                  <span className='text-xs text-foreground-500'>
                    已加入{' '}
                    {user?.created_at
                      ? Math.floor(
                          (Date.now() - new Date(user.created_at).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                      : 0}{' '}
                    天
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 功能菜单 */}
        <div className='p-6 space-y-8'>
          {/* 主题设置 */}
          <div className='flex items-center justify-between py-3 cursor-pointer hover:bg-content2 -mx-6 px-6 rounded-lg transition-colors'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 rounded-lg bg-content2 text-default-600'>
                <PiMoon size={20} />
              </div>
              <div>
                <h3 className='font-medium text-foreground'>深色模式</h3>
                <p className='text-xs text-foreground-500 mt-1'>
                  切换深色/浅色主题
                </p>
              </div>
            </div>
            <Switch isSelected={theme === 'dark'} onValueChange={toggleTheme} />
          </div>

          <Divider />

          {/* 登录/退出登录按钮 */}
          {isAuthenticated ? (
            <div
              className='flex items-center justify-between py-3 cursor-pointer hover:bg-danger-50 -mx-6 px-6 rounded-lg transition-colors'
              onClick={handleSignOut}
            >
              <div className='flex items-center space-x-4'>
                <div className='p-2 rounded-lg bg-danger-100 text-danger'>
                  <PiSignOut size={20} />
                </div>
                <div>
                  <h3 className='font-medium text-danger'>退出登录</h3>
                  <p className='text-xs text-foreground-500 mt-1'>
                    安全退出当前账户
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <Button
              color='primary'
              className='w-full'
              size='lg'
              onPress={handleSignIn}
            >
              立即登录
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
