'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { CompanySettings } from '@/types'

interface CompanySettingsContextType {
  settings: CompanySettings | null
  loading: boolean
  updateSettings: (data: Partial<CompanySettings>) => Promise<void>
  refreshSettings: () => Promise<void>
}

const CompanySettingsContext = createContext<
  CompanySettingsContextType | undefined
>(undefined)

export function CompanySettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<CompanySettings | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/company-settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      } else {
        // Se não encontrar configurações, criar as padrão
        await createDefaultSettings()
      }
    } catch (error) {
      console.error('Erro ao buscar configurações da empresa:', error)
    } finally {
      setLoading(false)
    }
  }

  const createDefaultSettings = async () => {
    try {
      const defaultSettings: Partial<CompanySettings> = {
        companyName: 'TripControl',
        companySlogan: 'Sistema de Controle de Viagens',
        primaryColor: '#ea580c',
        secondaryColor: '#f97316',
        isActive: true,
      }

      const response = await fetch('/api/company-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(defaultSettings),
      })

      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Erro ao criar configurações padrão:', error)
    }
  }

  const updateSettings = async (data: Partial<CompanySettings>) => {
    try {
      const response = await fetch('/api/company-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const updatedSettings = await response.json()
        setSettings(updatedSettings)
      }
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error)
    }
  }

  const refreshSettings = async () => {
    setLoading(true)
    await fetchSettings()
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  return (
    <CompanySettingsContext.Provider
      value={{
        settings,
        loading,
        updateSettings,
        refreshSettings,
      }}
    >
      {children}
    </CompanySettingsContext.Provider>
  )
}

export function useCompanySettings() {
  const context = useContext(CompanySettingsContext)
  if (context === undefined) {
    throw new Error(
      'useCompanySettings must be used within a CompanySettingsProvider'
    )
  }
  return context
}
