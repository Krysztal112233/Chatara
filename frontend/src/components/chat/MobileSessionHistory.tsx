import { Button, ScrollShadow, Divider } from '@heroui/react'
import { PiX, PiPlus, PiStar, PiStarFill } from 'react-icons/pi'
import { getRouteApi } from '@tanstack/react-router'
import type { Character, SessionGroup } from '@/store/chatStore'

const sessionRoute = getRouteApi('/chat/$characterId/$sessionId')

interface MobileSessionHistoryProps {
  selectedCharacter: Character | null
  characterSessions: SessionGroup[]
  onClose: () => void
  onNewSession: () => void
  onConversationClick: (conversationId: string) => void
}

export function MobileSessionHistory({ 
  selectedCharacter,
  characterSessions,
  onClose, 
  onNewSession, 
  onConversationClick 
}: MobileSessionHistoryProps) {
  const sessionParams = sessionRoute.useParams()
  const activeSessionId = sessionParams?.sessionId ?? null

  const handleNewSession = () => {
    onNewSession()
    onClose()
  }

  const handleConversationClick = (conversationId: string) => {
    onConversationClick(conversationId)
    onClose()
  }

  return (
    <div className="h-full flex flex-col bg-content1">
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-divider">
        <h2 className="text-lg font-semibold">会话历史</h2>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={onClose}
        >
          <PiX size={18} />
        </Button>
      </div>

      {/* 角色设定信息 */}
      {selectedCharacter && (
        <div className="p-4 border-b border-divider">
          <h3 className="text-sm font-medium mb-2">角色设定</h3>
          <div className="text-xs text-foreground-500 space-y-1">
            <p>🎭 经典文学和影视角色扮演</p>
            <p>🧠 {selectedCharacter.name}的专业知识和独特视角</p>
            <p>🗣️ 提供沉浸式语音对话体验</p>
            <p>💭 深度还原角色性格和说话方式</p>
          </div>
        </div>
      )}

      {/* 新建会话按钮 */}
      <div className="p-4 border-b border-divider">
        <Button
          className="w-full"
          color={activeSessionId === 'newChat' ? 'primary' : 'default'}
          variant={activeSessionId === 'newChat' ? 'solid' : 'flat'}
          startContent={<PiPlus size={16} />}
          onPress={handleNewSession}
        >
          新建会话
        </Button>
      </div>

      {/* 会话列表 */}
      <div className="flex-1 overflow-hidden">
        <div className="p-4">
          <h3 className="text-sm font-medium mb-3">
            对话历史 ({characterSessions.reduce((acc, group) => acc + group.items.length, 0)})
          </h3>
        </div>
        
        <ScrollShadow className="flex-1 px-4">
          <div className="space-y-4 pb-4">
            {characterSessions.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h4 className="text-xs font-medium text-foreground-600 mb-2 px-1">
                  {group.title}
                </h4>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                        activeSessionId === item.id
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-content2'
                      }`}
                      onClick={() => handleConversationClick(item.id)}
                    >
                      {item.starred ? (
                        <PiStarFill className="text-sm text-primary fill-current mt-0.5 flex-shrink-0" />
                      ) : (
                        <PiStar className="text-sm text-foreground-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-medium truncate ${
                            activeSessionId === item.id ? 'text-primary' : 'text-foreground'
                          }`}>
                            {item.title}
                          </span>
                          <span className="text-xs text-foreground-500 flex-shrink-0 ml-2">
                            {item.timestamp}
                          </span>
                        </div>
                        {item.lastMessage && (
                          <p className="text-xs text-foreground-500 truncate mb-1">
                            {item.lastMessage}
                          </p>
                        )}
                        <span className="text-xs text-foreground-400">
                          {item.messageCount} 条消息
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {groupIndex < characterSessions.length - 1 && (
                  <Divider className="my-3" />
                )}
              </div>
            ))}
          </div>
        </ScrollShadow>
      </div>
    </div>
  )
}
