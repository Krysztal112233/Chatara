import { Avatar, Button } from '@heroui/react'

interface ChatHeaderProps {
  title: string
  description: string
  avatar?: string
}

export function ChatHeader({ title, description, avatar }: ChatHeaderProps) {
  return (
    <div className="h-16 bg-content1 border-b border-divider px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Avatar
          size="sm"
          src={avatar || "https://i.pravatar.cc/150?u=current"}
        />
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="text-xs text-default-500">{description}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          className="text-default-500"
        >
          ⋯
        </Button>
      </div>
    </div>
  )
}