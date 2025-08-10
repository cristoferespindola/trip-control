const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkUser() {
  try {
    console.log('🔍 Checking all users in database...')

    const allUsers = await prisma.user.findMany()

    if (allUsers.length === 0) {
      console.log('❌ No users found in database')
    } else {
      console.log(`✅ Found ${allUsers.length} user(s):`)
      allUsers.forEach((user, index) => {
        console.log(`${index + 1}. ID: ${user.id}`)
        console.log(`   Username: ${user.username}`)
        console.log(`   Name: ${user.name}`)
        console.log(`   Role: ${user.role}`)
        console.log(`   Status: ${user.status}`)
        console.log('---')
      })
    }

    // Check specific user by ID from context
    const contextUserId = 'cme5zbti000001p29x2dxwim1'
    console.log(`\n🔍 Checking if user with ID "${contextUserId}" exists...`)

    const contextUser = await prisma.user.findUnique({
      where: { id: contextUserId },
    })

    if (contextUser) {
      console.log('✅ User found with context ID:')
      console.log('Username:', contextUser.username)
      console.log('Name:', contextUser.name)
    } else {
      console.log('❌ User with context ID not found in database')
    }
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUser()
