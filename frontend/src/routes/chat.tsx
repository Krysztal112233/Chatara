import { createFileRoute } from '@tanstack/react-router'
import { Sidebar } from '@/components/chat/Sidebar'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { MessageList } from '@/components/chat/MessageList'
import { ChatInput } from '@/components/chat/ChatInput'
import { ResizablePanel } from '@/components/chat/ResizablePanel'
import { Head } from '@unhead/react'

export const Route = createFileRoute('/chat')({
  component: Chat,
})

// 模拟聊天数据
const mockChats = [
  {
    id: 1,
    title: '角色 A',
    lastMessage: '你好，有什么可以帮助你的吗？',
    time: '14:32',
    avatar: 'https://i.pravatar.cc/150?u=1',
    unread: 0,
  },
  {
    id: 2,
    title: '角色 B',
    lastMessage: '我可以帮你写代码和调试问题',
    time: '昨天',
    avatar: 'https://i.pravatar.cc/150?u=2',
    unread: 2,
  },
  {
    id: 3,
    title: '角色 C',
    lastMessage: '需要翻译什么内容吗？',
    time: '星期二',
    avatar: 'https://i.pravatar.cc/150?u=3',
    unread: 0,
  },
]

// 模拟消息数据
const mockMessages = [
  {
    id: 1,
    content: '你好！我是你的AI助手，有什么可以帮助你的吗？',
    isUser: false,
    time: '14:30',
  },
  {
    id: 2,
    content: '你好，我想了解一下 React 的使用方法',
    isUser: true,
    time: '14:31',
  },
  {
    id: 3,
    content:
      'React 是一个用于构建用户界面的 JavaScript 库。它具有组件化、声明式和高效的特点...',
    isUser: false,
    time: '14:32',
  },
]

function Chat() {
  return (
    <>
      <Head>
        <title>聊天</title>
      </Head>
      <div className='flex h-full relative'>
        {/* 可调整大小的侧边栏 */}
        <ResizablePanel minWidthPercent={0.2} maxWidthPercent={0.8}>
          {(isCollapsed) => (
            <Sidebar chats={mockChats} isCollapsed={isCollapsed} />
          )}
        </ResizablePanel>

        {/* 主聊天区域 */}
        <div className='flex-1 flex flex-col'>
          <ChatHeader
            title='角色 A'
            description='这里是描述'
            avatar='https://i.pravatar.cc/150?u=current'
          />
          <MessageList messages={mockMessages} />
          <ChatInput />
        </div>
      </div>
    </>
  )
}
