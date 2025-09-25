import { createFileRoute, Outlet, notFound } from '@tanstack/react-router'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { ChatWelcome } from '@/components/chat/ChatWelcome'
import { characters } from '@/store/chatStore'

export const Route = createFileRoute('/chat/$characterId')({
  component: CharacterLayout,
  beforeLoad: ({ params }) => {
    // 验证角色 ID 是否存在
    const validCharacterIds = characters.map(char => char.id)
    if (!validCharacterIds.includes(params.characterId)) {
      throw notFound()
    }
  },
})

function CharacterLayout() {
  const { characterId } = Route.useParams()
  const character = characters.find(char => char.id === characterId)

  if (!character) {
    return <div>角色未找到</div>
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader
        title={character.name}
        description={character.description}
        avatar={character.avatar}
      />
      <Outlet />
    </div>
  )
}