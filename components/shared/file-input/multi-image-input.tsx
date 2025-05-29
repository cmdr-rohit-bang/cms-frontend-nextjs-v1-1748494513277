'use client'
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface MultiImageInputProps {
  value?: (File | string)[] | null;
  onChange: (files: (File | string)[]) => void;
  maxSize?: number;
  label?: string;
  error?: string;
  maxFiles?: number;
}

interface PreviewItem {
  file?: File;
  url: string;
  id: string;
  isExisting?: boolean;
}

export function MultiImageInput({
  value = [],
  onChange,
  maxSize = 2 * 1024 * 1024,
  label = 'Drop images here or click to select',
  error,
  maxFiles = 5,
}: MultiImageInputProps) {
  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  const [sizeError, setSizeError] = useState<string>('');
  const pendingUpdateRef = useRef<(File | string)[] | null>(null);

  useEffect(() => {
    if (!value) {
      setPreviews([]);
      return;
    }

    const newPreviews = value.map((item) => ({
      file: item instanceof File ? item : undefined,
      url: item instanceof File ? URL.createObjectURL(item) : item,
      id: Math.random().toString(36).substring(2),
      isExisting: !(item instanceof File)
    }));

    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach(preview => {
        if (preview.url.startsWith('blob:')) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [value]);

  // Handle pending updates
  useEffect(() => {
    if (pendingUpdateRef.current !== null) {
      onChange(pendingUpdateRef.current);
      pendingUpdateRef.current = null;
    }
  });

  const updateFiles = useCallback((newPreviews: PreviewItem[]) => {
    setPreviews(newPreviews);
    pendingUpdateRef.current = newPreviews.map(p => p.isExisting ? p.url : p.file!);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Clear previous size error
    setSizeError('');
    
    // Check for size errors in rejected files
    const sizeErrorFiles = rejectedFiles.filter(file => 
      file.errors && file.errors.some((err: any) => err.code === 'file-too-large')
    );
    
    if (sizeErrorFiles.length > 0) {
      setSizeError(`${sizeErrorFiles.length} file(s) exceeded the ${(maxSize / (1024 * 1024)).toFixed(0)}MB limit`);
      return;
    }

    const availableSlots = maxFiles - previews.length;
    if (availableSlots <= 0) return;

    const filesToAdd = acceptedFiles.slice(0, availableSlots);
    const newPreviews = filesToAdd.map(file => ({
      file,
      url: URL.createObjectURL(file),
      id: Math.random().toString(36).substring(2),
      isExisting: false
    }));

    updateFiles([...previews, ...newPreviews]);
  }, [maxFiles, maxSize, previews, updateFiles]);

  const removeFile = useCallback((idToRemove: string) => {
    setPreviews(prev => {
      const removedPreview = prev.find(p => p.id === idToRemove);
      if (removedPreview?.url.startsWith('blob:')) {
        URL.revokeObjectURL(removedPreview.url);
      }

      const updatedPreviews = prev.filter(p => p.id !== idToRemove);
      pendingUpdateRef.current = updatedPreviews.map(p => p.isExisting ? p.url : p.file!);
      return updatedPreviews;
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize,
    disabled: previews.length >= maxFiles,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}
          ${error || sizeError ? 'border-destructive' : ''}
          ${previews.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-xs text-gray-400">
            Max {maxFiles} files, up to {(maxSize / (1024 * 1024)).toFixed(0)}MB each
          </p>
        </div>
      </div>

      {(error || sizeError) && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <p>{sizeError || error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {previews.map((preview) => (
          <div
            key={preview.id}
            className="relative group aspect-square rounded-lg overflow-hidden border"
          >
            <Image
              src={preview.url}
              alt="Preview"
              fill
              className="object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                removeFile(preview.id);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}