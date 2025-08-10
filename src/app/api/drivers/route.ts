import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const drivers = await prisma.driver.findMany({
      orderBy: {
        createdAt: 'desc'
      }
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
    
    const driver = await prisma.driver.create({
      data: {
        name: body.name,
        cpf: body.cpf,
        cnh: body.cnh,
        phone: body.phone,
        email: body.email,
        address: body.address,
        status: body.status || 'ACTIVE'
      }
    })
    
    return NextResponse.json(driver, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'CPF ou CNH já cadastrado' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erro ao criar motorista' },
      { status: 500 }
    )
  }
} 