import Image from 'next/image'
import { useTranslation } from '@/locales'
import { useCompanySettings } from '@/contexts/CompanySettingsContext'

export default function Footer() {
  const { t } = useTranslation()
  const { settings } = useCompanySettings()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image
              src="logo-ce.svg"
              width={32}
              height={32}
              alt="CE Logo"
              style={{ filter: 'invert(1)' }}
            />
            <span className="text-sm text-gray-600">
              {t('footer.developedBy')} - {currentYear}
            </span>
          </div>
          {settings?.contactEmail && (
            <div className="text-sm text-gray-600">
              <a
                href={`mailto:${settings.contactEmail}`}
                className="hover:text-gray-900"
                style={{ color: settings.primaryColor }}
              >
                {settings.contactEmail}
              </a>
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
