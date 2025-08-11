'use server'

import { prisma } from '@/lib/prisma'
import { Vehicle } from '@prisma/client'

export async function getAllVehicles() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { plate: 'asc' },
    })
    return { success: true, data: vehicles }
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return { success: false, error: 'Failed to fetch vehicles' }
  }
}

export async function getVehicleById(id: string) {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    })
    return { success: true, data: vehicle }
  } catch (error) {
    console.error('Error fetching vehicle:', error)
    return { success: false, error: 'Failed to fetch vehicle' }
  }
}

export async function createVehicle(
  data: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>
) {
  try {
    const vehicle = await prisma.vehicle.create({
      data,
    })
    return { success: true, data: vehicle }
  } catch (error) {
    console.error('Error creating vehicle:', error)
    return { success: false, error: 'Failed to create vehicle' }
  }
}

export async function updateVehicle(
  id: string,
  data: Partial<Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>>
) {
  try {
    const vehicle = await prisma.vehicle.update({
      where: { id },
      data,
    })
    return { success: true, data: vehicle }
  } catch (error) {
    console.error('Error updating vehicle:', error)
    return { success: false, error: 'Failed to update vehicle' }
  }
}

export async function deleteVehicle(id: string) {
  try {
    await prisma.vehicle.delete({
      where: { id },
    })
    return { success: true }
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    return { success: false, error: 'Failed to delete vehicle' }
  }
}

export async function countVehicles(): Promise<number> {
  try {
    const count = await prisma.vehicle.count()
    return count
  } catch (error) {
    console.error('Error counting vehicles:', error)
    return 0
  }
}
