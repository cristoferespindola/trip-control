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

    if (!trip) {
      return NextResponse.json(
        { message: 'Viagem não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(trip)
  } catch (error) {
    console.error('Erro ao buscar viagem:', error)
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
    const {
      origin,
      destination,
      departureDate,
      returnDate,
      initialKilometer,
      finalKilometer,
      tripValue,
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

    const trip = await prisma.trip.update({
      where: { id },
      data: {
        origin,
        destination,
        departureDate: new Date(departureDate),
        returnDate: returnDate ? new Date(returnDate) : null,
        initialKilometer: initialKilometer ? parseInt(initialKilometer) : null,
        finalKilometer: finalKilometer ? parseInt(finalKilometer) : null,
        tripValue: tripValue ? parseFloat(tripValue) : null,
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

    return NextResponse.json(trip)
  } catch (error) {
    console.error('Erro ao atualizar viagem:', error)
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

    await prisma.trip.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Viagem excluída com sucesso' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao excluir viagem:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
