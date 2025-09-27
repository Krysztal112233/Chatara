import { createFileRoute, notFound } from '@tanstack/react-router'
import { Head } from '@unhead/react'
import { MessageList } from '@/components/chat/MessageList'
import { ChatInput } from '@/components/chat/ChatInput'

export const Route = createFileRoute('/_chat/chat/$characterId/$sessionId')({
  component: ChatSession,
  beforeLoad: ({ params }) => {
    // 验证会话 ID，这里可以根据实际需求验证
    if (params.sessionId === 'invalid') {
      throw notFound()
    }
  },
})

// 模拟会话消息数据
const getMessagesForSession = (characterId: string, sessionId: string) => {
  const messagesMap: Record<string, Record<string, {
    id: number
    content: string
    isUser: boolean
    time: string
  }[]>> = {
    'gYcxwe': { // 哈利波特
      'mK8dLr': [
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
          content: '当然可以！在霍格沃茨的七年里，我经历了很多不可思议的事情。从第一次坐上霍格沃茨特快列车，到学会挥动魔杖施展咒语，每一天都充满惊喜...',
          isUser: false,
          time: '14:32',
        },
      ],
      'pQ3nXs': [
        {
          id: 1,
          content: '魁地奇是我们魔法世界最受欢迎的运动！',
          isUser: false,
          time: '10:15',
        },
        {
          id: 2,
          content: '能告诉我魁地奇的规则吗？',
          isUser: true,
          time: '10:16',
        },
      ],
      'wB7hZt': [
        {
          id: 1,
          content: '学会守护神咒是保护自己的重要方法，它可以驱赶摄魂怪。',
          isUser: false,
          time: '16:45',
        },
        {
          id: 2,
          content: '能教我如何召唤守护神吗？',
          isUser: true,
          time: '16:46',
        },
        {
          id: 3,
          content: '首先你需要想起最快乐的回忆，然后挥动魔杖说"呼神护卫"...',
          isUser: false,
          time: '16:47',
        },
      ],
      'newChat': [
        {
          id: 1,
          content: '你好！我是哈利波特，很高兴认识你。有什么想了解的魔法世界的事情吗？',
          isUser: false,
          time: new Date().toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
        },
      ],
    },
    'nR8kPm': { // 苏格拉底
      'xF2vGj': [
        {
          id: 1,
          content: '欢迎，年轻人。我是苏格拉底，让我们一起探索智慧的本质吧。',
          isUser: false,
          time: '15:20',
        },
        {
          id: 2,
          content: '苏格拉底，什么是真正的智慧？',
          isUser: true,
          time: '15:21',
        },
      ],
      'yN5cRk': [
        {
          id: 1,
          content: '正义不仅仅是遵守法律，更在于内心的品德修养。',
          isUser: false,
          time: '12:30',
        },
        {
          id: 2,
          content: '那么正义的标准是什么呢？',
          isUser: true,
          time: '12:31',
        },
      ],
      'newChat': [
        {
          id: 1,
          content: '欢迎，朋友。我是苏格拉底。我相信，未经审视的生活不值得过。你想和我探讨什么哲学问题呢？',
          isUser: false,
          time: new Date().toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
        },
      ],
    },
    'vL4qBz': { // 爱因斯坦
      'zT6wMl': [
        {
          id: 1,
          content: '你好！我是阿尔伯特·爱因斯坦，很高兴与你讨论科学的奥秘。',
          isUser: false,
          time: '11:45',
        },
      ],
      'newChat': [
        {
          id: 1,
          content: '你好！我是阿尔伯特·爱因斯坦。想象力比知识更重要。有什么科学问题想要探讨的吗？',
          isUser: false,
          time: new Date().toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
        },
      ],
    },
    'sJ9tXw': { // 莎士比亚
      'aU7ySm': [
        {
          id: 1,
          content: '向您致敬！我是威廉·莎士比亚，世界是我的舞台。',
          isUser: false,
          time: '09:30',
        },
      ],
      'newChat': [
        {
          id: 1,
          content: '向您致敬！我是威廉·莎士比亚。全世界是一个舞台，所有的男男女女不过是一些演员。想聊聊文学还是人生呢？',
          isUser: false,
          time: new Date().toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
        },
      ],
    },
  }

  return messagesMap[characterId][sessionId]
}

function ChatSession() {
  const { characterId, sessionId } = Route.useParams()
  const messages = getMessagesForSession(characterId, sessionId)

  const getSessionTitle = () => {
    if (sessionId === 'newChat') {
      return '新对话'
    }
    // 这里可以根据 sessionId 返回实际的会话标题
    const sessionTitles: Record<string, string> = {
      'mK8dLr': '魔法世界入门指南',
      'pQ3nXs': '魁地奇运动规则',
      'wB7hZt': '防御黑魔法技巧',
      'xF2vGj': '什么是智慧？',
      'yN5cRk': '正义与道德的本质',
      'zT6wMl': '相对论的基本原理',
      'aU7ySm': '哈姆雷特的创作灵感',
    }
    return sessionTitles[sessionId] || `会话 ${sessionId}`
  }

  return (
    <>
      <Head>
        <title>{getSessionTitle()}</title>
      </Head>
      <div className="flex-1 flex flex-col h-full">
        <MessageList messages={messages} />
        <ChatInput />
      </div>
    </>
  )
}