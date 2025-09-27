import { HeroUIProvider } from '@heroui/react'
import { useRouter } from '@tanstack/react-router'
import { createHead, UnheadProvider } from '@unhead/react/client'
import { Provider as JotaiProvider } from 'jotai/react'

const head = createHead({
  init: [
    {
      title: 'Loading...',
      titleTemplate: '%s · Chatara',
    },
  ],
})

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()

  return (
    <JotaiProvider>
      <UnheadProvider head={head}>
        <HeroUIProvider
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          navigate={(to, options) => router.navigate({ to, ...options })}
          useHref={(to) => router.buildLocation({ to }).href}
        >
          {children}
        </HeroUIProvider>
      </UnheadProvider>
    </JotaiProvider>
  )
}
