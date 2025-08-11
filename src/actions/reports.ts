'use server'

import { prisma } from '@/lib/prisma'

export async function getTripsByVehicle(startDate?: string, endDate?: string) {
  try {
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

    return { success: true, data: vehicleDetails }
  } catch (error) {
    console.error('Error fetching trips by vehicle:', error)
    return { success: false, error: 'Failed to fetch trips by vehicle' }
  }
}

export async function getTripsByDriver(startDate?: string, endDate?: string) {
  try {
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

    return { success: true, data: driverDetails }
  } catch (error) {
    console.error('Error fetching trips by driver:', error)
    return { success: false, error: 'Failed to fetch trips by driver' }
  }
}

export async function getTripsByClient(startDate?: string, endDate?: string) {
  try {
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

    return { success: true, data: clientDetails }
  } catch (error) {
    console.error('Error fetching trips by client:', error)
    return { success: false, error: 'Failed to fetch trips by client' }
  }
}

export async function getExpensesReport(
  startDate?: string,
  endDate?: string,
  type?: string
) {
  try {
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

    return { success: true, data: summary }
  } catch (error) {
    console.error('Error fetching expenses report:', error)
    return { success: false, error: 'Failed to fetch expenses report' }
  }
}

export async function getFinancialReport(startDate?: string, endDate?: string) {
  try {
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

    return { success: true, data: summary }
  } catch (error) {
    console.error('Error fetching financial report:', error)
    return { success: false, error: 'Failed to fetch financial report' }
  }
}
