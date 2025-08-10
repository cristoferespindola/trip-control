import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      include: {
        trip: {
          include: {
            vehicle: true,
            driver: true,
            client: true,
          },
        },
        driver: true,
        vehicle: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(expenses)
  } catch (error: unknown) {
    console.error('Erro ao buscar despesas:', error)
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
    const { name, value, date, type, notes, tripId, driverId, vehicleId } = body

    if (
      !name ||
      !value ||
      !date ||
      !type ||
      !tripId ||
      !driverId ||
      !vehicleId
    ) {
      return NextResponse.json(
        { message: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      )
    }

    const tripExists = await prisma.trip.findUnique({
      where: { id: tripId },
    })

    if (!tripExists) {
      return NextResponse.json(
        { message: 'Viagem não encontrada' },
        { status: 400 }
      )
    }

    const driverExists = await prisma.driver.findUnique({
      where: { id: driverId },
    })

    if (!driverExists) {
      return NextResponse.json(
        { message: 'Motorista não encontrado' },
        { status: 400 }
      )
    }

    const vehicleExists = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    })

    if (!vehicleExists) {
      return NextResponse.json(
        { message: 'Veículo não encontrado' },
        { status: 400 }
      )
    }

    const expense = await prisma.expense.create({
      data: {
        name,
        value: parseFloat(value),
        date: new Date(date),
        type,
        notes,
        tripId,
        driverId,
        vehicleId,
      },
      include: {
        trip: {
          include: {
            vehicle: true,
            driver: true,
            client: true,
          },
        },
        driver: true,
        vehicle: true,
      },
    })

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar despesa:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
