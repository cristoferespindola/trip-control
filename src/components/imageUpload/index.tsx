'use client'

import { useState, useRef } from 'react'
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface ImageUploadProps {
  currentUrl?: string
  onUpload: (url: string) => void
  onError: (error: string) => void
  label: string
  folder?: string
  className?: string
}

export default function ImageUpload({
  currentUrl,
  onUpload,
  onError,
  label,
  folder = 'logos',
  className = '',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentUrl || null
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ]
    if (!allowedTypes.includes(file.type)) {
      onError('Tipo de arquivo não suportado. Use: JPG, PNG, GIF, WebP ou SVG')
      return
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      onError('Arquivo muito grande. Máximo 5MB')
      return
    }

    // Criar preview
    const reader = new FileReader()
    reader.onload = e => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Fazer upload
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('oldUrl', currentUrl || '')
      formData.append('folder', folder)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        onUpload(result.url)
        setPreviewUrl(result.url)
      } else {
        onError(result.error || 'Erro no upload')
        setPreviewUrl(currentUrl || null)
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      onError('Erro interno no servidor')
      setPreviewUrl(currentUrl || null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreviewUrl(null)
    onUpload('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <div className="flex items-center space-x-4">
        {/* Preview da imagem */}
        {previewUrl && (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="h-20 w-20 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Área de upload */}
        <div
          onClick={handleClick}
          className={`flex flex-col items-center justify-center h-20 w-20 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isUploading
              ? 'border-orange-300 bg-orange-50'
              : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
          }`}
        >
          {isUploading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
          ) : (
            <PhotoIcon className="h-6 w-6 text-gray-400" />
          )}
          <span className="text-xs text-gray-500 mt-1">
            {isUploading ? 'Enviando...' : 'Upload'}
          </span>
        </div>

        {/* Input file oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
      </div>

      {/* Informações */}
      <div className="text-xs text-gray-500">
        <p>Formatos aceitos: JPG, PNG, GIF, WebP, SVG</p>
        <p>Tamanho máximo: 5MB</p>
        {currentUrl && (
          <p className="text-orange-600">⚠️ A imagem atual será substituída</p>
        )}
      </div>
    </div>
  )
}
