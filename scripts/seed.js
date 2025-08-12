const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  const hashedPassword = await bcrypt.hash('admin', 12)

  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@tripcontrol.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  })

  console.log('✅ Usuário admin criado:', adminUser.username)

  const vehicles = await Promise.all([
    prisma.vehicle.upsert({
      where: { plate: 'ABC-1234' },
      update: {},
      create: {
        plate: 'ABC-1234',
        model: 'Sprinter',
        brand: 'Mercedes-Benz',
        year: 2022,
        capacity: 12,
        status: 'ACTIVE',
      },
    }),
    prisma.vehicle.upsert({
      where: { plate: 'XYZ-5678' },
      update: {},
      create: {
        plate: 'XYZ-5678',
        model: 'Transit',
        brand: 'Ford',
        year: 2021,
        capacity: 8,
        status: 'ACTIVE',
      },
    }),
  ])

  console.log('✅ Veículos criados:', vehicles.length)

  const drivers = await Promise.all([
    prisma.driver.upsert({
      where: { cpf: '123.456.789-00' },
      update: {},
      create: {
        name: 'João Silva',
        cpf: '123.456.789-00',
        cnh: '12345678901',
        phone: '(11) 99999-9999',
        email: 'joao.silva@email.com',
        address: 'Rua das Flores, 123 - São Paulo/SP',
        status: 'ACTIVE',
      },
    }),
    prisma.driver.upsert({
      where: { cpf: '987.654.321-00' },
      update: {},
      create: {
        name: 'Maria Santos',
        cpf: '987.654.321-00',
        cnh: '98765432109',
        phone: '(11) 88888-8888',
        email: 'maria.santos@email.com',
        address: 'Av. Paulista, 456 - São Paulo/SP',
        status: 'ACTIVE',
      },
    }),
  ])

  console.log('✅ Motoristas criados:', drivers.length)

  const clients = await Promise.all([
    prisma.client.upsert({
      where: { cnpj: '12.345.678/0001-90' },
      update: {},
      create: {
        name: 'Empresa ABC Ltda',
        cnpj: '12.345.678/0001-90',
        phone: '(11) 77777-7777',
        email: 'contato@empresaabc.com',
        address: 'Rua do Comércio, 789 - São Paulo/SP',
        status: 'ACTIVE',
      },
    }),
    prisma.client.upsert({
      where: { cpf: '555.666.777-88' },
      update: {},
      create: {
        name: 'João da Silva',
        cpf: '555.666.777-88',
        phone: '(11) 66666-6666',
        email: 'joao.silva@email.com',
        address: 'Rua das Palmeiras, 321 - São Paulo/SP',
        status: 'ACTIVE',
      },
    }),
  ])

  console.log('✅ Clientes criados:', clients.length)

  const trips = await Promise.all([
    prisma.trip.upsert({
      where: { id: 'trip-1' },
      update: {},
      create: {
        id: 'trip-1',
        origin: 'São Paulo, SP',
        destination: 'Rio de Janeiro, RJ',
        departureDate: new Date('2024-01-15T08:00:00Z'),
        returnDate: new Date('2024-01-16T18:00:00Z'),
        initialKilometer: 1000,
        finalKilometer: 1450,
        tripValue: 380.0,
        status: 'COMPLETED',
        notes: 'Viagem executada com sucesso',
        vehicleId: vehicles[0].id,
        driverId: drivers[0].id,
        clientId: clients[0].id,
        userId: adminUser.id,
      },
    }),
    prisma.trip.upsert({
      where: { id: 'trip-2' },
      update: {},
      create: {
        id: 'trip-2',
        origin: 'São Paulo, SP',
        destination: 'Campinas, SP',
        departureDate: new Date('2024-01-20T10:00:00Z'),
        returnDate: new Date('2024-01-20T16:00:00Z'),
        initialKilometer: 2000,
        finalKilometer: 2100,
        tripValue: 130.0,
        status: 'SCHEDULED',
        notes: 'Viagem agendada para reunião',
        vehicleId: vehicles[1].id,
        driverId: drivers[1].id,
        clientId: clients[1].id,
        userId: adminUser.id,
      },
    }),
  ])

  console.log('✅ Viagens criadas:', trips.length)

  console.log('🎉 Seed concluído com sucesso!')
  console.log('')
  console.log('📋 Dados criados:')
  console.log(`   👤 Usuários: ${1}`)
  console.log(`   🚗 Veículos: ${vehicles.length}`)
  console.log(`   👨‍💼 Motoristas: ${drivers.length}`)
  console.log(`   🏢 Clientes: ${clients.length}`)
  console.log(`   🗺️ Viagens: ${trips.length}`)
  console.log('')
  console.log('🔑 Credenciais de acesso:')
  console.log('   Usuário: admin')
  console.log('   Senha: admin')
  console.log('')
  console.log('🌐 Acesse: http://localhost:3000')
}

main()
  .catch(e => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
