import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Forcing Prisma migrations...')

    // Generate Prisma client first
    console.log('📦 Generating Prisma client...')
    await execAsync('npx prisma generate')

    // Apply migrations
    console.log('🚀 Applying migrations...')
    const { stdout, stderr } = await execAsync('npx prisma migrate deploy')

    console.log('✅ Migrations applied successfully')
    console.log('Output:', stdout)

    if (stderr) {
      console.warn('Warnings:', stderr)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Migrations applied successfully',
        output: stdout,
        warnings: stderr || null,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Error applying migrations:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorOutput = error instanceof Error && 'stderr' in error ? (error as any).stderr : null

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to apply migrations',
        error: errorMessage,
        details: errorOutput,
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    console.log('🔍 Checking migration status...')

    // Check current migration status
    const { stdout, stderr } = await execAsync('npx prisma migrate status')

    console.log('📊 Migration status:', stdout)

    return NextResponse.json(
      {
        success: true,
        status: stdout,
        warnings: stderr || null,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Error checking migration status:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorOutput = error instanceof Error && 'stderr' in error ? (error as any).stderr : null

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to check migration status',
        error: errorMessage,
        details: errorOutput,
      },
      { status: 500 }
    )
  }
}
