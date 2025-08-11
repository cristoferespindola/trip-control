const { readdir, unlink, stat } = require('fs/promises')
const { join } = require('path')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')

async function cleanupUploads() {
  try {
    console.log('🧹 Iniciando limpeza de uploads...')

    // Buscar configurações da empresa
    const companySettings = await prisma.companySettings.findFirst({
      where: { isActive: true },
    })

    // Listar todos os arquivos no diretório de uploads
    const files = await readdir(UPLOAD_DIR)
    const uploadFiles = files.filter(file => file !== '.gitkeep')

    console.log(`📁 Encontrados ${uploadFiles.length} arquivos de upload`)

    // URLs atualmente em uso
    const usedUrls = []
    if (companySettings?.logoUrl) {
      usedUrls.push(companySettings.logoUrl.replace('/uploads/', ''))
    }
    if (companySettings?.faviconUrl) {
      usedUrls.push(companySettings.faviconUrl.replace('/uploads/', ''))
    }

    console.log('🔗 URLs em uso:', usedUrls)

    // Deletar arquivos não utilizados
    let deletedCount = 0
    for (const file of uploadFiles) {
      if (!usedUrls.includes(file)) {
        const filepath = join(UPLOAD_DIR, file)
        const fileStats = await stat(filepath)
        const fileAge = Date.now() - fileStats.mtime.getTime()
        const daysOld = fileAge / (1000 * 60 * 60 * 24)

        // Deletar arquivos com mais de 30 dias ou não utilizados
        if (daysOld > 30) {
          await unlink(filepath)
          console.log(`🗑️ Deletado: ${file} (${Math.round(daysOld)} dias)`)
          deletedCount++
        }
      }
    }

    console.log(`✅ Limpeza concluída! ${deletedCount} arquivos deletados`)
  } catch (error) {
    console.error('❌ Erro na limpeza:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupUploads()
