import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(vehicles)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar veículos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const vehicle = await prisma.vehicle.create({
      data: {
        plate: body.plate,
        model: body.model,
        brand: body.brand,
        year: parseInt(body.year),
        capacity: parseInt(body.capacity),
        status: body.status || 'ACTIVE'
      }
    })
    
    return NextResponse.json(vehicle, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Placa já cadastrada' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erro ao criar veículo' },
      { status: 500 }
    )
  }
} 