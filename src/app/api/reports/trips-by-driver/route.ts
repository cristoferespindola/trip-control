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

    const tripsByDriver = await prisma.trip.groupBy({
      by: ['driverId'],
      where: whereClause,
      _count: {
        id: true,
      },
      _sum: {
        tripValue: true,
      },
    })

    const driverDetails = await Promise.all(
      tripsByDriver.map(async trip => {
        const driver = await prisma.driver.findUnique({
          where: { id: trip.driverId },
        })

        const trips = await prisma.trip.findMany({
          where: { driverId: trip.driverId, ...whereClause },
          include: {
            vehicle: true,
            client: true,
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
          driverId: trip.driverId,
          driver: driver,
          tripCount: trip._count.id,
          totalValue,
          totalExpenses,
          finalValue,
          trips,
        }
      })
    )

    return NextResponse.json(driverDetails)
  } catch (error) {
    console.error('Error fetching trips by driver:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trips by driver' },
      { status: 500 }
    )
  }
}
