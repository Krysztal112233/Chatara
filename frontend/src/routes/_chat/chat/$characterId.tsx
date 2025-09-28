import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Spinner } from '@heroui/react'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { MobileSessionHistory } from '@/components/chat/MobileSessionHistory'
import { useCharacter } from '@/lib/api/characters'
import { useHistoryIndexesForCharacter } from '@/lib/api/histories'

export const Route = createFileRoute('/_chat/chat/$characterId')({
  component: CharacterLayout,
})

function CharacterLayout() {
  const { characterId } = Route.useParams()
  const navigate = useNavigate({ from: '/chat/$characterId' })
  const { character, isLoading, error } = useCharacter(characterId)
  const [showMobileHistory, setShowMobileHistory] = useState(false)

  const characterSessions = useHistoryIndexesForCharacter(character?.id)

  const handleHistoryClick = () => {
    setShowMobileHistory(true)
  }

  const handleNewSession = () => {
    navigate({ to: '/chat/$characterId', params: { characterId } }).catch(
      console.error
    )
  }

  const handleConversationClick = (conversationId: string) => {
    navigate({
      to: '/chat/$characterId/$sessionId',
      params: { characterId, sessionId: conversationId },
    }).catch(console.error)
  }

  // 显示加载状态
  if (isLoading) {
    return (
      <div className='flex-1 flex items-center justify-center'>
        <Spinner size='lg' />
      </div>
    )
  }

  // 显示错误状态
  if (error || !character) {
    return (
      <div className='flex-1 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-lg font-semibold text-default-900'>角色未找到</h2>
          <p className='text-default-500 mt-1'>
            {error?.message || '请检查角色 ID 是否正确'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex-1 flex flex-col h-full'>
      <ChatHeader
        title={character.name}
        description={character.description || ''}
        avatar={character.avatar || '🤖'}
        onHistoryClick={handleHistoryClick}
        onBackClick={() => {
          navigate({ to: '/chat' }).catch(console.error)
        }}
        showBackButton={true}
      />
      <Outlet />

      {/* 移动端会话历史模态框 */}
      {showMobileHistory && (
        <div className='fixed inset-0 bg-black/50 z-50 md:hidden'>
          <div
            className='absolute inset-y-0 right-0 w-full max-w-sm bg-content1 z-10'
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <MobileSessionHistory
              selectedCharacter={character}
              characterSessions={characterSessions}
              onClose={() => {
                setShowMobileHistory(false)
              }}
              onNewSession={handleNewSession}
              onConversationClick={handleConversationClick}
            />
          </div>
          <div
            className='absolute inset-0'
            onClick={() => {
              setShowMobileHistory(false)
            }}
          />
        </div>
      )}
    </div>
  )
}
