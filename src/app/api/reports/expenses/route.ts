import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const type = searchParams.get('type')

    const whereClause: any = {}

    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    if (type) {
      whereClause.type = type
    }

    const expenses = await prisma.expense.findMany({
      where: whereClause,
      include: {
        trip: {
          include: {
            vehicle: true,
            driver: true,
            client: true,
          },
        },
        vehicle: true,
        driver: true,
      },
      orderBy: { date: 'desc' },
    })

    const expensesByType = await prisma.expense.groupBy({
      by: ['type'],
      where: whereClause,
      _count: {
        id: true,
      },
      _sum: {
        value: true,
      },
    })

    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.value,
      0
    )

    const summary = {
      totalExpenses,
      expenseCount: expenses.length,
      expensesByType: expensesByType.map(item => ({
        type: item.type,
        count: item._count.id,
        total: item._sum.value || 0,
      })),
      expenses,
    }

    return NextResponse.json(summary)
  } catch (error) {
    console.error('Error fetching expenses report:', error)
    return NextResponse.json(
      { error: 'Failed to fetch expenses report' },
      { status: 500 }
    )
  }
}
