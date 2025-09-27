import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import { routeTree } from './routeTree.gen'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import type { NavigateOptions, ToOptions } from '@tanstack/react-router'
import { Providers } from './providers'

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

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>
)
