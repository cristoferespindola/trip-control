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

    const trips = await prisma.trip.findMany({
      where: whereClause,
      include: {
        vehicle: true,
        driver: true,
        client: true,
        expenses: true,
      },
      orderBy: { departureDate: 'desc' },
    })

    const expenses = await prisma.expense.findMany({
      where: {
        date:
          startDate && endDate
            ? {
                gte: new Date(startDate),
                lte: new Date(endDate),
              }
            : undefined,
      },
    })

    const totalRevenue = trips.reduce(
      (sum, trip) => sum + (trip.tripValue || 0),
      0
    )
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.value,
      0
    )
    const netProfit = totalRevenue - totalExpenses

    const tripsByStatus = await prisma.trip.groupBy({
      by: ['status'],
      where: whereClause,
      _count: {
        id: true,
      },
      _sum: {
        tripValue: true,
      },
    })

    const expensesByType = await prisma.expense.groupBy({
      by: ['type'],
      where: {
        date:
          startDate && endDate
            ? {
                gte: new Date(startDate),
                lte: new Date(endDate),
              }
            : undefined,
      },
      _count: {
        id: true,
      },
      _sum: {
        value: true,
      },
    })

    const summary = {
      period: {
        startDate,
        endDate,
      },
      overview: {
        totalTrips: trips.length,
        totalRevenue,
        totalExpenses,
        netProfit,
        profitMargin: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0,
      },
      tripsByStatus: tripsByStatus.map(item => ({
        status: item.status,
        count: item._count.id,
        revenue: item._sum.tripValue || 0,
      })),
      expensesByType: expensesByType.map(item => ({
        type: item.type,
        count: item._count.id,
        total: item._sum.value || 0,
      })),
      trips,
      expenses,
    }

    return NextResponse.json(summary)
  } catch (error) {
    console.error('Error fetching financial report:', error)
    return NextResponse.json(
      { error: 'Failed to fetch financial report' },
      { status: 500 }
    )
  }
}
