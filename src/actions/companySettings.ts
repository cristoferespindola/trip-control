'use server'

import { prisma } from '@/lib/prisma'
import { CompanySettings } from '@/types'

export async function getCompanySettings(): Promise<CompanySettings | null> {
  try {
    const settings = await prisma.companySettings.findFirst({
      where: { isActive: true },
    })
    return settings
  } catch (error) {
    console.error('Erro ao buscar configurações da empresa:', error)
    return null
  }
}

export async function updateCompanySettings(
  data: Partial<CompanySettings>
): Promise<CompanySettings | null> {
  try {
    let settings = await prisma.companySettings.findFirst({
      where: { isActive: true },
    })

    if (settings) {
      // Atualizar configurações existentes
      settings = await prisma.companySettings.update({
        where: { id: settings.id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      })
    } else {
      // Criar novas configurações
      settings = await prisma.companySettings.create({
        data: {
          ...data,
          isActive: true,
        },
      })
    }

    return settings
  } catch (error) {
    console.error('Erro ao atualizar configurações da empresa:', error)
    return null
  }
}

export async function createDefaultCompanySettings(): Promise<CompanySettings | null> {
  try {
    const defaultSettings = await prisma.companySettings.create({
      data: {
        companyName: 'TripControl',
        companySlogan: 'Sistema de Controle de Viagens',
        primaryColor: '#ea580c',
        secondaryColor: '#f97316',
        isActive: true,
      },
    })
    return defaultSettings
  } catch (error) {
    console.error('Erro ao criar configurações padrão da empresa:', error)
    return null
  }
}
