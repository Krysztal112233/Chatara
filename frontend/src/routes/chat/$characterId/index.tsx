import { createFileRoute } from '@tanstack/react-router'
import { ChatWelcome } from '@/components/chat/ChatWelcome'

export const Route = createFileRoute('/chat/$characterId/')({
  component: CharacterWelcome,
})

function CharacterWelcome() {
  return <ChatWelcome />
}