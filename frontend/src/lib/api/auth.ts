import useSWR from 'swr'
import { useFetcher } from '../fetcher'
import type { CommonResponse } from './base'

interface AuthResponse {
  uid: string
}

type TestAuthResponse = CommonResponse<AuthResponse>

export function useTestAuth() {
  const fetcher = useFetcher()
  const { data, error, isLoading, mutate } = useSWR<
    TestAuthResponse,
    Error
  >(
    '/',
    async (url: string) => fetcher.get(url) as Promise<TestAuthResponse>
  )

  return {
    uid: data?.payload?.uid,
    error,
    isLoading,
    mutate,
  }
}