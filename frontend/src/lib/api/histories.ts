import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { useFetcher } from '../fetcher'
import type { CommonResponse, PagedData } from './base'

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
  return historyIndexes.historyIndexes.filter(
    (index) => index.character === characterId
  )
}

// Legacy alias for backward compatibility
export const useHistories = useHistoryIndexes

export function useCreateHistoryIndex() {
  const fetcher = useFetcher()

  const createHistoryIndex = async (
    _: string,
    { arg }: { arg: { profileId: string } }
  ) => {
    return fetcher.post(
      `/histories?profile=${arg.profileId}`,
      {}
    ) as Promise<CreateHistoryIndexResponse>
  }

  const { trigger } = useSWRMutation(
    '/histories?profile=${profileId}',
    createHistoryIndex, {}
  )

  return { trigger }
}

export function useHistoryMessages(historyIndexId: string) {
  const fetcher = useFetcher()
  const { data, error, isLoading, mutate } = useSWR<
    GetHistoryMessagesResponse,
    Error
  >(
    historyIndexId ? `/histories/${historyIndexId}` : null,
    async (url: string) =>
      fetcher.get(url) as Promise<GetHistoryMessagesResponse>
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

  const createHistoryMessage = async (
    _: string,
    { arg }: { arg: { historyIndexId: string; content: string } }
  ) => {
    return fetcher.post(
      `/histories/${arg.historyIndexId}`,
      { content: arg.content }
    ) as Promise<CreateHistoryMessageResponse>
  }

  const { trigger } = useSWRMutation(
    '/histories',
    createHistoryMessage
  )

  return { trigger }
}

export function useDeleteHistory() {
  const fetcher = useFetcher()

  const deleteHistory = async (historyIndexId: string) => {
    return fetcher.delete(
      `/histories/${historyIndexId}`
    ) as Promise<CommonResponse>
  }

  return { deleteHistory }
}
