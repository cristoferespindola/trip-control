import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        vehicle: true,
        driver: true,
        client: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(trips)
  } catch (error) {
    console.error('Erro ao buscar viagens:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      origin,
      destination,
      departureDate,
      returnDate,
      distance,
      fuelCost,
      tollCost,
      otherCosts,
      totalCost,
      status,
      notes,
      vehicleId,
      driverId,
      clientId,
      userId,
    } = await request.json()

    if (
      !origin ||
      !destination ||
      !departureDate ||
      !vehicleId ||
      !driverId ||
      !clientId ||
      !userId
    ) {
      return NextResponse.json(
        { message: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      )
    }

    const trip = await prisma.trip.create({
      data: {
        origin,
        destination,
        departureDate: new Date(departureDate),
        returnDate: returnDate ? new Date(returnDate) : null,
        distance: distance ? parseFloat(distance) : null,
        fuelCost: fuelCost ? parseFloat(fuelCost) : null,
        tollCost: tollCost ? parseFloat(tollCost) : null,
        otherCosts: otherCosts ? parseFloat(otherCosts) : null,
        totalCost: totalCost ? parseFloat(totalCost) : null,
        status: status || 'SCHEDULED',
        notes,
        vehicleId,
        driverId,
        clientId,
        userId,
      },
      include: {
        vehicle: true,
        driver: true,
        client: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    })

    return NextResponse.json(trip, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar viagem:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
