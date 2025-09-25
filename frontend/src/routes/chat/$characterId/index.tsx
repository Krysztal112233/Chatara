import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/chat/$characterId/')({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/chat/$characterId/$sessionId',
      params: {
        characterId: params.characterId,
        sessionId: 'newChat'
      }
    })
  },
})
