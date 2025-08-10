import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Applying migrations manually...')

    // Check if migrations table exists
    try {
      await prisma.$queryRaw`SELECT 1 FROM _prisma_migrations LIMIT 1`
      console.log('✅ Migrations table exists')
    } catch (error) {
      console.log('📋 Creating migrations table...')
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS _prisma_migrations (
          id VARCHAR(36) PRIMARY KEY NOT NULL,
          checksum VARCHAR(64) NOT NULL,
          finished_at TIMESTAMPTZ,
          migration_name VARCHAR(255) NOT NULL,
          logs TEXT,
          rolled_back_at TIMESTAMPTZ,
          started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          applied_steps_count INTEGER NOT NULL DEFAULT 0
        )
      `
    }

    // Apply initial migration (create tables)
    const initialMigrationId = '20250806172829_init'
    const existingInitial = await prisma.$queryRaw`
      SELECT id FROM _prisma_migrations WHERE id = ${initialMigrationId}
    `

    if (!existingInitial || (existingInitial as any[]).length === 0) {
      console.log('🚀 Applying initial migration...')

      // Create all tables
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "Vehicle" (
          "id" TEXT NOT NULL,
          "plate" TEXT NOT NULL,
          "model" TEXT NOT NULL,
          "brand" TEXT NOT NULL,
          "year" INTEGER NOT NULL,
          "capacity" INTEGER NOT NULL,
          "status" TEXT NOT NULL DEFAULT 'ACTIVE',
          "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
          CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
        )
      `

      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "Driver" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "cpf" TEXT NOT NULL,
          "cnh" TEXT NOT NULL,
          "phone" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "address" TEXT NOT NULL,
          "status" TEXT NOT NULL DEFAULT 'ACTIVE',
          "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
          CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
        )
      `

      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "Client" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "cnpj" TEXT NOT NULL,
          "phone" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "address" TEXT NOT NULL,
          "status" TEXT NOT NULL DEFAULT 'ACTIVE',
          "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
          CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
        )
      `

      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "Trip" (
          "id" TEXT NOT NULL,
          "vehicleId" TEXT NOT NULL,
          "driverId" TEXT NOT NULL,
          "clientId" TEXT NOT NULL,
          "origin" TEXT NOT NULL,
          "destination" TEXT NOT NULL,
          "departureDate" TIMESTAMPTZ NOT NULL,
          "returnDate" TIMESTAMPTZ,
          "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
          "notes" TEXT,
          "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
          CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
        )
      `

      // Record the migration
      await prisma.$executeRaw`
        INSERT INTO _prisma_migrations (id, checksum, migration_name, started_at, applied_steps_count)
        VALUES (${initialMigrationId}, 'initial_migration', 'init', now(), 1)
      `

      console.log('✅ Initial migration applied')
    }

    // Apply users migration
    const usersMigrationId = '20250810144115_add_users'
    const existingUsers = await prisma.$queryRaw`
      SELECT id FROM _prisma_migrations WHERE id = ${usersMigrationId}
    `

    if (!existingUsers || (existingUsers as any[]).length === 0) {
      console.log('👥 Applying users migration...')

      // Create UserRole enum
      await prisma.$executeRaw`
        CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER')
      `

      // Create UserStatus enum
      await prisma.$executeRaw`
        CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE')
      `

      // Create User table
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "User" (
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

      // Add userId to Trip table
      await prisma.$executeRaw`
        ALTER TABLE "Trip" ADD COLUMN IF NOT EXISTS "userId" TEXT
      `

      // Add foreign key constraint
      await prisma.$executeRaw`
        ALTER TABLE "Trip" ADD CONSTRAINT "Trip_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
      `

      // Record the migration
      await prisma.$executeRaw`
        INSERT INTO _prisma_migrations (id, checksum, migration_name, started_at, applied_steps_count)
        VALUES (${usersMigrationId}, 'users_migration', 'add_users', now(), 1)
      `

      console.log('✅ Users migration applied')
    }

    console.log('🎉 All migrations applied successfully!')

    return NextResponse.json(
      {
        success: true,
        message: 'Migrations applied successfully',
        migrations: [
          { id: initialMigrationId, applied: true },
          { id: usersMigrationId, applied: true },
        ],
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Error applying migrations:', error)

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to apply migrations',
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
    console.log('🔍 Checking migration status...')

    // Check current migration status
    const migrations = await prisma.$queryRaw`
      SELECT id, migration_name, started_at, finished_at, applied_steps_count
      FROM _prisma_migrations
      ORDER BY started_at
    `

    console.log('📊 Migration status:', migrations)

    return NextResponse.json(
      {
        success: true,
        migrations: migrations,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Error checking migration status:', error)

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to check migration status',
        error: errorMessage,
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
