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
  } catch (error: unknown) {
    console.error('Erro ao buscar viagens:', error)

    if (
      error instanceof Error &&
      (error.message.includes('P2021') || error.message.includes('P2024'))
    ) {
      return NextResponse.json([])
    }

    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received trip data:', body)

    const {
      origin,
      destination,
      departureDate,
      returnDate,
      finalKilometer,
      initialKilometer,
      status,
      notes,
      vehicleId,
      driverId,
      clientId,
      userId,
    } = body

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

    // Verificar se o usuário existe
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!userExists) {
      console.log('User not found with ID:', userId)
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 400 }
      )
    }

    console.log('User found:', userExists)

    const trip = await prisma.trip.create({
      data: {
        origin,
        destination,
        departureDate: new Date(departureDate),
        returnDate: returnDate ? new Date(returnDate) : null,
        initialKilometer: initialKilometer ? parseInt(initialKilometer) : null,
        finalKilometer: finalKilometer ? parseInt(finalKilometer) : null,
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
