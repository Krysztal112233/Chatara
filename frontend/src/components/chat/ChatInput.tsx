import { Button, Textarea } from '@heroui/react'
import { useState, useRef, useEffect } from 'react'
import { PiMicrophone, PiStop } from 'react-icons/pi'

interface ChatInputProps {
  onSend?: (message: string) => void
  onAudioRecord?: (audioBlob: Blob) => void
}

export function ChatInput({ onSend, onAudioRecord }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const silenceTimerRef = useRef<number | null>(null)

  const handleSend = () => {
    if (message.trim() && onSend) {
      onSend(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const startVAD = (stream: MediaStream) => {
    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    const microphone = audioContext.createMediaStreamSource(stream)
    
    analyser.fftSize = 2048
    analyser.smoothingTimeConstant = 0.8
    microphone.connect(analyser)
    
    audioContextRef.current = audioContext
    analyserRef.current = analyser

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    let animationFrameId: number

    const checkSilence = () => {
      if (!analyserRef.current || !mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        return
      }

      analyserRef.current.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((a, b) => a + b) / bufferLength

      if (average < 10) {
        if (!silenceTimerRef.current) {
          silenceTimerRef.current = window.setTimeout(() => {
            stopRecording()
          }, 2000)
        }
      } else {
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current)
          silenceTimerRef.current = null
        }
      }

      animationFrameId = requestAnimationFrame(checkSilence)
    }

    animationFrameId = requestAnimationFrame(checkSilence)
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }

  const stopVAD = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(console.error)
      audioContextRef.current = null
    }
    analyserRef.current = null
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/ogg; codecs=opus' })
        if (onAudioRecord) {
          onAudioRecord(audioBlob)
        }
        audioChunksRef.current = []
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => {
            track.stop()
          })
          streamRef.current = null
        }
        stopVAD()
      }

      mediaRecorder.start()
      setIsRecording(true)
      startVAD(stream)
    } catch (error) {
      console.error('Failed to start recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleRecordToggle = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording().catch(console.error)
    }
  }

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop()
        })
      }
      stopVAD()
    }
  }, [])

  return (
    <div className="p-6 bg-content1 border-t border-divider">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end space-x-3">
          <Textarea
            placeholder="输入消息..."
            value={message}
            onValueChange={setMessage}
            onKeyDown={handleKeyDown}
            minRows={1}
            maxRows={4}
            variant="bordered"
            classNames={{
              base: "flex-1",
              input: "text-sm resize-none",
              inputWrapper: "bg-background"
            }}
          />
          <Button
            color="primary"
            size="md"
            className="px-6"
            onPress={handleSend}
            isDisabled={!message.trim()}
          >
            发送
          </Button>
          <Button
            color={isRecording ? 'danger' : 'default'}
            variant={isRecording ? 'solid' : 'flat'}
            size="md"
            isIconOnly
            onPress={handleRecordToggle}
          >
            {isRecording ? <PiStop size={20} /> : <PiMicrophone size={20} />}
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-default-500">
            按 Enter 发送，Shift + Enter 换行
          </p>
        </div>
      </div>
    </div>
  )
}