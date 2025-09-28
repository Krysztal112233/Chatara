import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import { Head } from '@unhead/react'
import { Spinner } from '@heroui/react'
import { useState, useRef } from 'react'
import { MessageList } from '@/components/chat/MessageList'
import { ChatInput } from '@/components/chat/ChatInput'
import {
  useCreateHistoryIndex,
  useCreateHistoryMessage,
  useHistoryMessages,
} from '@/lib/api/histories'
import { useCharacter } from '@/lib/api/characters'
import { useAsr, useTts } from '@/lib/api/tools'

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
    mutate,
  } = useHistoryMessages(sessionId === 'newChat' ? '' : sessionId)
  const { character } = useCharacter(characterId)
  const [pendingMessage, setPendingMessage] = useState<string | null>(null)
  const { asr } = useAsr()
  const { tts } = useTts()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playTts = (text: string) => {
    tts({ text })
      .then((result) => {
        if (result?.url) {
          if (!audioRef.current) {
            audioRef.current = new Audio()
          }
          audioRef.current.src = result.url
          audioRef.current.play().catch((error: unknown) => {
            console.error('Audio playback failed:', error)
          })
        }
      })
      .catch((error: unknown) => {
        console.error('TTS failed:', error)
      })
  }

  // Transform API messages to MessageList format
  const messages = apiMessages.map((msg, index) => ({
    id: index + 1,
    content: msg.content,
    isUser: msg.role === 'User',
    time: new Date(msg.created_at).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    isPending: false,
  }))

  // Add pending message if exists
  if (pendingMessage) {
    messages.push({
      id: messages.length + 1,
      content: pendingMessage,
      isUser: true,
      time: new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isPending: true,
    })
  }

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
    setPendingMessage(message)

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
            }).catch((error: unknown) => {
              console.error(error)
            })

            createHistoryMessage({
              historyIndexId: res.payload.id,
              content: message,
            })
              .then(() => {
                setPendingMessage(null)
                mutate().then((data) => {
                  const updatedMessages = data?.payload?.content ?? []
                  const lastMessage = updatedMessages[updatedMessages.length - 1]
                  if (lastMessage && lastMessage.role === 'Character') {
                    playTts(lastMessage.content)
                  }
                }).catch((error: unknown) => {
                  console.error('Mutate failed:', error)
                })
              })
              .catch((error: unknown) => {
                console.error(error)
                setPendingMessage(null)
              })
          }
        })
        .catch((error: unknown) => {
          console.error(error)
          setPendingMessage(null)
        })
    } else {
      createHistoryMessage({
        historyIndexId: sessionId,
        content: message,
      })
        .then(() => {
          setPendingMessage(null)
          mutate().then((data) => {
            const updatedMessages = data?.payload?.content ?? []
            const lastMessage = updatedMessages[updatedMessages.length - 1]
            if (lastMessage && lastMessage.role === 'Character') {
              playTts(lastMessage.content)
            }
          }).catch((error: unknown) => {
            console.error('Mutate failed:', error)
          })
        })
        .catch((error: unknown) => {
          console.error(error)
          setPendingMessage(null)
        })
    }
  }

  const onAudioRecord = (audioBlob: Blob) => {
    asr(audioBlob)
      .then((text) => {
        if (text) {
          onChatInputSend(text)
        }
      })
      .catch((error: unknown) => {
        console.error('ASR failed:', error)
      })
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
        <ChatInput onSend={onChatInputSend} onAudioRecord={onAudioRecord} />
      </div>
    </>
  )
}
