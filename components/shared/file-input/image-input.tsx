'use client'
import React, { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { X, Upload, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface ImageInputProps {
  value?: string | File | null
  onChange: (file: File | null) => void
  maxSize?: number
  label?: string
  error?: string
}

export function ImageInput({
  value,
  onChange,
  maxSize = 2 * 1024 * 1024, // 2MB
  label = 'Drop image here or click to select',
  error,
}: ImageInputProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string>('')

  useEffect(() => {
    // If value is a string (URL), use it directly
    if (typeof value === 'string') {
      setPreview(value);  // Use the URL directly
    }
    // If value is a Blob or File, create an object URL
    else if (value instanceof Blob) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);  // In case value is neither a string nor a Blob/File
    }
  }, [value]);
  
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Clear previous validation errors
      setValidationError('');
      
      // Handle accepted files
      if (acceptedFiles?.[0]) {
        onChange(acceptedFiles[0]);
        return;
      }
      
      // Handle rejected files with appropriate error messages
      if (rejectedFiles.length > 0) {
        const rejectedFile = rejectedFiles[0];
        
        if (rejectedFile.errors) {
          // Check for size error
          const sizeError = rejectedFile.errors.find((err: any) => err.code === 'file-too-large');
          if (sizeError) {
            setValidationError(`File is too large. Maximum size is ${(maxSize / (1024 * 1024)).toFixed(0)}MB.`);
            return;
          }
          
          // Check for format error
          const typeError = rejectedFile.errors.find((err: any) => err.code === 'file-invalid-type');
          if (typeError) {
            setValidationError('Invalid file format. Please upload JPG, JPEG, PNG, or WEBP images only.');
            return;
          }
          
          // Generic error if none of the above
          setValidationError('File could not be uploaded. Please try again.');
        }
      }
    },
    [onChange, maxSize]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
    },
    maxSize,
    multiple: false,
  })

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChange(null)
    setValidationError('')
  }
    
  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}
          ${error || validationError ? 'border-red-500' : ''}
          ${preview ? 'p-2' : 'p-8'}
        `}
      >
        <input {...getInputProps()} />
         
        {preview ? (
          <div className="relative w-[200px] aspect-video">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-[-1rem] right-[1rem] z-10"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center flex flex-col items-center gap-2">
            <Upload className="h-6 w-6 text-gray-400" />
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-xs text-gray-400">
              Accepted formats: JPG, JPEG, PNG, WEBP
              <br />
              Max size: {(maxSize / (1024 * 1024)).toFixed(0)}MB
            </p>
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
      
      {(error || validationError) && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          <p>{validationError || error}</p>
        </div>
      )}
    </div>
  )
}