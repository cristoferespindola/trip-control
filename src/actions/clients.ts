'use server'

import { prisma } from '@/lib/prisma'
import { Client } from '@prisma/client'

export async function getAllClients() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { name: 'asc' },
    })
    return { success: true, data: clients }
  } catch (error) {
    console.error('Error fetching clients:', error)
    return { success: false, error: 'Failed to fetch clients' }
  }
}

export async function getClientById(id: string) {
  try {
    const client = await prisma.client.findUnique({
      where: { id },
    })
    return { success: true, data: client }
  } catch (error) {
    console.error('Error fetching client:', error)
    return { success: false, error: 'Failed to fetch client' }
  }
}

export async function createClient(
  data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>
) {
  try {
    const client = await prisma.client.create({
      data,
    })
    return { success: true, data: client }
  } catch (error) {
    console.error('Error creating client:', error)
    return { success: false, error: 'Failed to create client' }
  }
}

export async function updateClient(
  id: string,
  data: Partial<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>
) {
  try {
    const client = await prisma.client.update({
      where: { id },
      data,
    })
    return { success: true, data: client }
  } catch (error) {
    console.error('Error updating client:', error)
    return { success: false, error: 'Failed to update client' }
  }
}

export async function deleteClient(id: string) {
  try {
    await prisma.client.delete({
      where: { id },
    })
    return { success: true }
  } catch (error) {
    console.error('Error deleting client:', error)
    return { success: false, error: 'Failed to delete client' }
  }
}

export async function countClients() {
  try {
    const count = await prisma.client.count()
    return { success: true, data: count }
  } catch (error) {
    console.error('Error counting clients:', error)
    return { success: false, error: 'Failed to count clients' }
  }
}
