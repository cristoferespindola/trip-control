const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function setupCompanySettings() {
  try {
    console.log('Configurando configurações padrão da empresa...')

    // Verificar se já existem configurações
    const existingSettings = await prisma.companySettings.findFirst({
      where: { isActive: true },
    })

    if (existingSettings) {
      console.log('Configurações já existem. Atualizando...')

      await prisma.companySettings.update({
        where: { id: existingSettings.id },
        data: {
          companyName: 'TripControl',
          companySlogan: 'Sistema de Controle de Viagens',
          primaryColor: '#ea580c',
          secondaryColor: '#f97316',
          contactEmail: 'contato@tripcontrol.com',
          contactPhone: '(11) 99999-9999',
          website: 'https://tripcontrol.com',
          address: 'São Paulo, SP',
          cnpj: '00.000.000/0000-00',
          isActive: true,
          updatedAt: new Date(),
        },
      })
    } else {
      console.log('Criando novas configurações...')

      await prisma.companySettings.create({
        data: {
          companyName: 'TripControl',
          companySlogan: 'Sistema de Controle de Viagens',
          primaryColor: '#ea580c',
          secondaryColor: '#f97316',
          contactEmail: 'contato@tripcontrol.com',
          contactPhone: '(11) 99999-9999',
          website: 'https://tripcontrol.com',
          address: 'São Paulo, SP',
          cnpj: '00.000.000/0000-00',
          isActive: true,
        },
      })
    }

    console.log('✅ Configurações da empresa configuradas com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao configurar configurações da empresa:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupCompanySettings()
