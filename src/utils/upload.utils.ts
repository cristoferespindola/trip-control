import { writeFile, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import { randomUUID } from 'crypto'

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
]
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
  filename?: string
}

export async function uploadImage(
  file: File,
  folder: string = 'logos'
): Promise<UploadResult> {
  try {
    // Validar tipo de arquivo
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        success: false,
        error: 'Tipo de arquivo não suportado. Use: JPG, PNG, GIF, WebP ou SVG',
      }
    }

    // Validar tamanho
    if (file.size > MAX_SIZE) {
      return {
        success: false,
        error: 'Arquivo muito grande. Máximo 5MB',
      }
    }

    // Gerar nome único para o arquivo
    const extension = file.name.split('.').pop()
    const filename = `${folder}_${randomUUID()}.${extension}`
    const filepath = join(UPLOAD_DIR, filename)

    // Converter File para Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Salvar arquivo
    await writeFile(filepath, buffer)

    // Retornar URL pública
    const url = `/uploads/${filename}`

    return {
      success: true,
      url,
      filename,
    }
  } catch (error) {
    console.error('Erro no upload:', error)
    return {
      success: false,
      error: 'Erro interno no servidor',
    }
  }
}

export async function deleteImage(url: string): Promise<boolean> {
  try {
    if (!url || !url.startsWith('/uploads/')) {
      return false
    }

    const filename = url.replace('/uploads/', '')
    const filepath = join(UPLOAD_DIR, filename)

    if (existsSync(filepath)) {
      await unlink(filepath)
      return true
    }

    return false
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error)
    return false
  }
}

export async function replaceImage(
  newFile: File,
  oldUrl?: string,
  folder: string = 'logos'
): Promise<UploadResult> {
  try {
    // Fazer upload do novo arquivo
    const uploadResult = await uploadImage(newFile, folder)

    if (!uploadResult.success) {
      return uploadResult
    }

    // Deletar arquivo antigo se existir
    if (oldUrl) {
      await deleteImage(oldUrl)
    }

    return uploadResult
  } catch (error) {
    console.error('Erro ao substituir imagem:', error)
    return {
      success: false,
      error: 'Erro ao substituir imagem',
    }
  }
}
