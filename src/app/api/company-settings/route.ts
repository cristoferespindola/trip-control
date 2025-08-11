import { NextRequest, NextResponse } from 'next/server'
import {
  getCompanySettings,
  updateCompanySettings,
} from '@/actions/companySettings'

export async function GET() {
  try {
    const settings = await getCompanySettings()

    if (!settings) {
      return NextResponse.json(
        { message: 'Configurações não encontradas' },
        { status: 404 }
      )
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Erro ao buscar configurações:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const settings = await updateCompanySettings(body)

    if (!settings) {
      return NextResponse.json(
        { message: 'Erro ao atualizar configurações' },
        { status: 500 }
      )
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
