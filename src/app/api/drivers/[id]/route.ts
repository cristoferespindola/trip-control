import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const driver = await prisma.driver.findUnique({
      where: { id },
    })

    if (!driver) {
      return NextResponse.json(
        { error: 'Motorista não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(driver)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar motorista' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const driver = await prisma.driver.update({
      where: { id },
      data: {
        name: body.name,
        cpf: body.cpf,
        cnh: body.cnh,
        phone: body.phone,
        email: body.email,
        address: body.address,
        status: body.status,
      },
    })

    return NextResponse.json(driver)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Motorista não encontrado' },
        { status: 404 }
      )
    }

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'CPF ou CNH já cadastrado' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao atualizar motorista' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.driver.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Motorista deletado com sucesso' })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Motorista não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao deletar motorista' },
      { status: 500 }
    )
  }
}
