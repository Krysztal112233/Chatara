import { createFileRoute, useLocation } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { selectedCharacterIdAtom } from '@/store/chatStore'
import { useAuth0 } from '@auth0/auth0-react'

export const Route = createFileRoute('/_chat/chat/')({
  component: ChatIndex,
})

function ChatIndex() {
  const [, setSelectedCharacterId] = useAtom(selectedCharacterIdAtom)

  // 在 /chat 根路径下清空选中的角色
  useEffect(() => {
    setSelectedCharacterId(null)
  }, [setSelectedCharacterId])

  const { isAuthenticated, loginWithRedirect } = useAuth0()
  const path = useLocation().href

  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect({
        appState: { returnTo: path },
      }).catch(console.error)
    }
  }, [isAuthenticated])

  return (
    <div className='flex-1 flex items-center justify-center'>
      <div className='text-center space-y-4'>
        <div className='text-6xl opacity-20'>👋</div>
        <div>
          <h2 className='text-xl font-semibold text-foreground mb-2'>
            欢迎使用 Chatara
          </h2>
          <p className='text-default-500'>请从左侧选择一个角色开始对话</p>
        </div>
      </div>
    </div>
  )
}
