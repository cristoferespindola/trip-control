import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Applying migrations manually...')

    // Check if User table exists
    try {
      await prisma.$queryRaw`SELECT 1 FROM "User" LIMIT 1`
      console.log('✅ User table exists')
    } catch (error) {
      console.log('👥 Creating User table...')

      // Create UserRole enum
      await prisma.$executeRaw`CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER')`
      console.log('✅ UserRole enum created')

      // Create UserStatus enum
      await prisma.$executeRaw`CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE')`
      console.log('✅ UserStatus enum created')

      // Create User table
      await prisma.$executeRaw`
        CREATE TABLE "User" (
          "id" TEXT NOT NULL,
          "username" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "password" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "role" "UserRole" NOT NULL DEFAULT 'USER',
          "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
          "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
          CONSTRAINT "User_pkey" PRIMARY KEY ("id")
        )
      `
      console.log('✅ User table created')
    }

    console.log('🎉 Migration completed successfully!')

    return NextResponse.json(
      {
        success: true,
        message: 'Migration completed successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Error applying migration:', error)

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to apply migration',
        error: errorMessage,
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET() {
  try {
    console.log('🔍 Checking User table...')

    // Check if User table exists
    const userExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'User'
      )
    `

    console.log('📊 User table exists:', userExists)

    return NextResponse.json(
      {
        success: true,
        userTableExists: userExists,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Error checking User table:', error)

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to check User table',
        error: errorMessage,
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
