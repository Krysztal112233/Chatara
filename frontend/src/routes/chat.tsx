import { createFileRoute } from '@tanstack/react-router'
import { Sidebar } from '@/components/chat/Sidebar'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { MessageList } from '@/components/chat/MessageList'
import { ChatInput } from '@/components/chat/ChatInput'
import { LeftPanel } from '@/components/chat/LeftPanel'
import { RightPanel } from '@/components/chat/RightPanel'
import { Head } from '@unhead/react'
import type { ConversationGroup, RoleSettings } from '@/components/chat/RightPanel'

export const Route = createFileRoute('/chat')({
  component: Chat,
})

// 模拟聊天数据
const mockChats = [
  {
    id: 1,
    title: '哈利波特',
    lastMessage: '欢迎来到霍格沃茨！你想了解什么魔法呢？',
    time: '14:32',
    avatar: 'https://i.pravatar.cc/150?u=harry-potter',
    unread: 0,
  },
  {
    id: 2,
    title: '苏格拉底',
    lastMessage: '我只知道一件事，那就是我什么都不知道',
    time: '昨天',
    avatar: 'https://i.pravatar.cc/150?u=socrates',
    unread: 2,
  },
  {
    id: 3,
    title: '爱因斯坦',
    lastMessage: '想象力比知识更重要',
    time: '星期二',
    avatar: 'https://i.pravatar.cc/150?u=einstein',
    unread: 0,
  },
]

// 模拟消息数据
const mockMessages = [
  {
    id: 1,
    content: '你好！我是哈利波特，来自霍格沃茨魔法学校。很高兴见到你！',
    isUser: false,
    time: '14:30',
  },
  {
    id: 2,
    content: '哈利，能跟我分享一些魔法世界的奇妙经历吗？',
    isUser: true,
    time: '14:31',
  },
  {
    id: 3,
    content:
      '当然可以！在霍格沃茨的七年里，我经历了很多不可思议的事情。从第一次坐上霍格沃茨特快列车，到学会挥动魔杖施展咒语，每一天都充满惊喜...',
    isUser: false,
    time: '14:32',
  },
]

// 角色设定数据
const mockRoleSettings: RoleSettings = {
  title: '角色设定',
  descriptions: [
    '🧙‍♂️ 经典文学和影视角色扮演',
    '🎭 支持哈利波特、苏格拉底等知名角色',
    '🗣️ 提供沉浸式语音对话体验',
    '💭 深度还原角色性格和说话方式'
  ]
}

// 对话历史数据
const mockConversations: ConversationGroup[] = [
  {
    title: '今天',
    items: [
      { id: 1, title: '与哈利波特聊魔法世界', starred: true },
      { id: 2, title: '苏格拉底的哲学思辨', starred: true },
      { id: 3, title: '爱因斯坦谈相对论', starred: false },
      { id: 4, title: '莎士比亚朗诵十四行诗', starred: true },
    ]
  },
  {
    title: '昨天',
    items: [
      { id: 5, title: '诸葛亮的军事策略' },
      { id: 6, title: '达芬奇的艺术创作' },
    ]
  },
  {
    title: '本周',
    items: [
      { id: 7, title: '拿破仑的征战经历' },
      { id: 8, title: '牛顿的科学发现' },
      { id: 9, title: '孔子论仁义道德' },
    ]
  },
  {
    title: '本月',
    items: [
      { id: 10, title: '福尔摩斯破案推理' },
      { id: 11, title: '居里夫人的科研精神' },
      { id: 12, title: '贝多芬创作灵感' },
      { id: 13, title: '林肯的演讲艺术' },
    ]
  }
]

function Chat() {
  const handleNewSession = () => {
    console.log('新建会话')
  }

  const handleRoleSettingsClick = () => {
    console.log('角色设定点击')
  }

  const handleConversationClick = (conversationId: number) => {
    console.log('对话点击:', conversationId)
  }
  return (
    <>
      <Head>
        <title>角色对话</title>
      </Head>
      <div className='flex h-full relative'>
        {/* 左侧边栏 */}
        <LeftPanel minWidthPercent={0.15} maxWidthPercent={0.4}>
          {(isCollapsed) => (
            <Sidebar chats={mockChats} isCollapsed={isCollapsed} />
          )}
        </LeftPanel>

        {/* 主聊天区域 */}
        <div className='flex-1 flex flex-col'>
          <ChatHeader
            title='哈利波特'
            description='霍格沃茨魔法学校学生，拥有格兰芬多的勇气'
            avatar='https://i.pravatar.cc/150?u=harry-potter'
          />
          <MessageList messages={mockMessages} />
          <ChatInput />
        </div>

        {/* 右侧面板 */}
        <RightPanel 
          minWidthPercent={0.2} 
          maxWidthPercent={0.5}
          roleSettings={mockRoleSettings}
          conversations={mockConversations}
          onNewSession={handleNewSession}
          onRoleSettingsClick={handleRoleSettingsClick}
          onConversationClick={handleConversationClick}
        />
      </div>
    </>
  )
}
