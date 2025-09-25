import { Avatar, Button, Card, CardBody } from '@heroui/react'
import { PiChatCircle } from 'react-icons/pi'
import { useAtom } from 'jotai'
import { useNavigate } from '@tanstack/react-router'
import { selectedCharacterAtom, selectedSessionIdAtom } from '@/store/chatStore'

export function ChatWelcome() {
  const navigate = useNavigate()
  const [selectedCharacter] = useAtom(selectedCharacterAtom)
  const [, setSelectedSessionId] = useAtom(selectedSessionIdAtom)

  const handleStartChat = () => {
    if (selectedCharacter) {
      setSelectedSessionId('newChat')
      navigate({ to: `/chat/${selectedCharacter.id}/newChat` })
    }
  }

  if (!selectedCharacter) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="text-6xl opacity-20">👋</div>
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              欢迎使用 Chatara
            </h2>
            <p className="text-default-500">
              请从左侧选择一个角色开始对话
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-full p-8">
      <Card className="max-w-md w-full" shadow="sm">
        <CardBody className="p-8 text-center space-y-6">
          {/* 角色头像和信息 */}
          <div className="space-y-4">
            <div className="relative mx-auto w-fit">
              <Avatar
                size="lg"
                src={selectedCharacter.avatar}
                className="w-20 h-20"
              />
              <div className="absolute -top-2 -right-2 text-3xl">
                {selectedCharacter.emoji}
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                {selectedCharacter.name}
              </h2>
              <p className="text-default-500">
                {selectedCharacter.description}
              </p>
            </div>
          </div>

          {/* 开始对话按钮 */}
          <Button
            color="primary"
            size="lg"
            startContent={<PiChatCircle size={20} />}
            className="w-full"
            onPress={handleStartChat}
          >
            开始对话
          </Button>

          {/* 提示文字 */}
          <p className="text-xs text-default-400">
            你也可以从右侧面板选择历史对话继续聊天
          </p>
        </CardBody>
      </Card>
    </div>
  )
}