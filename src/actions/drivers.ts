'use server'

import { prisma } from '@/lib/prisma'
import { Driver } from '@prisma/client'

export async function getAllDrivers() {
  try {
    const drivers = await prisma.driver.findMany({
      orderBy: { name: 'asc' },
    })
    return { success: true, data: drivers }
  } catch (error) {
    console.error('Error fetching drivers:', error)
    return { success: false, error: 'Failed to fetch drivers' }
  }
}

export async function getDriverById(id: string) {
  try {
    const driver = await prisma.driver.findUnique({
      where: { id },
    })
    return { success: true, data: driver }
  } catch (error) {
    console.error('Error fetching driver:', error)
    return { success: false, error: 'Failed to fetch driver' }
  }
}

export async function createDriver(
  data: Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>
) {
  try {
    const driver = await prisma.driver.create({
      data,
    })
    return { success: true, data: driver }
  } catch (error) {
    console.error('Error creating driver:', error)
    return { success: false, error: 'Failed to create driver' }
  }
}

export async function updateDriver(
  id: string,
  data: Partial<Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>>
) {
  try {
    const driver = await prisma.driver.update({
      where: { id },
      data,
    })
    return { success: true, data: driver }
  } catch (error) {
    console.error('Error updating driver:', error)
    return { success: false, error: 'Failed to update driver' }
  }
}

export async function deleteDriver(id: string) {
  try {
    await prisma.driver.delete({
      where: { id },
    })
    return { success: true }
  } catch (error) {
    console.error('Error deleting driver:', error)
    return { success: false, error: 'Failed to delete driver' }
  }
}

export async function countDrivers() {
  try {
    const count = await prisma.driver.count()
    return { success: true, data: count }
  } catch (error) {
    console.error('Error counting drivers:', error)
    return { success: false, error: 'Failed to count drivers' }
  }
}
