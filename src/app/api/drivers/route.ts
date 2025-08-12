import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const drivers = await prisma.driver.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(drivers)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar motoristas' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('Creating driver with data:', body)

    // Validação básica
    if (!body.name || !body.cpf || !body.cnh || !body.phone) {
      return NextResponse.json(
        { error: 'Nome, CPF, CNH e telefone são obrigatórios' },
        { status: 400 }
      )
    }

    const driver = await prisma.driver.create({
      data: {
        name: body.name,
        cpf: body.cpf,
        cnh: body.cnh,
        phone: body.phone,
        email: body.email || null,
        address: body.address || null,
        status: body.status || 'ACTIVE',
      },
    })

    console.log('Driver created successfully:', driver.id)
    return NextResponse.json(driver, { status: 201 })
  } catch (error: any) {
    console.error('Error creating driver:', error)

    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'campo'
      return NextResponse.json(
        { error: `${field} já cadastrado` },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: 'Erro ao criar motorista',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
