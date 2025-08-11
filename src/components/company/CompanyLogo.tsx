'use client'

import Image from 'next/image'
import { useCompanySettings } from '@/contexts/CompanySettingsContext'
import DefaultLogo from '../logo'
import CompanyHeader from './CompanyHeader'

interface CompanyLogoProps {
  className?: string
  width?: number
  height?: number
  showText?: boolean
}

export default function CompanyLogo({
  className = '',
  width = 32,
  height = 32,
  showText = true,
}: CompanyLogoProps) {
  const { settings } = useCompanySettings()

  if (settings?.logoUrl) {
    return (
      <div className={`flex items-center ${className}`}>
        <Image
          src={settings.logoUrl}
          alt={settings.companyName}
          width={width}
          height={height}
          className="object-contain"
          onError={e => {
            console.warn('Erro ao carregar logo:', settings.logoUrl)
            // Fallback para o logo padrão em caso de erro
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            target.nextElementSibling?.classList.remove('hidden')
          }}
        />
        {showText && <CompanyHeader />}
      </div>
    )
  }

  return (
    <div className={`flex items-center ${className}`}>
      <DefaultLogo />
      {showText && <CompanyHeader />}
    </div>
  )
}
