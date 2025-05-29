import React, { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { X, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VideoInputProps {
  value?: File | null
  onChange: (file: File | null) => void
  maxSize?: number
  label?: string
  error?: string
}

export function VideoInput({
  value,
  onChange,
  maxSize = 100 * 1024 * 1024, // 100MB default
  label = 'Drop video here or click to select',
  error,
}: VideoInputProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    // If value is a string (URL), use it directly
    if (typeof value === 'string') {
      setPreview(value)
    }
    // If value is a Blob or File, create an object URL
    else if (value instanceof Blob) {
      const objectUrl = URL.createObjectURL(value)
      setPreview(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    } else {
      setPreview(null)
    }
  }, [value])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.[0]) {
        onChange(acceptedFiles[0])
      }
    },
    [onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.webm', '.ogg', '.mov'],
    },
    maxSize,
    multiple: false,
  })

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChange(null)
    setIsPlaying(false)
  }

  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const video = document.querySelector('video')
    if (video) {
      if (video.paused) {
        video.play()
        setIsPlaying(true)
      } else {
        video.pause()
        setIsPlaying(false)
      }
    }
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}
          ${error ? 'border-red-500' : ''}
          ${preview ? 'p-2' : 'p-8'}
        `}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="relative w-full max-w-[400px] aspect-video">
            <video
              src={preview}
              className="w-full h-full rounded-lg object-cover"
              controls={isPlaying}
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="z-10"
                onClick={togglePlay}
              >
                <Play className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="z-10"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-500">{label}</p>
            {value && (
              <Button
                variant="destructive"
                size="sm"
                className="mt-2"
                onClick={handleRemove}
              >
                Remove
              </Button>
            )}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}