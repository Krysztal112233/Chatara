import { HeroUIProvider } from '@heroui/react'
import { useRouter } from '@tanstack/react-router'
import { createHead, UnheadProvider } from '@unhead/react/client'
import { Provider as JotaiProvider } from 'jotai/react'
import { Auth0Provider, type AppState } from '@auth0/auth0-react'

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

  const onRedirectCallback = (appState: AppState | undefined) => {
    const returnHref = appState?.returnTo
    if (!returnHref) {
      return
    }
    router.navigate({ to: returnHref }).catch(console.error)
  }

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin + '/auth/login',
        audience: import.meta.env.VITE_AUTH0_BACKEND_AUDIENCE,
        scope: 'openid profile email',
      }}
      cacheLocation='localstorage'
      useRefreshTokens={true}
      onRedirectCallback={onRedirectCallback}
    >
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
    </Auth0Provider>
  )
}
