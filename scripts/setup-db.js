const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database...')
    console.log('📅 Timestamp:', new Date().toISOString())

    try {
      await prisma.$queryRaw`SELECT 1`
      console.log('✅ Database connection successful')
    } catch (error) {
      console.error('❌ Database connection failed:', error.message)
      console.log('💡 Make sure to run: npx prisma migrate deploy')
      return
    }

    let usersTableExists = false
    try {
      await prisma.user.findFirst()
      usersTableExists = true
      console.log('✅ Users table exists and is accessible')
    } catch (error) {
      console.error(
        '❌ Users table does not exist or is not accessible:',
        error.message
      )
      console.log('💡 Please run migrations first: npx prisma migrate deploy')
      return
    }

    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'admin' },
    })

    if (!existingAdmin) {
      console.log('👤 Creating admin user...')

      const hashedPassword = await bcrypt.hash('admin', 10)
      console.log('🔑 Password:', hashedPassword)

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

      console.log('✅ Admin user created successfully!')
      console.log('📧 Email: admin@tripcontrol.com')
      console.log('🔑 Username: admin')
      console.log('🔐 Password: admin')
      console.log('🆔 User ID:', adminUser.id)
    } else {
      console.log('✅ Admin user already exists')
      console.log('🆔 User ID:', existingAdmin.id)
    }

    let vehicleCount = 0
    let driverCount = 0
    let clientCount = 0

    try {
      vehicleCount = await prisma.vehicle.count()
      driverCount = await prisma.driver.count()
      clientCount = await prisma.client.count()
      console.log(
        `📊 Current data: ${vehicleCount} vehicles, ${driverCount} drivers, ${clientCount} clients`
      )
    } catch (error) {
      console.log(
        '⚠️ Some tables may not exist yet, skipping sample data creation'
      )
      console.log('Error details:', error.message)
    }

    if (vehicleCount === 0 && driverCount === 0 && clientCount === 0) {
      console.log('📊 Creating sample data...')

      try {
        const vehicles = await Promise.all([
          prisma.vehicle.create({
            data: {
              plate: 'ABC-1234',
              model: 'Sprinter',
              brand: 'Mercedes-Benz',
              year: 2022,
              capacity: 12,
              status: 'ACTIVE',
            },
          }),
          prisma.vehicle.create({
            data: {
              plate: 'XYZ-5678',
              model: 'Master',
              brand: 'Renault',
              year: 2021,
              capacity: 8,
              status: 'ACTIVE',
            },
          }),
        ])

        const drivers = await Promise.all([
          prisma.driver.create({
            data: {
              name: 'João Silva',
              cpf: '123.456.789-01',
              cnh: '12345678901',
              phone: '(11) 99999-9999',
              email: 'joao@exemplo.com',
              address: 'Rua das Flores, 123 - São Paulo, SP',
              status: 'ACTIVE',
            },
          }),
          prisma.driver.create({
            data: {
              name: 'Maria Santos',
              cpf: '987.654.321-09',
              cnh: '98765432109',
              phone: '(11) 88888-8888',
              email: 'maria@exemplo.com',
              address: 'Av. Paulista, 456 - São Paulo, SP',
              status: 'ACTIVE',
            },
          }),
        ])

        const clients = await Promise.all([
          prisma.client.create({
            data: {
              name: 'Empresa ABC Ltda',
              cnpj: '12.345.678/0001-90',
              phone: '(11) 77777-7777',
              email: 'contato@empresaabc.com',
              address: 'Rua do Comércio, 789 - São Paulo, SP',
              status: 'ACTIVE',
            },
          }),
          prisma.client.create({
            data: {
              name: 'Transportadora XYZ',
              cnpj: '98.765.432/0001-10',
              phone: '(11) 66666-6666',
              email: 'contato@transportadoraxyz.com',
              address: 'Av. Industrial, 321 - São Paulo, SP',
              status: 'ACTIVE',
            },
          }),
        ])

        console.log(
          `✅ Created ${vehicles.length} vehicles, ${drivers.length} drivers, and ${clients.length} clients`
        )
      } catch (error) {
        console.error('❌ Error creating sample data:', error.message)
      }
    } else {
      console.log('✅ Sample data already exists')
    }

    console.log('🎉 Database setup completed successfully!')
  } catch (error) {
    console.error('❌ Error setting up database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('✅ Setup completed')
      process.exit(0)
    })
    .catch(error => {
      console.error('❌ Setup failed:', error)
      process.exit(1)
    })
}

module.exports = { setupDatabase }
