import { createFileRoute } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { selectedCharacterIdAtom } from '@/store/chatStore'

export const Route = createFileRoute('/chat/')({
  component: ChatIndex,
})

function ChatIndex() {
  const navigate = useNavigate()
  const [selectedCharacterId] = useAtom(selectedCharacterIdAtom)

  useEffect(() => {
    if (selectedCharacterId) {
      // 如果有选中的角色，自动跳转到该角色页面
      navigate({ to: `/chat/${selectedCharacterId}` })
    }
  }, [selectedCharacterId, navigate])

  // 如果没有选中角色，显示空白
  return <div className="flex-1" />
}