const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createUser() {
  try {
    console.log('👤 Criando novo usuário...')
    console.log('📅 Timestamp:', new Date().toISOString())

    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { username: 'master' },
    })

    if (existingUser) {
      console.log('⚠️ Usuário "master" já existe!')
      console.log('🆔 User ID:', existingUser.id)
      console.log('📧 Email:', existingUser.email)
      console.log('👤 Nome:', existingUser.name)
      console.log('🔑 Username:', existingUser.username)
      console.log('🎭 Role:', existingUser.role)
      console.log('📊 Status:', existingUser.status)
      return
    }

    // Criar hash da senha
    const hashedPassword = await bcrypt.hash('Cris#1411', 10)
    console.log('🔑 Senha criptografada criada')

    // Criar o usuário
    const newUser = await prisma.user.create({
      data: {
        username: 'master',
        email: 'master@tripcontrol.com',
        name: 'Master User',
        password: hashedPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    })

    console.log('✅ Usuário criado com sucesso!')
    console.log('🆔 User ID:', newUser.id)
    console.log('📧 Email:', newUser.email)
    console.log('👤 Nome:', newUser.name)
    console.log('🔑 Username:', newUser.username)
    console.log('🎭 Role:', newUser.role)
    console.log('📊 Status:', newUser.status)
    console.log('🔐 Senha: Cris#1411')
    console.log('')
    console.log('🎉 Você pode fazer login com:')
    console.log('   Username: master')
    console.log('   Password: Cris#1411')
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createUser()
