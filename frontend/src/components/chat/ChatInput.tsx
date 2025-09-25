import { Button, Textarea } from '@heroui/react'

interface ChatInputProps {
  onSend?: (message: string) => void
}

export function ChatInput({ onSend }: ChatInputProps) {
  return (
    <div className="p-6 bg-content1 border-t border-divider">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end space-x-3">
          <Textarea
            placeholder="输入消息..."
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
            size="lg"
            className="px-6"
            onPress={() => {
              // Handle send message
              if (onSend) {
                onSend('New message')
              }
            }}
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