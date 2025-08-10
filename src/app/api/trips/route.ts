import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        vehicle: true,
        driver: true,
        client: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(trips)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar viagens' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const trip = await prisma.trip.create({
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
        status: body.status || 'SCHEDULED',
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
    
    return NextResponse.json(trip, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Erro ao criar viagem' },
      { status: 500 }
    )
  }
} 