import { createFileRoute } from '@tanstack/react-router'
import { Head } from '@unhead/react'
import { Avatar, Switch, Divider } from '@heroui/react'
import { useTheme } from '@heroui/use-theme'
import { PiSignOut, PiMoon } from 'react-icons/pi'

export const Route = createFileRoute('/profile')({
  component: Profile,
})


function Profile() {
  const { theme, setTheme } = useTheme()
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <>
      <Head>
        <title>我的</title>
      </Head>
      <div className="h-full bg-background overflow-y-auto">
        {/* 顶部用户信息区域 */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6">
          <div className="flex items-center space-x-4">
            <Avatar
              size="lg"
              src="https://i.pravatar.cc/150?u=user"
              className="w-16 h-16"
            />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground">用户名</h2>
              <p className="text-sm text-foreground-600">探索AI角色的无限可能</p>
              <div className="flex items-center mt-2">
                <span className="text-xs text-foreground-500">对话: 128</span>
              </div>
            </div>
          </div>
        </div>

        {/* 功能菜单 */}
        <div className="p-6 space-y-8">
          {/* 主题设置 */}
          <div className="flex items-center justify-between py-3 cursor-pointer hover:bg-content2 -mx-6 px-6 rounded-lg transition-colors">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-content2 text-default-600">
                <PiMoon size={20} />
              </div>
              <div>
                <h3 className="font-medium text-foreground">深色模式</h3>
                <p className="text-xs text-foreground-500 mt-1">切换深色/浅色主题</p>
              </div>
            </div>
            <Switch 
              isSelected={theme === 'dark'}
              onValueChange={toggleTheme}
            />
          </div>
          
          <Divider />
          
          {/* 退出登录按钮 */}
          <div className="flex items-center justify-between py-3 cursor-pointer hover:bg-danger-50 -mx-6 px-6 rounded-lg transition-colors">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-danger-100 text-danger">
                <PiSignOut size={20} />
              </div>
              <div>
                <h3 className="font-medium text-danger">退出登录</h3>
                <p className="text-xs text-foreground-500 mt-1">安全退出当前账户</p>
              </div>
            </div>
          </div>
        </div>

        {/* 底部版本信息 */}
        <div className="p-4 text-center text-xs text-foreground-400 pb-20 md:pb-4">
          <p>Chatara™</p>
        </div>
      </div>
    </>
  )
}