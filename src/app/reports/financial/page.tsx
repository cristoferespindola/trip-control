'use client'

import { useState, useEffect } from 'react'
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline'
import DateFilters from '@/components/dateFilters'
import StatusTag from '@/components/statusTag'
import { getFinancialReport } from '@/actions/reports'

interface FinancialReport {
  period: {
    startDate: string | null | undefined
    endDate: string | null | undefined
  }
  overview: {
    totalTrips: number
    totalRevenue: number
    totalExpenses: number
    netProfit: number
    profitMargin: number
  }
  tripsByStatus: Array<{
    status: string
    count: number
    revenue: number
  }>
  expensesByType: Array<{
    type: string
    count: number
    total: number
  }>
  trips: any[]
  expenses: any[]
}

export default function FinancialReport() {
  const [data, setData] = useState<FinancialReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const result = await getFinancialReport(startDate, endDate)
      if (result.success && result.data) {
        setData(result.data)
      } else {
        console.error('Error fetching data:', result.error)
      }
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

  const getTypeText = (type: string) => {
    const typeMap: { [key: string]: string } = {
      MAINTENANCE: 'Manutenção',
      TOLL: 'Pedágio',
      FUEL: 'Combustível',
      FOOD: 'Alimentação',
      OTHER: 'Outros',
    }
    return typeMap[type] || type
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Carregando relatório financeiro...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Nenhum dado encontrado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <ChartBarIcon className="h-8 w-8 text-orange-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">
            Relatório Financeiro
          </h1>
        </div>
        <p className="text-gray-600">
          Análise financeira completa com receitas, despesas e lucro
        </p>
      </div>

      <DateFilters
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        handleFilter={handleFilter}
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <CurrencyDollarIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {data.overview.totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-100 text-red-600">
              <ArrowTrendingDownIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Despesas Totais
              </p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {data.overview.totalExpenses.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <ArrowTrendingUpIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Lucro Líquido</p>
              <p
                className={`text-2xl font-bold ${data.overview.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                R$ {data.overview.netProfit.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
              <ChartBarIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Margem de Lucro
              </p>
              <p
                className={`text-2xl font-bold ${data.overview.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {data.overview.profitMargin.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Viagens por Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Viagens por Status
          </h3>
          <div className="space-y-4">
            {data.tripsByStatus.map(item => (
              <div
                key={item.status}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <StatusTag status={item.status as any} />
                  <span className="ml-3 text-sm text-gray-600">
                    {item.count} viagem{item.count !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    R$ {item.revenue.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Despesas por Tipo */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Despesas por Tipo
          </h3>
          <div className="space-y-4">
            {data.expensesByType.map(item => (
              <div
                key={item.type}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    {getTypeText(item.type)}
                  </span>
                  <span className="ml-3 text-sm text-gray-600">
                    {item.count} despesa{item.count !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">
                    R$ {item.total.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resumo Detalhado */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Resumo Detalhado
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total de Viagens</p>
            <p className="text-3xl font-bold text-gray-900">
              {data.overview.totalTrips}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total de Despesas</p>
            <p className="text-3xl font-bold text-red-600">
              {data.expenses.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Período</p>
            <p className="text-lg font-medium text-gray-900">
              {data.period.startDate && data.period.endDate
                ? `${new Date(data.period.startDate).toLocaleDateString('pt-BR')} - ${new Date(data.period.endDate).toLocaleDateString('pt-BR')}`
                : 'Todos os períodos'}
            </p>
          </div>
        </div>
      </div>

      {/* Gráfico de Lucro/Prejuízo */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Análise de Lucratividade
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Receita Total</span>
            <span className="text-sm font-medium text-green-600">
              R$ {data.overview.totalRevenue.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Despesas Totais</span>
            <span className="text-sm font-medium text-red-600">
              - R$ {data.overview.totalExpenses.toFixed(2)}
            </span>
          </div>
          <hr className="border-gray-200" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              Lucro Líquido
            </span>
            <span
              className={`text-lg font-bold ${data.overview.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              R$ {data.overview.netProfit.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Margem de Lucro</span>
            <span
              className={`text-sm font-medium ${data.overview.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {data.overview.profitMargin >= 0 ? '+' : ''}
              {data.overview.profitMargin.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
