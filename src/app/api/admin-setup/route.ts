import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Manual admin setup requested...')

    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'admin' },
    })

    if (existingAdmin) {
      return NextResponse.json(
        {
          success: true,
          message: 'Admin user already exists',
          user: {
            id: existingAdmin.id,
            username: existingAdmin.username,
            email: existingAdmin.email,
          },
        },
        { status: 200 }
      )
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin', 10)

    const adminUser = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@tripcontrol.com',
        name: 'Administrator',
        password: hashedPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    })

    console.log('✅ Admin user created successfully via API')

    return NextResponse.json(
      {
        success: true,
        message: 'Admin user created successfully',
        user: {
          id: adminUser.id,
          username: adminUser.username,
          email: adminUser.email,
        },
        credentials: {
          username: 'admin',
          password: 'admin',
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create admin user',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET() {
  try {
    const adminUser = await prisma.user.findUnique({
      where: { username: 'admin' },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        adminExists: !!adminUser,
        user: adminUser,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Error checking admin user:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to check admin user',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
