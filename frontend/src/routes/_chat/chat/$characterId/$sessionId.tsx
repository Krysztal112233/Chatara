import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import { Head } from '@unhead/react'
import { Spinner } from '@heroui/react'
import { MessageList } from '@/components/chat/MessageList'
import { ChatInput } from '@/components/chat/ChatInput'
import {
  useCreateHistoryIndex,
  useCreateHistoryMessage,
  useHistoryMessages,
} from '@/lib/api/histories'
import { useCharacter } from '@/lib/api/characters'

export const Route = createFileRoute('/_chat/chat/$characterId/$sessionId')({
  component: ChatSession,
})

function ChatSession() {
  const { sessionId, characterId } = Route.useParams()
  const navigate = useNavigate({ from: '/chat/$characterId/$sessionId' })
  const {
    messages: apiMessages,
    isLoading,
    error,
  } = useHistoryMessages(sessionId === 'newChat' ? '' : sessionId)
  const { character } = useCharacter(characterId)

  // Transform API messages to MessageList format
  const messages = apiMessages.map((msg, index) => ({
    id: index + 1,
    content: msg.content,
    isUser: msg.role === 'User',
    time: new Date(msg.created_at).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }))

  const getSessionTitle = () => {
    if (sessionId === 'newChat') {
      return '新对话'
    }

    if (apiMessages.length > 0) {
      return (
        apiMessages[0].content.slice(0, 20) +
        (apiMessages[0].content.length > 20 ? '...' : '')
      )
    }

    return `会话 ${sessionId}`
  }

  const { trigger: createHistoryIndex } = useCreateHistoryIndex()
  const { trigger: createHistoryMessage } = useCreateHistoryMessage()

  const onChatInputSend = (message: string) => {
    if (sessionId === 'newChat') {
      createHistoryIndex({ profileId: characterId })
        .then((res) => {
          if (res.payload?.id) {
            navigate({
              to: '/chat/$characterId/$sessionId',
              params: {
                characterId,
                sessionId: res.payload.id,
              },
            }).catch(console.error)

            createHistoryMessage({
              historyIndexId: res.payload.id,
              content: message,
            }).catch(console.error)
          }
        })
        .catch(console.error)
    } else {
      createHistoryMessage({
        historyIndexId: sessionId,
        content: message,
      }).catch(console.error)
    }
  }

  if (isLoading) {
    return (
      <>
        <Head>
          <title>{getSessionTitle()}</title>
        </Head>
        <div className='flex-1 flex items-center justify-center'>
          <Spinner size='lg' />
        </div>
      </>
    )
  }

  if (error) {
    throw notFound()
  }

  return (
    <>
      <Head>
        <title>{getSessionTitle()}</title>
      </Head>
      <div className='flex-1 flex flex-col h-full'>
        <MessageList
          messages={messages}
          characterAvatar={character?.avatar}
        />
        <ChatInput onSend={onChatInputSend} />
      </div>
    </>
  )
}
