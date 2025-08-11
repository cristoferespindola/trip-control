import { NextRequest, NextResponse } from 'next/server'
import { replaceImage } from '@/utils/upload.utils'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const oldUrl = formData.get('oldUrl') as string
    const folder = (formData.get('folder') as string) || 'logos'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Nenhum arquivo enviado' },
        { status: 400 }
      )
    }

    // Fazer upload/substituição da imagem
    const result = await replaceImage(file, oldUrl, folder)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      filename: result.filename,
    })
  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
