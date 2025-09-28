import { useFetcher } from '../fetcher'
import type { CommonResponse } from './base'

type AsrResponse = CommonResponse<string>

interface TtsRequest {
  text: string
  voice?: string
  language?: string
}

interface TtsVO {
  id: string
  url: string
}

type TtsResponse = CommonResponse<TtsVO>

export function useAsr() {
  const fetcher = useFetcher()

  const asr = async (audioBlob: Blob): Promise<string> => {
    const formData = new FormData()
    formData.append('file', audioBlob, 'audio.ogg')

    const response = await fetcher.base('/tool/asr', {
      method: 'POST',
      body: formData,
    }) as AsrResponse

    return response.payload ?? ''
  }

  return { asr }
}

export function useTts() {
  const fetcher = useFetcher()

  const tts = async (request: TtsRequest): Promise<TtsVO | null> => {
    const response = await fetcher.post('/tool/tts', request) as TtsResponse
    return response.payload ?? null
  }

  return { tts }
}