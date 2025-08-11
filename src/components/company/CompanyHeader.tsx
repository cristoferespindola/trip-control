'use client'

import { useCompanySettings } from '../../contexts/CompanySettingsContext'

export default function CompanyHeader() {
  const { settings } = useCompanySettings()
  return (
    <span className="ml-2 text-xl font-bold text-gray-900">
      {settings?.companyName}
    </span>
  )
}
