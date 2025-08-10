import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        vehicle: true,
        driver: true,
        client: true
      }
    })
    
    if (!trip) {
      return NextResponse.json(
        { error: 'Viagem não encontrada' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(trip)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar viagem' },
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
    
    const trip = await prisma.trip.update({
      where: { id },
      data: {
        origin: body.origin,
        destination: body.destination,
        departureDate: new Date(body.departureDate),
        returnDate: body.returnDate ? new Date(body.returnDate) : null,
        distance: body.distance ? parseFloat(body.distance) : null,
        fuelCost: body.fuelCost ? parseFloat(body.fuelCost) : null,
        tollCost: body.tollCost ? parseFloat(body.tollCost) : null,
        otherCosts: body.otherCosts ? parseFloat(body.otherCosts) : null,
        totalCost: body.totalCost ? parseFloat(body.totalCost) : null,
        status: body.status,
        notes: body.notes,
        vehicleId: body.vehicleId,
        driverId: body.driverId,
        clientId: body.clientId
      },
      include: {
        vehicle: true,
        driver: true,
        client: true
      }
    })
    
    return NextResponse.json(trip)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Viagem não encontrada' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erro ao atualizar viagem' },
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
    await prisma.trip.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Viagem deletada com sucesso' })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Viagem não encontrada' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erro ao deletar viagem' },
      { status: 500 }
    )
  }
} 