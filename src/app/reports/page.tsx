'use client'

import { useState } from 'react'
import {
  TruckIcon,
  UserIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useTranslation } from '@/locales'

export default function ReportsPage() {
  const { t } = useTranslation()

  const reports = [
    {
      id: 'trips-by-vehicle',
      title: t('reports.byVehicle.title'),
      description: t('reports.byVehicle.description'),
      icon: TruckIcon,
      href: '/reports/trips-by-vehicle',
      color: 'bg-blue-500',
    },
    {
      id: 'trips-by-driver',
      title: t('reports.byDriver.title'),
      description: t('reports.byDriver.description'),
      icon: UserIcon,
      href: '/reports/trips-by-driver',
      color: 'bg-green-500',
    },
    {
      id: 'trips-by-client',
      title: t('reports.byClient.title'),
      description: t('reports.byClient.description'),
      icon: BuildingOfficeIcon,
      href: '/reports/trips-by-client',
      color: 'bg-purple-500',
    },
    {
      id: 'expenses',
      title: t('reports.expenses.title'),
      description: t('reports.expenses.description'),
      icon: CurrencyDollarIcon,
      href: '/reports/expenses',
      color: 'bg-red-500',
    },
    {
      id: 'financial',
      title: t('reports.financial.title'),
      description: t('reports.financial.description'),
      icon: ChartBarIcon,
      href: '/reports/financial',
      color: 'bg-orange-500',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('reports.title')}
        </h1>
        <p className="text-gray-600">{t('reports.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map(report => {
          const IconComponent = report.icon
          return (
            <Link key={report.id} href={report.href} className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${report.color} text-white`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {report.title}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{report.description}</p>
                <div className="mt-4 flex items-center text-orange-600 text-sm font-medium">
                  {t('reports.accessReport')}
                  <svg
                    className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
