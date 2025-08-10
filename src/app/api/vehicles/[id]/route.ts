import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const vehicle = await prisma.vehicle.findUnique({
      where: { id }
    })
    
    if (!vehicle) {
      return NextResponse.json(
        { error: 'Veículo não encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(vehicle)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar veículo' },
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
    
    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        plate: body.plate,
        model: body.model,
        brand: body.brand,
        year: parseInt(body.year),
        capacity: parseInt(body.capacity),
        status: body.status
      }
    })
    
    return NextResponse.json(vehicle)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Veículo não encontrado' },
        { status: 404 }
      )
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Placa já cadastrada' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erro ao atualizar veículo' },
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
    await prisma.vehicle.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Veículo deletado com sucesso' })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Veículo não encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erro ao deletar veículo' },
      { status: 500 }
    )
  }
} 