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
        expenses: {
          include: {
            driver: true,
            vehicle: true,
          },
          orderBy: {
            date: 'desc',
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
    console.error('Erro ao buscar viagem com despesas:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
