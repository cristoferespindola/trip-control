'use server'

import { prisma } from '@/lib/prisma'
import { Expense } from '@prisma/client'

export async function getAllExpenses() {
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
        vehicle: true,
        driver: true,
      },
      orderBy: { date: 'desc' },
    })
    return { success: true, data: expenses }
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return { success: false, error: 'Failed to fetch expenses' }
  }
}

export async function getExpenseById(id: string) {
  try {
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
        vehicle: true,
        driver: true,
      },
    })
    return { success: true, data: expense }
  } catch (error) {
    console.error('Error fetching expense:', error)
    return { success: false, error: 'Failed to fetch expense' }
  }
}

export async function createExpense(
  data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>
) {
  try {
    const expense = await prisma.expense.create({
      data,
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
    })
    return { success: true, data: expense }
  } catch (error) {
    console.error('Error creating expense:', error)
    return { success: false, error: 'Failed to create expense' }
  }
}

export async function updateExpense(
  id: string,
  data: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>
) {
  try {
    const expense = await prisma.expense.update({
      where: { id },
      data,
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
    })
    return { success: true, data: expense }
  } catch (error) {
    console.error('Error updating expense:', error)
    return { success: false, error: 'Failed to update expense' }
  }
}

export async function deleteExpense(id: string) {
  try {
    await prisma.expense.delete({
      where: { id },
    })
    return { success: true }
  } catch (error) {
    console.error('Error deleting expense:', error)
    return { success: false, error: 'Failed to delete expense' }
  }
}

export async function countExpenses() {
  try {
    const count = await prisma.expense.count()
    return { success: true, data: count }
  } catch (error) {
    console.error('Error counting expenses:', error)
    return { success: false, error: 'Failed to count expenses' }
  }
}

export async function getExpensesByTrip(tripId: string) {
  try {
    const expenses = await prisma.expense.findMany({
      where: { tripId },
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
    return { success: true, data: expenses }
  } catch (error) {
    console.error('Error fetching expenses by trip:', error)
    return { success: false, error: 'Failed to fetch expenses by trip' }
  }
}

export async function getExpensesByDriver(driverId: string) {
  try {
    const expenses = await prisma.expense.findMany({
      where: { driverId },
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
    return { success: true, data: expenses }
  } catch (error) {
    console.error('Error fetching expenses by driver:', error)
    return { success: false, error: 'Failed to fetch expenses by driver' }
  }
}

export async function getExpensesByVehicle(vehicleId: string) {
  try {
    const expenses = await prisma.expense.findMany({
      where: { vehicleId },
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
    return { success: true, data: expenses }
  } catch (error) {
    console.error('Error fetching expenses by vehicle:', error)
    return { success: false, error: 'Failed to fetch expenses by vehicle' }
  }
}

export async function getExpensesByType(type: string) {
  try {
    const expenses = await prisma.expense.findMany({
      where: { type: type as any },
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
    return { success: true, data: expenses }
  } catch (error) {
    console.error('Error fetching expenses by type:', error)
    return { success: false, error: 'Failed to fetch expenses by type' }
  }
}

export async function getExpensesByDate(startDate: string, endDate: string) {
  try {
    const expenses = await prisma.expense.findMany({
      where: {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
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
    return { success: true, data: expenses }
  } catch (error) {
    console.error('Error fetching expenses by date:', error)
    return { success: false, error: 'Failed to fetch expenses by date' }
  }
}
