import {
  createFileRoute,
  Outlet,
  useNavigate,
  useParams,
  useRouterState,
} from '@tanstack/react-router'
import { CharacterSidebar } from '@/components/chat/CharacterSidebar'
import { LeftPanel } from '@/components/chat/LeftPanel'
import { RightPanel } from '@/components/chat/RightPanel'
import { Head } from '@unhead/react'
import type { RoleSettings } from '@/components/chat/RightPanel'
import { useCharacters } from '@/lib/api/characters'
import { useHistoryIndexesForCharacter } from '@/lib/api/histories'

export const Route = createFileRoute('/_chat/chat')({
  component: Chat,
})

// 角色设定数据
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getRoleSettingsForCharacter = (_characterName: string): RoleSettings => ({
  title: '角色设定',
  descriptions: [
    'TODO: Role Settings',
  ],
})

function Chat() {
  const navigate = useNavigate({ from: '/chat' })
  const routerState = useRouterState()
  const { characters } = useCharacters()

  const { characterId: selectedCharacterId } = useParams({ strict: false })
  const selectedCharacter = characters.find(
    (char) => char.id === selectedCharacterId
  )
  const isInCharacterPage = routerState.location.pathname !== '/chat'
  const characterSessions =
    useHistoryIndexesForCharacter(selectedCharacterId)

  const handleNewSession = () => {
    if (selectedCharacter) {
      navigate({
        to: '/chat/$characterId/$sessionId',
        params: {
          characterId: selectedCharacter.id,
          sessionId: 'newChat',
        },
      }).catch(console.error)
    }
  }

  const handleRoleSettingsClick = () => {
    console.log('角色设定点击:', selectedCharacter?.name)
  }

  const handleConversationClick = (conversationId: string) => {
    if (selectedCharacter) {
      navigate({
        to: '/chat/$characterId/$sessionId',
        params: {
          characterId: selectedCharacter.id,
          sessionId: conversationId,
        },
      }).catch(console.error)
    }
  }

  const handleCharacterSelect = (characterId: string) => {
    navigate({
      to: '/chat/$characterId',
      params: {
        characterId,
      },
    }).catch(console.error)
  }

  const roleSettings = selectedCharacter
    ? getRoleSettingsForCharacter(selectedCharacter.name)
    : { title: '角色设定', descriptions: [] }

  return (
    <>
      <Head>
        <title>对话</title>
      </Head>
      <div className='flex h-full relative'>
        {/* 移动端角色选择 - 只在 /chat 根路径显示 */}
        {!isInCharacterPage && (
          <div className='md:hidden flex-1'>
            <CharacterSidebar
              isCollapsed={false}
              selectedCharacterId={selectedCharacter?.id || null}
              onCharacterSelect={handleCharacterSelect}
            />
          </div>
        )}

        {/* 桌面端左侧边栏 - 角色选择 */}
        <div className='hidden md:flex'>
          <LeftPanel minWidthPercent={0.15} maxWidthPercent={0.4}>
            {(isCollapsed) => (
              <CharacterSidebar
                isCollapsed={isCollapsed}
                selectedCharacterId={selectedCharacter?.id || null}
                onCharacterSelect={handleCharacterSelect}
              />
            )}
          </LeftPanel>
        </div>

        {/* 主聊天区域 */}
        <div
          className={`flex-1 flex flex-col ${
            !isInCharacterPage ? 'hidden md:flex' : 'flex'
          }`}
        >
          <Outlet />
        </div>

        {/* 桌面端右侧面板 - 只有在角色页面且选择了角色才显示 */}
        {selectedCharacter && isInCharacterPage && (
          <div className='hidden lg:flex'>
            <RightPanel
              minWidthPercent={0.2}
              maxWidthPercent={0.5}
              roleSettings={roleSettings}
              characterSessions={characterSessions}
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
