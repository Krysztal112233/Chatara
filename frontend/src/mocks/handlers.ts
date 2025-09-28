import { http, HttpResponse } from 'msw'

// Mock 数据
const mockCharacters = [
  {
    id: 'gYcxwe',
    name: '哈利波特',
    settings: {
      description: '霍格沃茨魔法学校学生，拥有格兰芬多的勇气',
      avatar: '🧙‍♂️',
    },
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: 'nR8kPm',
    name: '苏格拉底',
    settings: {
      description: '古希腊哲学家，以苏格拉底式问答法闻名',
      avatar: '🏛️',
    },
    created_at: '2024-01-14T14:20:00Z',
  },
  {
    id: 'vL4qBz',
    name: '爱因斯坦',
    settings: {
      description: '理论物理学家，相对论的创立者',
      avatar: '🧬',
    },
    created_at: '2024-01-13T09:15:00Z',
  },
  {
    id: 'sJ9tXw',
    name: '莎士比亚',
    settings: {
      description: '英国文学史上最杰出的戏剧家和诗人',
      avatar: '🎭',
    },
    created_at: '2024-01-12T16:45:00Z',
  },
]

const mockHistoryIndexes = [
  {
    id: 'mK8dLr',
    character: 'gYcxwe',
    updated_at: '2024-01-20T16:30:00Z',
  },
  {
    id: 'pQ3nXs',
    character: 'gYcxwe',
    updated_at: '2024-01-19T12:15:00Z',
  },
  {
    id: 'xF2vGj',
    character: 'nR8kPm',
    updated_at: '2024-01-20T15:45:00Z',
  },
]

const mockHistoryMessages = {
  'mK8dLr': [
    {
      id: 'msg1',
      role: 'User' as const,
      content: '你好，哈利！',
      created_at: '2024-01-20T16:30:00Z',
    },
    {
      id: 'msg2',
      role: 'Character' as const,
      content: '你好！我是哈利·波特，很高兴认识你！',
      created_at: '2024-01-20T16:31:00Z',
    },
  ],
  'pQ3nXs': [
    {
      id: 'msg3',
      role: 'User' as const,
      content: '魁地奇是什么？',
      created_at: '2024-01-19T12:15:00Z',
    },
    {
      id: 'msg4',
      role: 'Character' as const,
      content: '魁地奇是我们魔法世界最受欢迎的运动...',
      created_at: '2024-01-19T12:16:00Z',
    },
  ],
  'xF2vGj': [
    {
      id: 'msg5',
      role: 'User' as const,
      content: '什么是智慧？',
      created_at: '2024-01-20T15:45:00Z',
    },
    {
      id: 'msg6',
      role: 'Character' as const,
      content: '我知道我一无所知，这就是智慧的开始...',
      created_at: '2024-01-20T15:46:00Z',
    },
  ],
}

