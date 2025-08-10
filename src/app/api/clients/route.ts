import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(clients)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar clientes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const client = await prisma.client.create({
      data: {
        name: body.name,
        cpf: body.cpf,
        cnpj: body.cnpj,
        phone: body.phone,
        email: body.email,
        address: body.address,
        status: body.status || 'ACTIVE'
      }
    })
    
    return NextResponse.json(client, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'CPF ou CNPJ já cadastrado' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erro ao criar cliente' },
      { status: 500 }
    )
  }
} 