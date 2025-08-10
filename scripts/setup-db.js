const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database...');

    // Verificar se o usuário admin já existe
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'admin' }
    });

    if (!existingAdmin) {
      console.log('👤 Creating admin user...');
      
      // Hash da senha
      const hashedPassword = await bcrypt.hash('admin', 10);
      
      // Criar usuário admin
      await prisma.user.create({
        data: {
          username: 'admin',
          email: 'admin@tripcontrol.com',
          name: 'Administrator',
          password: hashedPassword,
          role: 'ADMIN',
          status: 'ACTIVE'
        }
      });
      
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@tripcontrol.com');
      console.log('🔑 Username: admin');
      console.log('🔐 Password: admin');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Verificar se há dados de exemplo
    const vehicleCount = await prisma.vehicle.count();
    const driverCount = await prisma.driver.count();
    const clientCount = await prisma.client.count();

    if (vehicleCount === 0 && driverCount === 0 && clientCount === 0) {
      console.log('📊 Creating sample data...');
      
      // Criar veículos de exemplo
      const vehicles = await Promise.all([
        prisma.vehicle.create({
          data: {
            plate: 'ABC-1234',
            model: 'Sprinter',
            brand: 'Mercedes-Benz',
            year: 2022,
            color: 'Branco',
            capacity: 12,
            status: 'ACTIVE'
          }
        }),
        prisma.vehicle.create({
          data: {
            plate: 'XYZ-5678',
            model: 'Master',
            brand: 'Renault',
            year: 2021,
            color: 'Prata',
            capacity: 8,
            status: 'ACTIVE'
          }
        })
      ]);

      // Criar motoristas de exemplo
      const drivers = await Promise.all([
        prisma.driver.create({
          data: {
            name: 'João Silva',
            cnh: '12345678901',
            phone: '(11) 99999-9999',
            email: 'joao@exemplo.com',
            address: 'Rua das Flores, 123 - São Paulo, SP',
            status: 'ACTIVE'
          }
        }),
        prisma.driver.create({
          data: {
            name: 'Maria Santos',
            cnh: '98765432109',
            phone: '(11) 88888-8888',
            email: 'maria@exemplo.com',
            address: 'Av. Paulista, 456 - São Paulo, SP',
            status: 'ACTIVE'
          }
        })
      ]);

      // Criar clientes de exemplo
      const clients = await Promise.all([
        prisma.client.create({
          data: {
            name: 'Empresa ABC Ltda',
            cnpj: '12.345.678/0001-90',
            phone: '(11) 77777-7777',
            email: 'contato@empresaabc.com',
            address: 'Rua do Comércio, 789 - São Paulo, SP',
            status: 'ACTIVE'
          }
        }),
        prisma.client.create({
          data: {
            name: 'Transportadora XYZ',
            cnpj: '98.765.432/0001-10',
            phone: '(11) 66666-6666',
            email: 'contato@transportadoraxyz.com',
            address: 'Av. Industrial, 321 - São Paulo, SP',
            status: 'ACTIVE'
          }
        })
      ]);

      console.log(`✅ Created ${vehicles.length} vehicles, ${drivers.length} drivers, and ${clients.length} clients`);
    } else {
      console.log('✅ Sample data already exists');
    }

    console.log('🎉 Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('✅ Setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupDatabase };
