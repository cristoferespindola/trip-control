'use client'

import { useState, useEffect } from 'react'
import { UserIcon } from '@heroicons/react/24/outline'
import Input from '@/components/form/Input'
import DateFilters from '../../../components/dateFilters'

interface DriverReport {
  driverId: string
  driver: {
    id: string
    name: string
    cnh: string
    phone: string
  }
  tripCount: number
  totalValue: number
  totalExpenses: number
  finalValue: number
  trips: any[]
}

export default function TripsByDriverPage() {
  const [data, setData] = useState<DriverReport[]>([])
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const response = await fetch(`/api/reports/trips-by-driver?${params}`)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleFilter = () => {
    fetchData()
  }

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      SCHEDULED: 'Agendada',
      IN_PROGRESS: 'Em Andamento',
      COMPLETED: 'Concluída',
      CANCELLED: 'Cancelada',
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      SCHEDULED: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Carregando relatório...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <UserIcon className="h-8 w-8 text-green-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">
            Viagens por Motorista
          </h1>
        </div>
        <p className="text-gray-600">
          Relatório detalhado de viagens agrupadas por motorista
        </p>
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
          <p className="text-gray-500">
            Nenhum dado encontrado para o período selecionado
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {data.map(item => (
            <div
              key={item.driverId}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="bg-green-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.driver.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      CNH: {item.driver.cnh} | Tel: {item.driver.phone}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.tripCount} viagem{item.tripCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Valor Total</p>
                    <p className="text-lg font-semibold text-gray-900">
                      R$ {item.totalValue.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Total de Viagens</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {item.tripCount}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Total de Despesas</p>
                    <p className="text-2xl font-bold text-red-600">
                      R$ {item.totalExpenses.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Valor Final</p>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {item.finalValue.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">
                    Viagens Detalhadas
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Veículo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Origem
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Destino
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Data
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Valor
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Despesas
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {item.trips.map(trip => (
                          <tr key={trip.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {trip.vehicle?.plate}
                            </td>
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
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(trip.status)}`}
                              >
                                {getStatusText(trip.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              R$ {trip.tripValue?.toFixed(2) || '0.00'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              R${' '}
                              {trip.expenses
                                .reduce(
                                  (sum: number, expense: any) =>
                                    sum + expense.value,
                                  0
                                )
                                .toFixed(2)}
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
