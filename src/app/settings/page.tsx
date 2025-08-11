'use client'

import { useState, useEffect } from 'react'
import { useCompanySettings } from '@/contexts/CompanySettingsContext'
import { useTranslation } from '@/locales'
import { CompanySettings } from '@/types'
import Input from '@/components/form/Input'
import ImageUpload from '@/components/imageUpload'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { settings, updateSettings, loading } = useCompanySettings()
  const { user } = useAuth()
  const { t } = useTranslation()
  const router = useRouter()
  const [formData, setFormData] = useState<Partial<CompanySettings>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      router.push('/')
      return
    }

    if (settings) {
      setFormData({
        companyName: settings.companyName,
        companySlogan: settings.companySlogan,
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
        logoUrl: settings.logoUrl,
        faviconUrl: settings.faviconUrl,
        contactEmail: settings.contactEmail,
        contactPhone: settings.contactPhone,
        website: settings.website,
        address: settings.address,
        cnpj: settings.cnpj,
      })
    }
  }, [settings, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      await updateSettings(formData)
      alert(t('settings.updatedSuccess'))
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error)
      setError(t('settings.updateError'))
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof CompanySettings, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleLogoUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      logoUrl: url,
    }))
  }

  const handleFaviconUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      faviconUrl: url,
    }))
  }

  const handleUploadError = (error: string) => {
    setError(error)
    setTimeout(() => setError(null), 5000)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('settings.title')}
        </h1>
        <p className="mt-2 text-gray-600">{t('settings.subtitle')}</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label={t('settings.companyName')}
                name="companyName"
                type="text"
                value={formData.companyName || ''}
                onChange={e => handleInputChange('companyName', e.target.value)}
                placeholder={t('settings.placeholders.companyName')}
                required
              />

              <Input
                label={t('settings.companySlogan')}
                name="companySlogan"
                type="text"
                value={formData.companySlogan || ''}
                onChange={e =>
                  handleInputChange('companySlogan', e.target.value)
                }
                placeholder={t('settings.placeholders.slogan')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.primaryColor')}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={formData.primaryColor || '#ea580c'}
                    onChange={e =>
                      handleInputChange('primaryColor', e.target.value)
                    }
                    className="h-10 w-16 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor || '#ea580c'}
                    onChange={e =>
                      handleInputChange('primaryColor', e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="#ea580c"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.secondaryColor')}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={formData.secondaryColor || '#f97316'}
                    onChange={e =>
                      handleInputChange('secondaryColor', e.target.value)
                    }
                    className="h-10 w-16 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor || '#f97316'}
                    onChange={e =>
                      handleInputChange('secondaryColor', e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="#f97316"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUpload
                currentUrl={formData.logoUrl}
                onUpload={handleLogoUpload}
                onError={handleUploadError}
                label={t('settings.logo')}
                folder="logos"
              />

              <ImageUpload
                currentUrl={formData.faviconUrl}
                onUpload={handleFaviconUpload}
                onError={handleUploadError}
                label={t('settings.favicon')}
                folder="favicons"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label={t('settings.contactEmail')}
                name="contactEmail"
                type="email"
                value={formData.contactEmail || ''}
                onChange={e =>
                  handleInputChange('contactEmail', e.target.value)
                }
                placeholder={t('settings.placeholders.contactEmail')}
              />

              <Input
                label={t('settings.contactPhone')}
                name="contactPhone"
                type="tel"
                value={formData.contactPhone || ''}
                onChange={e =>
                  handleInputChange('contactPhone', e.target.value)
                }
                placeholder={t('settings.placeholders.contactPhone')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label={t('settings.website')}
                name="website"
                type="url"
                value={formData.website || ''}
                onChange={e => handleInputChange('website', e.target.value)}
                placeholder={t('settings.placeholders.website')}
              />

              <Input
                label={t('settings.cnpj')}
                name="cnpj"
                type="text"
                value={formData.cnpj || ''}
                onChange={e => handleInputChange('cnpj', e.target.value)}
                placeholder={t('settings.placeholders.cnpj')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('settings.address')}
              </label>
              <textarea
                name="address"
                value={formData.address || ''}
                onChange={e => handleInputChange('address', e.target.value)}
                rows={3}
                className="block w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder={t('settings.placeholders.address')}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                {t('forms.cancel')}
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
              >
                {isSaving ? t('settings.saving') : t('settings.saveSettings')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
