import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import { routeTree } from './routeTree.gen'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import type { NavigateOptions, ToOptions } from '@tanstack/react-router'

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

let enableMockingIfNeeded: () => Promise<unknown>

if (import.meta.env.MODE === 'mock') {
  enableMockingIfNeeded = async () => {
    if (import.meta.env.MODE !== 'mock') {
      return
    }

    const { worker } = await import('./mocks/browser')

    // `worker.start()` returns a Promise that resolves
    // once the Service Worker is up and ready to intercept requests.
    return worker.start()
  }
} else {
  enableMockingIfNeeded = () => Promise.resolve()
}

enableMockingIfNeeded().then(() => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  )
}).catch(console.error)
