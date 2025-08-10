import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const expense = await prisma.expense.findUnique({
      where: { id },
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

    if (!expense) {
      return NextResponse.json(
        { message: 'Despesa não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(expense)
  } catch (error) {
    console.error('Erro ao buscar despesa:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
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

    const existingExpense = await prisma.expense.findUnique({
      where: { id },
    })

    if (!existingExpense) {
      return NextResponse.json(
        { message: 'Despesa não encontrada' },
        { status: 404 }
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

    const expense = await prisma.expense.update({
      where: { id },
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

    return NextResponse.json(expense)
  } catch (error) {
    console.error('Erro ao atualizar despesa:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
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
    const existingExpense = await prisma.expense.findUnique({
      where: { id },
    })

    if (!existingExpense) {
      return NextResponse.json(
        { message: 'Despesa não encontrada' },
        { status: 404 }
      )
    }

    await prisma.expense.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Despesa excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir despesa:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
