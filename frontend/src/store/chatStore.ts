import { atom } from 'jotai'

// 当前选中的角色ID
export const selectedCharacterIdAtom = atom<string | null>(null)

// 当前选中的会话ID
export const selectedSessionIdAtom = atom<string | null>(null)

// 会话数据类型
export interface SessionItem {
  id: string
  title: string
  lastMessage?: string
  timestamp: string
  messageCount: number
  starred: boolean
}

export interface SessionGroup {
  title: string
  items: SessionItem[]
}

// 获取指定角色的会话数据
export const getSessionsForCharacter = (characterId: string): SessionGroup[] => {
  const allSessions: Record<string, SessionGroup[]> = {
    'gYcxwe': [ // 哈利波特
      {
        title: '今天',
        items: [
          {
            id: 'mK8dLr',
            title: '魔法世界入门指南',
            lastMessage: '霍格沃茨有四个学院，每个学院都有独特的特点...',
            timestamp: '2小时前',
            messageCount: 23,
            starred: true,
          },
        ]
      },
      {
        title: '昨天',
        items: [
          {
            id: 'pQ3nXs', 
            title: '魁地奇运动规则',
            lastMessage: '魁地奇是我们魔法世界最受欢迎的运动...',
            timestamp: '昨天',
            messageCount: 15,
            starred: false,
          },
        ]
      },
      {
        title: '本周',
        items: [
          {
            id: 'wB7hZt',
            title: '防御黑魔法技巧',
            lastMessage: '学会守护神咒是保护自己的重要方法...',
            timestamp: '3天前',
            messageCount: 31,
            starred: true,
          },
        ]
      },
    ],
    'nR8kPm': [ // 苏格拉底
      {
        title: '今天',
        items: [
          {
            id: 'xF2vGj',
            title: '什么是智慧？',
            lastMessage: '我知道我一无所知，这就是智慧的开始...',
            timestamp: '1小时前',
            messageCount: 18,
            starred: true,
          },
        ]
      },
      {
        title: '本周',
        items: [
          {
            id: 'yN5cRk',
            title: '正义与道德的本质',
            lastMessage: '正义不仅仅是遵守法律，更在于内心的品德...',
            timestamp: '2天前',
            messageCount: 27,
            starred: false,
          },
        ]
      },
    ],
    'vL4qBz': [ // 爱因斯坦
      {
        title: '今天',
        items: [
          {
            id: 'zT6wMl',
            title: '相对论的基本原理',
            lastMessage: '时间和空间不是绝对的，它们是相对的...',
            timestamp: '4小时前',
            messageCount: 12,
            starred: false,
          },
        ]
      },
    ],
    'sJ9tXw': [ // 莎士比亚
      {
        title: '今天',
        items: [
          {
            id: 'aU7ySm',
            title: '哈姆雷特的创作灵感',
            lastMessage: '生存还是毁灭，这是个问题...',
            timestamp: '6小时前',
            messageCount: 8,
            starred: true,
          },
        ]
      },
    ],
  }
  
  return allSessions[characterId]
}

// 获取当前选中角色的会话数据
export const selectedCharacterSessionsAtom = atom((get) => {
  const characterId = get(selectedCharacterIdAtom)
  return characterId ? getSessionsForCharacter(characterId) : []
})