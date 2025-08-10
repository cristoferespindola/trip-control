const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Populando banco de dados com dados de exemplo...')

  // Criar veículos
  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        plate: 'ABC1234',
        model: 'Sprinter',
        brand: 'Mercedes-Benz',
        year: 2020,
        capacity: 15,
        status: 'ACTIVE'
      }
    }),
    prisma.vehicle.create({
      data: {
        plate: 'DEF5678',
        model: 'Master',
        brand: 'Renault',
        year: 2021,
        capacity: 12,
        status: 'ACTIVE'
      }
    }),
    prisma.vehicle.create({
      data: {
        plate: 'GHI9012',
        model: 'Ducato',
        brand: 'Fiat',
        year: 2019,
        capacity: 20,
        status: 'ACTIVE'
      }
    })
  ])

  console.log('✅ Veículos criados:', vehicles.length)

  // Criar motoristas
  const drivers = await Promise.all([
    prisma.driver.create({
      data: {
        name: 'João Silva',
        cpf: '123.456.789-00',
        cnh: '12345678900',
        phone: '(11) 99999-9999',
        email: 'joao.silva@email.com',
        address: 'Rua das Flores, 123 - São Paulo/SP',
        status: 'ACTIVE'
      }
    }),
    prisma.driver.create({
      data: {
        name: 'Maria Santos',
        cpf: '987.654.321-00',
        cnh: '98765432100',
        phone: '(11) 88888-8888',
        email: 'maria.santos@email.com',
        address: 'Av. Paulista, 456 - São Paulo/SP',
        status: 'ACTIVE'
      }
    }),
    prisma.driver.create({
      data: {
        name: 'Pedro Oliveira',
        cpf: '111.222.333-44',
        cnh: '11122233344',
        phone: '(11) 77777-7777',
        email: 'pedro.oliveira@email.com',
        address: 'Rua Augusta, 789 - São Paulo/SP',
        status: 'ACTIVE'
      }
    })
  ])

  console.log('✅ Motoristas criados:', drivers.length)

  // Criar clientes
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: 'Empresa ABC Ltda',
        cnpj: '12.345.678/0001-90',
        phone: '(11) 3333-3333',
        email: 'contato@empresaabc.com',
        address: 'Rua do Comércio, 100 - São Paulo/SP',
        status: 'ACTIVE'
      }
    }),
    prisma.client.create({
      data: {
        name: 'João da Silva',
        cpf: '555.666.777-88',
        phone: '(11) 4444-4444',
        email: 'joao.silva@email.com',
        address: 'Rua Particular, 200 - São Paulo/SP',
        status: 'ACTIVE'
      }
    }),
    prisma.client.create({
      data: {
        name: 'Empresa XYZ S.A.',
        cnpj: '98.765.432/0001-10',
        phone: '(11) 5555-5555',
        email: 'contato@xyz.com',
        address: 'Av. Industrial, 300 - São Paulo/SP',
        status: 'ACTIVE'
      }
    })
  ])

  console.log('✅ Clientes criados:', clients.length)

  // Criar viagens
  const trips = await Promise.all([
    prisma.trip.create({
      data: {
        origin: 'São Paulo - SP',
        destination: 'Rio de Janeiro - RJ',
        departureDate: new Date('2024-01-15T08:00:00Z'),
        returnDate: new Date('2024-01-16T18:00:00Z'),
        distance: 430.5,
        fuelCost: 250.00,
        tollCost: 45.50,
        otherCosts: 50.00,
        totalCost: 345.50,
        status: 'COMPLETED',
        notes: 'Viagem executada com sucesso',
        vehicleId: vehicles[0].id,
        driverId: drivers[0].id,
        clientId: clients[0].id
      }
    }),
    prisma.trip.create({
      data: {
        origin: 'São Paulo - SP',
        destination: 'Campinas - SP',
        departureDate: new Date('2024-01-20T10:00:00Z'),
        returnDate: new Date('2024-01-20T16:00:00Z'),
        distance: 95.2,
        fuelCost: 120.00,
        tollCost: 15.00,
        otherCosts: 25.00,
        totalCost: 160.00,
        status: 'SCHEDULED',
        notes: 'Viagem agendada para conferência',
        vehicleId: vehicles[1].id,
        driverId: drivers[1].id,
        clientId: clients[1].id
      }
    }),
    prisma.trip.create({
      data: {
        origin: 'São Paulo - SP',
        destination: 'Santos - SP',
        departureDate: new Date('2024-01-25T07:00:00Z'),
        returnDate: new Date('2024-01-25T19:00:00Z'),
        distance: 72.8,
        fuelCost: 90.00,
        tollCost: 12.00,
        otherCosts: 30.00,
        totalCost: 132.00,
        status: 'IN_PROGRESS',
        notes: 'Viagem em andamento',
        vehicleId: vehicles[2].id,
        driverId: drivers[2].id,
        clientId: clients[2].id
      }
    })
  ])

  console.log('✅ Viagens criadas:', trips.length)

  console.log('🎉 Banco de dados populado com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro ao popular banco:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 