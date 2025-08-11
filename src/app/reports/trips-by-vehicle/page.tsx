'use client'

import { useState, useEffect } from 'react'
import { TruckIcon } from '@heroicons/react/24/outline'
import DateFilters from '@/components/dateFilters'
import { useTranslation } from '@/locales'

interface VehicleReport {
  vehicleId: string
  vehicle: {
    id: string
    plate: string
    brand: string
    model: string
    year: number
    status: string
    capacity: number
    createdAt: Date
    updatedAt: Date
  } | null
  tripCount: number
  totalValue: number
  totalExpenses: number
  finalValue: number
  trips: any[]
}

export default function TripsByVehiclePage() {
  const { t } = useTranslation()
  const [data, setData] = useState<VehicleReport[]>([])
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  const fetchData = async () => {
    try {
      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const response = await fetch(`/api/reports/trips-by-vehicle?${params}`)
      const result = await response.json()

      if (result.success) {
        setData(result.data)
      } else {
        console.error('Error fetching data:', result.error)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleFilter = () => {
    fetchData()
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <TruckIcon className="h-8 w-8 text-blue-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">
            {t('reports.byVehicle.title')}
          </h1>
        </div>
        <p className="text-gray-600">{t('reports.byVehicle.description')}</p>
      </div>

      <DateFilters
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        handleFilter={handleFilter}
      />

      {data.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">{t('messages.noData')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {data.map(item => (
            <div
              key={item.vehicleId}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.vehicle?.plate} - {item.vehicle?.brand}{' '}
                      {item.vehicle?.model} ({item.vehicle?.year})
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.tripCount}{' '}
                      {item.tripCount !== 1
                        ? t('trips.title')
                        : t('trips.title').slice(0, -1)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {t('reports.totalValue')}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      R$ {item.totalValue.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      {t('reports.totalTrips')}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {item.tripCount}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      {t('reports.totalExpenses')}
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      R$ {item.totalExpenses.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      {t('reports.finalValue')}
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {item.finalValue.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">
                    {t('reports.detailedTrips')}
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('trips.fields.origin')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('trips.fields.destination')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('trips.fields.departureDate')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('table.status')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('trips.fields.tripValue')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('reports.expensesLabel')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {item.trips.map((trip: any) => (
                          <tr key={trip.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {trip.origin}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {trip.destination}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(trip.departureDate).toLocaleDateString(
                                'pt-BR'
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  trip.status === 'COMPLETED'
                                    ? 'bg-green-100 text-green-800'
                                    : trip.status === 'IN_PROGRESS'
                                      ? 'bg-blue-100 text-blue-800'
                                      : trip.status === 'SCHEDULED'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {t(`trips.status.${trip.status.toLowerCase()}`)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              R$ {trip.value?.toFixed(2) || '0.00'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              R${' '}
                              {trip.expenses
                                ?.reduce(
                                  (sum: number, exp: any) => sum + exp.value,
                                  0
                                )
                                .toFixed(2) || '0.00'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
