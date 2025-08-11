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

    const tripsByVehicle = await prisma.trip.groupBy({
      by: ['vehicleId'],
      where: whereClause,
      _count: {
        id: true,
      },
      _sum: {
        tripValue: true,
      },
    })

    const vehicleDetails = await Promise.all(
      tripsByVehicle.map(async trip => {
        const vehicle = await prisma.vehicle.findUnique({
          where: { id: trip.vehicleId },
        })

        const trips = await prisma.trip.findMany({
          where: { vehicleId: trip.vehicleId, ...whereClause },
          include: {
            driver: true,
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
          vehicleId: trip.vehicleId,
          vehicle: vehicle,
          tripCount: trip._count.id,
          totalValue,
          totalExpenses,
          finalValue,
          trips,
        }
      })
    )

    return NextResponse.json(vehicleDetails)
  } catch (error) {
    console.error('Error fetching trips by vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trips by vehicle' },
      { status: 500 }
    )
  }
}
