import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import { routeTree } from './routeTree.gen'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { HeroUIProvider } from '@heroui/react'
import type { NavigateOptions, ToOptions } from '@tanstack/react-router'
import { createHead, UnheadProvider } from '@unhead/react/client'
import { Provider as JotaiProvider } from 'jotai/react'

const head = createHead({
  init: [
    {
      title: 'Loading...',
      titleTemplate: '%s - Chatara',
    },
  ],
})

const router = createRouter({
  routeTree,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

declare module '@react-types/shared' {
  interface RouterConfig {
    href: ToOptions['to']
    routerOptions: Omit<NavigateOptions, keyof ToOptions>
  }
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <JotaiProvider>
      <UnheadProvider head={head}>
        <HeroUIProvider
          navigate={(to, options) => router.navigate({ to, ...options })}
          useHref={(to) => router.buildLocation({ to }).href}
        >
          {children}
        </HeroUIProvider>
      </UnheadProvider>
    </JotaiProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>
)
