import Image from 'next/image'
import { useTranslation } from '@/locales'

export default function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image src="logo-ce.svg" width={24} height={24} alt="CE Logo" />
            <span className="text-sm text-gray-600">
              {t('footer.developedBy')} - {currentYear}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