export const handlers = [
  // ==================== Auth API ====================
  
  // GET / - 认证测试
  http.get('*/auth/test', () => {
    return HttpResponse.json({
      code: 200,
      msg: 'OK',
      payload: {
        uid: 'auth0|user114514',
      },
    })
  }),

  // ==================== Characters API ====================
  
  // GET /characters - 获取所有角色
  http.get('*/characters', () => {
    return HttpResponse.json({
      code: 200,
      msg: 'OK',
      payload: mockCharacters,
    })
  }),

  // GET /characters/:id - 获取单个角色
  http.get('*/characters/:characterId', ({ params }) => {
    const { characterId } = params
    const character = mockCharacters.find(char => char.id === characterId)
    
    if (!character) {
      return HttpResponse.json({
        code: 404,
        msg: 'Character not found',
      }, { status: 404 })
    }

    return HttpResponse.json({
      code: 200,
      msg: 'OK',
      payload: character,
    })
  }),

  // POST /characters - 创建角色
  http.post('*/characters', async ({ request }) => {
    const body = await request.json() as { name: string; settings: Record<string, unknown> }
    
    const newCharacter = {
      id: `new_${Date.now().toString()}`,
      name: body.name,
      settings: {
        description: (body.settings.description as string) || '',
        avatar: (body.settings.avatar as string) || `https://i.pravatar.cc/150?u=${body.name}`,
        ...body.settings,
      },
      created_at: new Date().toISOString(),
    }

    mockCharacters.push(newCharacter)

    return HttpResponse.json({
      code: 201,
      msg: 'Created',
      payload: newCharacter,
    }, { status: 201 })
  }),

  // DELETE /characters/:id - 删除角色
  http.delete('*/characters/:characterId', ({ params }) => {
    const { characterId } = params
    const index = mockCharacters.findIndex(char => char.id === characterId)
    
    if (index === -1) {
      return HttpResponse.json({
        code: 404,
        msg: 'Character not found',
      }, { status: 404 })
    }

    mockCharacters.splice(index, 1)

    return HttpResponse.json({
      code: 200,
      msg: 'Deleted',
    })
  }),

  // ==================== Histories API ====================
  
  // GET /histories - 获取历史索引
  http.get('*/histories', () => {
    // 这里简化处理，实际应该根据用户ID过滤
    return HttpResponse.json({
      code: 200,
      msg: 'OK',
      payload: {
        size: mockHistoryIndexes.length,
        next: false,
        content: mockHistoryIndexes,
      },
    })
  }),

  // POST /histories - 创建历史索引
  http.post('*/histories', ({ request }) => {
    const url = new URL(request.url)
    const profileId = url.searchParams.get('profile')
    
    if (!profileId) {
      return HttpResponse.json({
        code: 400,
        msg: 'Missing profile parameter',
      }, { status: 400 })
    }

    const newHistoryIndex = {
      id: `hist_${Date.now().toString()}`,
      character: profileId,
      updated_at: new Date().toISOString(),
    }

    mockHistoryIndexes.push(newHistoryIndex)

    return HttpResponse.json({
      code: 200,
      msg: 'Created',
      payload: newHistoryIndex,
    })
  }),

  // GET /histories/:id - 获取历史消息
  http.get('*/histories/:historyId', ({ params }) => {
    const { historyId } = params
    const key = historyId as keyof typeof mockHistoryMessages
    const messages = key in mockHistoryMessages ? mockHistoryMessages[key] : []

    return HttpResponse.json({
      code: 200,
      msg: 'OK',
      payload: {
        size: messages.length,
        next: false,
        content: messages,
      },
    })
  }),

  // POST /histories/:id - 创建历史消息
  http.post('*/histories/:historyId', async ({ params, request }) => {
    const { historyId } = params
    const body = await request.json() as { content: string }
    
    const newMessage = {
      id: `msg_${Date.now().toString()}`,
      role: 'User' as const,
      content: body.content,
      created_at: new Date().toISOString(),
    }

    // 添加到对应的历史记录中
    const key = historyId as keyof typeof mockHistoryMessages
    if (!(key in mockHistoryMessages)) {
      mockHistoryMessages[key] = []
    }
    mockHistoryMessages[key].push(newMessage)
    
    return HttpResponse.json({
      code: 200,
      msg: 'Created',
      payload: newMessage,
    })
  }),

  // DELETE /histories/:id - 删除历史记录
  http.delete('*/histories/:historyId', ({ params }) => {
    const { historyId } = params
    const index = mockHistoryIndexes.findIndex(hist => hist.id === historyId)
    
    if (index === -1) {
      return HttpResponse.json({
        code: 404,
        msg: 'History not found',
      }, { status: 404 })
    }

    mockHistoryIndexes.splice(index, 1)
    const key = historyId as keyof typeof mockHistoryMessages
    if (key in mockHistoryMessages) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete mockHistoryMessages[key]
    }

    return HttpResponse.json({
      code: 200,
      msg: 'Deleted',
    })
  }),
]
