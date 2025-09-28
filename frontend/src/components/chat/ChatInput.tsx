import { Button, Textarea } from '@heroui/react'
import { useState } from 'react'

interface ChatInputProps {
  onSend?: (message: string) => void
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (message.trim() && onSend) {
      onSend(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="p-6 bg-content1 border-t border-divider">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end space-x-3">
          <Textarea
            placeholder="输入消息..."
            value={message}
            onValueChange={setMessage}
            onKeyDown={handleKeyDown}
            minRows={1}
            maxRows={4}
            variant="bordered"
            classNames={{
              base: "flex-1",
              input: "text-sm resize-none",
              inputWrapper: "bg-background"
            }}
          />
          <Button
            color="primary"
            size="md"
            className="px-6"
            onPress={handleSend}
            isDisabled={!message.trim()}
          >
            发送
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-default-500">
            按 Enter 发送，Shift + Enter 换行
          </p>
        </div>
      </div>
    </div>
  )
}