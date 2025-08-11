'use server'

import { prisma } from '@/lib/prisma'
import { User } from '@prisma/client'
import bcrypt from 'bcryptjs'

export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    return { success: true, data: users }
  } catch (error) {
    console.error('Error fetching users:', error)
    return { success: false, error: 'Failed to fetch users' }
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    return { success: true, data: user }
  } catch (error) {
    console.error('Error fetching user:', error)
    return { success: false, error: 'Failed to fetch user' }
  }
}

export async function createUser(
  data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
) {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    return { success: true, data: user }
  } catch (error) {
    console.error('Error creating user:', error)
    return { success: false, error: 'Failed to create user' }
  }
}

export async function updateUser(
  id: string,
  data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>
) {
  try {
    const updateData: any = { ...data }

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10)
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    return { success: true, data: user }
  } catch (error) {
    console.error('Error updating user:', error)
    return { success: false, error: 'Failed to update user' }
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { id },
    })
    return { success: true }
  } catch (error) {
    console.error('Error deleting user:', error)
    return { success: false, error: 'Failed to delete user' }
  }
}

export async function countUsers() {
  try {
    const count = await prisma.user.count()
    return { success: true, data: count }
  } catch (error) {
    console.error('Error counting users:', error)
    return { success: false, error: 'Failed to count users' }
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })
    return { success: true, data: user }
  } catch (error) {
    console.error('Error fetching user by email:', error)
    return { success: false, error: 'Failed to fetch user by email' }
  }
}

export async function verifyPassword(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      return { success: false, error: 'Invalid password' }
    }

    return {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  } catch (error) {
    console.error('Error verifying password:', error)
    return { success: false, error: 'Failed to verify password' }
  }
}
