import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const whereClause: any = {}

    if (startDate && endDate) {
      whereClause.departureDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    const tripsByClient = await prisma.trip.groupBy({
      by: ['clientId'],
      where: whereClause,
      _count: {
        id: true,
      },
      _sum: {
        tripValue: true,
      },
    })

    const clientDetails = await Promise.all(
      tripsByClient.map(async trip => {
        const client = await prisma.client.findUnique({
          where: { id: trip.clientId },
        })

        const trips = await prisma.trip.findMany({
          where: { clientId: trip.clientId, ...whereClause },
          include: {
            vehicle: true,
            driver: true,
            expenses: true,
          },
          orderBy: { departureDate: 'desc' },
        })

        const totalExpenses = trips.reduce((sum, trip) => {
          return (
            sum +
            trip.expenses.reduce(
              (expenseSum, expense) => expenseSum + expense.value,
              0
            )
          )
        }, 0)

        const totalValue = trip._sum.tripValue || 0
        const finalValue = totalValue - totalExpenses

        return {
          clientId: trip.clientId,
          client: client,
          tripCount: trip._count.id,
          totalValue,
          totalExpenses,
          finalValue,
          trips,
        }
      })
    )

    return NextResponse.json(clientDetails)
  } catch (error) {
    console.error('Error fetching trips by client:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trips by client' },
      { status: 500 }
    )
  }
}
