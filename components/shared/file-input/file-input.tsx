import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FileInputProps {
  value?: File | null
  onChange: (file: File | null) => void
  accept?: string
  maxSize?: number
  label?: string
  error?: string
}

export function FileInput({
  value,
  onChange,
  accept = '.pdf,.doc,.docx,.mp4',
  maxSize = 5 * 1024 * 1024, // 5MB
  label = 'Drop file here or click to select',
  error,
}: FileInputProps) {
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
    accept: accept ? { 'application/pdf': ['.pdf'], 'application/msword': ['.doc', '.docx'] } : undefined,
    maxSize,
    multiple: false,
  })

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null)
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}
          ${error ? 'border-red-500' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          {value ? (
            <div className="flex items-center justify-between">
              <span className="text-sm">{value.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <p className="text-sm text-gray-500">{label}</p>
          )}
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}
