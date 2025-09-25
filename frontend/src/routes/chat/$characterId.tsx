import { createFileRoute, Outlet, notFound, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { MobileSessionHistory } from '@/components/chat/MobileSessionHistory'
import { characters, getSessionsForCharacter } from '@/store/chatStore'

export const Route = createFileRoute('/chat/$characterId')({
  component: CharacterLayout,
  beforeLoad: ({ params }) => {
    // 验证角色 ID 是否存在
    const validCharacterIds = characters.map(char => char.id)
    if (!validCharacterIds.includes(params.characterId)) {
      throw notFound()
    }
  },
})

function CharacterLayout() {
  const { characterId } = Route.useParams()
  const navigate = useNavigate()
  const character = characters.find(char => char.id === characterId)
  const [showMobileHistory, setShowMobileHistory] = useState(false)
  const characterSessions = character ? getSessionsForCharacter(character.id) : []

  if (!character) {
    return <div>角色未找到</div>
  }

  const handleHistoryClick = () => {
    setShowMobileHistory(true)
  }

  const handleNewSession = () => {
    navigate({ to: `/chat/${characterId}/newChat` })
  }

  const handleConversationClick = (conversationId: string) => {
    navigate({ to: `/chat/${characterId}/${conversationId}` })
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader
        title={character.name}
        description={character.description}
        avatar={character.avatar}
        onHistoryClick={handleHistoryClick}
        onBackClick={() => navigate({ to: '/chat' })}
        showBackButton={true}
      />
      <Outlet />
      
      {/* 移动端会话历史模态框 */}
      {showMobileHistory && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
          <div 
            className="absolute inset-y-0 right-0 w-full max-w-sm bg-content1 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <MobileSessionHistory
              selectedCharacter={character}
              characterSessions={characterSessions}
              onClose={() => setShowMobileHistory(false)}
              onNewSession={handleNewSession}
              onConversationClick={handleConversationClick}
            />
          </div>
          <div 
            className="absolute inset-0"
            onClick={() => setShowMobileHistory(false)}
          />
        </div>
      )}
    </div>
  )
}