import {
  Avatar,
  Button,
  Card,
  CardBody,
  Input,
  ScrollShadow,
  Divider,
  Chip,
  Tooltip,
} from '@heroui/react'
import { PiPlus } from 'react-icons/pi'

interface Chat {
  id: number
  title: string
  lastMessage: string
  time: string
  avatar: string
  unread: number
}

interface SidebarProps {
  chats: Chat[]
  isCollapsed: boolean
}

export function Sidebar({ chats, isCollapsed }: SidebarProps) {
  return (
    <>
      {/* 侧边栏内容 - 折叠时隐藏 */}
      <div className={`flex flex-col h-full transition-opacity duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {/* 顶部logo和新建按钮 */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-semibold text-foreground">Chatara</h1>
            </div>
            <Tooltip content="新建角色" placement="bottom">
              <Button
                color="default"
                variant="flat"
                size="sm"
                isIconOnly
              >
                <PiPlus size={16} />
              </Button>
            </Tooltip>
          </div>

          <Input
            placeholder="搜索角色..."
            size="sm"
            variant="bordered"
            classNames={{
              base: "w-full",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
          />

        </div>

        <Divider />

        {/* 聊天列表 */}
        <ScrollShadow className="flex-1">
          <div className="p-2 space-y-1">
            {chats.map((chat) => (
              <Card
                key={chat.id}
                isPressable
                className="w-full bg-transparent hover:bg-default-100 transition-colors cursor-pointer"
                shadow="none"
              >
                <CardBody className="p-3">
                  <div className="flex items-start space-x-3">
                    <Avatar
                      size="sm"
                      src={chat.avatar}
                      className="flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium truncate">
                          {chat.title}
                        </h3>
                        <span className="text-xs text-default-500">
                          {chat.time}
                        </span>
                      </div>
                      <p className="text-xs text-default-500 truncate mt-1">
                        {chat.lastMessage}
                      </p>
                      {chat.unread > 0 && (
                        <div className="flex justify-end mt-1">
                          <Chip
                            size="sm"
                            color="danger"
                            variant="solid"
                            className="text-xs h-5 min-w-5"
                          >
                            {chat.unread}
                          </Chip>
                        </div>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </ScrollShadow>

      </div>
    </>
  )
}