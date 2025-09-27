import { useAuth0 } from '@auth0/auth0-react'

interface FetcherOptions extends RequestInit {
  baseURL?: string
  timeout?: number
}

interface FetcherOptionsWithAuth extends FetcherOptions {
  accessToken?: string
}

interface FetchError extends Error {
  status: number
}

const defaultBaseURL = import.meta.env.VITE_API_BASE_URL

const baseFetcher = async (
  url: string,
  options?: FetcherOptionsWithAuth
): Promise<unknown> => {
  const {
    baseURL = defaultBaseURL,
    timeout = 10000,
    accessToken,
    ...fetchOptions
  } = options || {}

  // if url is a relative path, use baseURL to construct the full URL
  if (url.startsWith('/')) {
    url = (new URL(url, baseURL)).toString()
  }

  // Add Authorization header if accessToken is provided
  if (accessToken) {
    const authHeaders = {
      Authorization: `Bearer ${accessToken}`,
    }

    fetchOptions.headers = Object.assign({}, fetchOptions.headers, authHeaders)
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort()
  }, timeout)

  try {
    const res = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!res.ok) {
      const error = new Error(
        `HTTP ${res.status.toString()}: ${res.statusText}`
      ) as FetchError
      error.status = res.status
      throw error
    }

    const contentType = res.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      return await res.json()
    }

    return await res.text()
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout')
    }
    throw error
  }
}

export const useFetcher = () => {
  const { getAccessTokenSilently } = useAuth0()

  const hookBaseFetcher = async (url: string, options?: FetcherOptionsWithAuth) => {
    let accessToken
    try {
      accessToken = await getAccessTokenSilently()
    } catch (error) {
      console.error(error)
    }
    return baseFetcher(url, { ...options, accessToken })
  }

  return {
    base: hookBaseFetcher,

    get: (url: string, options?: FetcherOptionsWithAuth) =>
      hookBaseFetcher(url, { ...options, method: 'GET' }),

    post: (url: string, data?: unknown, options?: FetcherOptionsWithAuth) =>
      hookBaseFetcher(url, {
        ...options,
        method: 'POST',
        headers: Object.assign(
          {
            'Content-Type': 'application/json',
          },
          options?.headers
        ),
        body: JSON.stringify(data),
      }),

    put: (url: string, data?: unknown, options?: FetcherOptionsWithAuth) =>
      hookBaseFetcher(url, {
        ...options,
        method: 'PUT',
        headers: Object.assign(
          {
            'Content-Type': 'application/json',
          },
          options?.headers
        ),
        body: JSON.stringify(data),
      }),

    patch: (url: string, data?: unknown, options?: FetcherOptionsWithAuth) =>
      hookBaseFetcher(url, {
        ...options,
        method: 'PATCH',
        headers: Object.assign(
          {
            'Content-Type': 'application/json',
          },
          options?.headers
        ),
        body: JSON.stringify(data),
      }),

    delete: (url: string, options?: FetcherOptionsWithAuth) =>
      hookBaseFetcher(url, { ...options, method: 'DELETE' }),
  }
}
