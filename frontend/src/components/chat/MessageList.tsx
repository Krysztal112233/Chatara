import { Avatar, Card, CardBody, ScrollShadow } from '@heroui/react'
import { useAuth0 } from '@auth0/auth0-react'

interface Message {
  id: number
  content: string
  isUser: boolean
  time: string
  isPending?: boolean
}

interface MessageListProps {
  messages: Message[]
  characterAvatar?: string
}

export function MessageList({ messages, characterAvatar }: MessageListProps) {
  const { user } = useAuth0()
  return (
    <ScrollShadow className='flex-1 p-6'>
      <div className='space-y-6 max-w-4xl mx-auto'>
        {messages.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full text-center space-y-6'>
            <div className='text-8xl opacity-50'>💭</div>
            <div className='space-y-3'>
              <p className='text-2xl font-medium text-default-600'>开始对话吧</p>
              <p className='text-base text-default-500'>发送一条消息，让精彩的对话开始</p>
              <p className='text-sm text-default-400'>每一段对话都是独特的旅程</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.isUser ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              {message.isUser ? (
                <Avatar
                  size='sm'
                  src={user?.picture || 'https://i.pravatar.cc/150?u=demo'}
                  className='flex-shrink-0'
                />
              ) : (
                <div className='flex-shrink-0 w-8 h-8 flex items-center justify-center text-xl'>
                  {characterAvatar || '🤖'}
                </div>
              )}
              <div
                className={`flex flex-col ${
                  message.isUser ? 'items-end' : 'items-start'
                }`}
              >
                <Card
                  shadow='none'
                  className={`max-w-lg ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-content2'
                  } ${message.isPending ? 'opacity-50' : ''}`}
                >
                  <CardBody className='p-3'>
                    <p className='text-sm whitespace-pre-wrap'>
                      {message.content}
                    </p>
                  </CardBody>
                </Card>
                <span className='text-xs text-default-500 mt-1'>
                  {message.time}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </ScrollShadow>
  )
}
