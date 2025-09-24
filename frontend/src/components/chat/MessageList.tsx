import { Avatar, Card, CardBody, ScrollShadow } from '@heroui/react'

interface Message {
  id: number
  content: string
  isUser: boolean
  time: string
}

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <ScrollShadow className="flex-1 p-6">
      <div className="space-y-6 max-w-4xl mx-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.isUser ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <Avatar
              size="sm"
              src={message.isUser
                ? 'https://i.pravatar.cc/150?u=demo'
                : 'https://i.pravatar.cc/150?u=ai'
              }
            />
            <div className={`flex flex-col ${message.isUser ? 'items-end' : 'items-start'}`}>
              <Card
                shadow="none"
                className={`max-w-lg ${
                  message.isUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-content2'
                }`}
              >
                <CardBody className="p-3">
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                </CardBody>
              </Card>
              <span className="text-xs text-default-500 mt-1">
                {message.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ScrollShadow>
  )
}