import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { CharacterSidebar } from '@/components/chat/CharacterSidebar'
import { LeftPanel } from '@/components/chat/LeftPanel'
import { RightPanel } from '@/components/chat/RightPanel'
import { Head } from '@unhead/react'
import { useAtom } from 'jotai'
import { 
  selectedCharacterAtom, 
  selectedCharacterSessionsAtom,
  selectedSessionIdAtom
} from '@/store/chatStore'
import type { RoleSettings } from '@/components/chat/RightPanel'

export const Route = createFileRoute('/chat')({
  component: Chat,
})

// 角色设定数据
const getRoleSettingsForCharacter = (characterName: string): RoleSettings => ({
  title: '角色设定',
  descriptions: [
    `🎭 经典文学和影视角色扮演`,
    `🧠 ${characterName}的专业知识和独特视角`,
    `🗣️ 提供沉浸式语音对话体验`,
    `💭 深度还原角色性格和说话方式`
  ]
})

function Chat() {
  const navigate = useNavigate()
  const [selectedCharacter] = useAtom(selectedCharacterAtom)
  const [characterSessions] = useAtom(selectedCharacterSessionsAtom)
  const [, setSelectedSessionId] = useAtom(selectedSessionIdAtom)

  const handleNewSession = () => {
    if (selectedCharacter) {
      console.log('新建会话，角色:', selectedCharacter.name)
      setSelectedSessionId('newChat')
      navigate({ to: `/chat/${selectedCharacter.id}/newChat` })
    }
  }

  const handleRoleSettingsClick = () => {
    console.log('角色设定点击:', selectedCharacter?.name)
  }

  const handleConversationClick = (conversationId: string) => {
    if (selectedCharacter) {
      console.log('对话点击:', conversationId, '角色:', selectedCharacter?.name)
      setSelectedSessionId(conversationId)
      navigate({ to: `/chat/${selectedCharacter.id}/${conversationId}` })
    }
  }

  const roleSettings = selectedCharacter 
    ? getRoleSettingsForCharacter(selectedCharacter.name)
    : { title: '角色设定', descriptions: [] }

  return (
    <>
      <Head>
        <title>{selectedCharacter ? `${selectedCharacter.name} - 角色对话` : '角色对话'}</title>
      </Head>
      <div className='flex h-full relative'>
        {/* 桌面端左侧边栏 - 角色选择 */}
        <div className='hidden md:flex'>
          <LeftPanel minWidthPercent={0.15} maxWidthPercent={0.4}>
            {(isCollapsed) => (
              <CharacterSidebar isCollapsed={isCollapsed} />
            )}
          </LeftPanel>
        </div>

        {/* 主聊天区域 */}
        <div className='flex-1 flex flex-col'>
          <Outlet />
        </div>

        {/* 桌面端右侧面板 - 只有选择了角色才显示 */}
        {selectedCharacter && (
          <div className='hidden lg:flex'>
            <RightPanel 
              minWidthPercent={0.2} 
              maxWidthPercent={0.5}
              roleSettings={roleSettings}
              conversations={characterSessions}
              onNewSession={handleNewSession}
              onRoleSettingsClick={handleRoleSettingsClick}
              onConversationClick={handleConversationClick}
            />
          </div>
        )}
      </div>
    </>
  )
}
