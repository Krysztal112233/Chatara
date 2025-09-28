import useSWR from 'swr'
import { useFetcher } from '../fetcher'
import type { CommonResponse } from './base'

interface PagedData<T = unknown> {
  size: number
  next: boolean
  content: T[]
}

export interface HistoryIndex {
  id: string
  character: string
  updated_at: string
}

export interface History {
  id: string
  role: 'System' | 'User' | 'Character'
  content: string
  created_at: string
}

interface CreateHistoryRequest {
  content: string
}

type GetHistoriesResponse = CommonResponse<PagedData<HistoryIndex>>
type CreateHistoryIndexResponse = CommonResponse<HistoryIndex>
type GetHistoryMessagesResponse = CommonResponse<PagedData<History>>
type CreateHistoryMessageResponse = CommonResponse<History>

export function useHistoryIndexes() {
  const fetcher = useFetcher()
  const { data, error, isLoading, mutate } = useSWR<
    GetHistoriesResponse,
    Error
  >(
    '/histories',
    async (url: string) => fetcher.get(url) as Promise<GetHistoriesResponse>
  )

  return {
    historyIndexes: data?.payload?.content ?? [],
    hasNext: data?.payload?.next ?? false,
    size: data?.payload?.size ?? 0,
    error,
    isLoading,
    mutate,
  }
}

export function useHistoryIndexesForCharacter(characterId?: string) {
  const historyIndexes = useHistoryIndexes()
  if (!characterId) {
    return []
  }
  return historyIndexes.historyIndexes.filter((index) => index.character === characterId)
}

// Legacy alias for backward compatibility
export const useHistories = useHistoryIndexes

export function useCreateHistoryIndex() {
  const fetcher = useFetcher()

  const createHistoryIndex = async (profileId: string) => {
    return fetcher.post(`/histories?profile=${profileId}`) as Promise<CreateHistoryIndexResponse>
  }

  return { createHistoryIndex }
}

export function useHistoryMessages(historyIndexId: string) {
  const fetcher = useFetcher()
  const { data, error, isLoading, mutate } = useSWR<
    GetHistoryMessagesResponse,
    Error
  >(
    historyIndexId ? `/histories/${historyIndexId}` : null,
    async (url: string) => fetcher.get(url) as Promise<GetHistoryMessagesResponse>
  )

  return {
    messages: data?.payload?.content ?? [],
    hasNext: data?.payload?.next ?? false,
    size: data?.payload?.size ?? 0,
    error,
    isLoading,
    mutate,
  }
}

export function useCreateHistoryMessage() {
  const fetcher = useFetcher()

  const createHistoryMessage = async (historyIndexId: string, request: CreateHistoryRequest) => {
    return fetcher.post(`/histories/${historyIndexId}`, request) as Promise<CreateHistoryMessageResponse>
  }

  return { createHistoryMessage }
}

export function useDeleteHistory() {
  const fetcher = useFetcher()

  const deleteHistory = async (historyIndexId: string) => {
    return fetcher.delete(`/histories/${historyIndexId}`) as Promise<CommonResponse>
  }

  return { deleteHistory }
}