'use server'

import { prisma } from '@/lib/prisma'
import { Trip } from '@prisma/client'

export async function getAllTrips() {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        vehicle: true,
        driver: true,
        client: true,
        user: true,
        expenses: true,
      },
      orderBy: { departureDate: 'desc' },
    })
    return { success: true, data: trips }
  } catch (error) {
    console.error('Error fetching trips:', error)
    return { success: false, error: 'Failed to fetch trips' }
  }
}

export async function getTripById(id: string) {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        vehicle: true,
        driver: true,
        client: true,
        user: true,
        expenses: true,
      },
    })
    return { success: true, data: trip }
  } catch (error) {
    console.error('Error fetching trip:', error)
    return { success: false, error: 'Failed to fetch trip' }
  }
}

export async function createTrip(
  data: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>
) {
  try {
    const trip = await prisma.trip.create({
      data,
      include: {
        vehicle: true,
        driver: true,
        client: true,
        user: true,
        expenses: true,
      },
    })
    return { success: true, data: trip }
  } catch (error) {
    console.error('Error creating trip:', error)
    return { success: false, error: 'Failed to create trip' }
  }
}

export async function updateTrip(
  id: string,
  data: Partial<Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>>
) {
  try {
    const trip = await prisma.trip.update({
      where: { id },
      data,
      include: {
        vehicle: true,
        driver: true,
        client: true,
        user: true,
        expenses: true,
      },
    })
    return { success: true, data: trip }
  } catch (error) {
    console.error('Error updating trip:', error)
    return { success: false, error: 'Failed to update trip' }
  }
}

export async function deleteTrip(id: string) {
  try {
    await prisma.trip.delete({
      where: { id },
    })
    return { success: true }
  } catch (error) {
    console.error('Error deleting trip:', error)
    return { success: false, error: 'Failed to delete trip' }
  }
}

export async function countTrips() {
  try {
    const count = await prisma.trip.count()
    return { success: true, data: count }
  } catch (error) {
    console.error('Error counting trips:', error)
    return { success: false, error: 'Failed to count trips' }
  }
}

export async function getTripsByDriver(driverId: string) {
  try {
    const trips = await prisma.trip.findMany({
      where: { driverId },
      include: {
        vehicle: true,
        client: true,
        user: true,
        expenses: true,
      },
      orderBy: { departureDate: 'desc' },
    })
    return { success: true, data: trips }
  } catch (error) {
    console.error('Error fetching trips by driver:', error)
    return { success: false, error: 'Failed to fetch trips by driver' }
  }
}

export async function getTripsByVehicle(vehicleId: string) {
  try {
    const trips = await prisma.trip.findMany({
      where: { vehicleId },
      include: {
        driver: true,
        client: true,
        user: true,
        expenses: true,
      },
      orderBy: { departureDate: 'desc' },
    })
    return { success: true, data: trips }
  } catch (error) {
    console.error('Error fetching trips by vehicle:', error)
    return { success: false, error: 'Failed to fetch trips by vehicle' }
  }
}

export async function getTripsByClient(clientId: string) {
  try {
    const trips = await prisma.trip.findMany({
      where: { clientId },
      include: {
        vehicle: true,
        driver: true,
        user: true,
        expenses: true,
      },
      orderBy: { departureDate: 'desc' },
    })
    return { success: true, data: trips }
  } catch (error) {
    console.error('Error fetching trips by client:', error)
    return { success: false, error: 'Failed to fetch trips by client' }
  }
}

export async function getTripsByStatus(status: string) {
  try {
    const trips = await prisma.trip.findMany({
      where: { status: status as any },
      include: {
        vehicle: true,
        driver: true,
        client: true,
        user: true,
        expenses: true,
      },
      orderBy: { departureDate: 'desc' },
    })
    return { success: true, data: trips }
  } catch (error) {
    console.error('Error fetching trips by status:', error)
    return { success: false, error: 'Failed to fetch trips by status' }
  }
}

export async function getTripsByDate(startDate: string, endDate: string) {
  try {
    const trips = await prisma.trip.findMany({
      where: {
        departureDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        vehicle: true,
        driver: true,
        client: true,
        user: true,
        expenses: true,
      },
      orderBy: { departureDate: 'desc' },
    })
    return { success: true, data: trips }
  } catch (error) {
    console.error('Error fetching trips by date:', error)
    return { success: false, error: 'Failed to fetch trips by date' }
  }
}
