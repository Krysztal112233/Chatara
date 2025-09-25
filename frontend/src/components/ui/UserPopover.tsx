import { Popover, PopoverTrigger, PopoverContent, Avatar, Divider, Button } from '@heroui/react'
import { PiSignOut } from 'react-icons/pi'

interface UserPopoverProps {
  children: React.ReactNode
}

export function UserPopover({ children }: UserPopoverProps) {
  const handleSignOut = () => {
    console.log('退出登录')
  }

  return (
    <Popover placement="bottom-start" offset={10} showArrow>
      <PopoverTrigger>
        <div>
          {children}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="p-4">
          {/* 用户信息区域 */}
          <div className="flex items-center space-x-3 mb-4">
            <Avatar
              size="md"
              src="https://i.pravatar.cc/150?u=user"
              className="w-12 h-12"
            />
            <div className="flex-1">
              <h3 className="font-medium text-foreground">用户名</h3>
              <p className="text-sm text-foreground-600">探索AI角色的无限可能</p>
              <div className="mt-1">
                <span className="text-xs text-foreground-500">对话: 128</span>
              </div>
            </div>
          </div>

          <Divider className="mb-4" />

          {/* 退出登录 */}
          <Button
            variant="light"
            color="danger"
            className="w-full justify-start"
            startContent={<PiSignOut size={16} />}
            onPress={handleSignOut}
          >
            退出登录
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}