import useSWR from 'swr'
import { useFetcher } from '../fetcher'
import type { CommonResponse } from './base'

interface CharacterProfile {
  id: string
  name: string
  settings: Record<string, unknown>
  created_at: string
}

interface CreateCharacterRequest {
  name: string
  settings: Record<string, unknown>
}

type GetCharactersResponse = CommonResponse<CharacterProfile[]>
type GetCharacterResponse = CommonResponse<CharacterProfile>
type CreateCharacterResponse = CommonResponse<CharacterProfile>

export function useCharacters() {
  const fetcher = useFetcher()
  const { data, error, isLoading, mutate } = useSWR<
    GetCharactersResponse,
    Error
  >(
    '/characters',
    async (url: string) => fetcher.get(url) as Promise<GetCharactersResponse>
  )

  return {
    characters: data?.payload ?? [],
    error,
    isLoading,
    mutate,
  }
}

export function useCharacter(characterId: string) {
  const fetcher = useFetcher()
  const { data, error, isLoading, mutate } = useSWR<
    GetCharacterResponse,
    Error
  >(
    characterId ? `/characters/${characterId}` : null,
    async (url: string) => fetcher.get(url) as Promise<GetCharacterResponse>
  )

  return {
    character: data?.payload,
    error,
    isLoading,
    mutate,
  }
}

export function useCreateCharacter() {
  const fetcher = useFetcher()

  const createCharacter = async (request: CreateCharacterRequest) => {
    return fetcher.post('/characters', request) as Promise<CreateCharacterResponse>
  }

  return { createCharacter }
}

export function useDeleteCharacter() {
  const fetcher = useFetcher()

  const deleteCharacter = async (characterId: string) => {
    return fetcher.delete(`/characters/${characterId}`) as Promise<CommonResponse>
  }

  return { deleteCharacter }
}
