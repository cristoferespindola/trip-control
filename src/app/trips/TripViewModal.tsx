'use client'

import { Trip } from '@/types'
import Modal from '@/components/modal'
import Link from 'next/link'
import StatusTag from '../../components/statusTag'

interface TripViewModalProps {
  open: boolean
  onClose: () => void
  trip: Trip | null
}

export default function TripViewModal({
  open,
  onClose,
  trip,
}: TripViewModalProps) {
  if (!trip) return null

  const getStatusText = (status: string) => {
    const statuses = {
      SCHEDULED: 'Agendada',
      IN_PROGRESS: 'Em Andamento',
      COMPLETED: 'Concluída',
      CANCELLED: 'Cancelada',
    }
    return statuses[status as keyof typeof statuses] || status
  }

  const getStatusColor = (status: string) => {
    const colors = {
      SCHEDULED: 'bg-yellow-100 text-yellow-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getTypeText = (type: string) => {
    const types = {
      MAINTENANCE: 'Manutenção',
      TOLL: 'Pedágio',
      FUEL: 'Combustível',
      FOOD: 'Alimentação',
      OTHER: 'Outros',
    }
    return types[type as keyof typeof types] || type
  }

  const totalExpenses = (trip.expenses || []).reduce(
    (sum, expense) => sum + expense.value,
    0
  )

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Detalhes da Viagem - ${trip.origin} → ${trip.destination}`}
      size="2xl"
    >
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Informações da Viagem
            </h3>

            <StatusTag status={trip.status} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">
                <strong>Origem:</strong> {trip.origin}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Data de Partida:</strong>{' '}
                {new Date(trip.departureDate).toLocaleDateString('pt-BR')}
              </p>

              <p className="text-sm text-gray-600">
                <strong>Kilometragem Inicial:</strong>{' '}
                {trip.initialKilometer
                  ? trip.initialKilometer + ' km'
                  : 'Não informado'}{' '}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                <strong>Destino:</strong> {trip.destination}
              </p>

              <p className="text-sm text-gray-600">
                <strong>Data da Entrega:</strong>{' '}
                {trip.returnDate
                  ? new Date(trip.returnDate).toLocaleDateString('pt-BR')
                  : 'Não informado'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Kilometragem Final:</strong>{' '}
                {trip.finalKilometer
                  ? trip.finalKilometer + ' km'
                  : 'Não informado'}
              </p>
              {trip.initialKilometer && trip.finalKilometer && (
                <p className="text-sm text-gray-600">
                  <strong>Distância Percorrida:</strong>{' '}
                  {trip.finalKilometer - trip.initialKilometer} km
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Faturamento da Viagem
            </h3>
            <p className="text-lg font-semibold text-gray-900">
              Lucro: R${' '}
              {trip?.tripValue
                ? (trip?.tripValue - totalExpenses).toFixed(2)
                : '0.00'}
            </p>
          </div>
          <div className="flex justify-between items-center mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">
                <strong>Valor da Viagem:</strong> R${' '}
                {trip?.tripValue ? trip?.tripValue?.toFixed(2) : '0.00'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                <strong>Total de Despesas:</strong> R${' '}
                {trip?.expenses ? totalExpenses.toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Participantes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Veículo</p>
              <Link
                href={`/vehicles/${trip.vehicle?.id}`}
                className="text-sm text-gray-600 underline"
              >
                <p className="text-sm text-gray-600">{trip.vehicle?.plate}</p>
              </Link>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Motorista</p>
              <Link
                href={`/drivers/${trip.driver?.id}`}
                className="text-sm text-gray-600 underline"
              >
                <p className="text-sm text-gray-600">{trip.driver?.name}</p>
              </Link>
              <p className="text-sm text-gray-600">CNH: {trip.driver?.cnh}</p>
              <p className="text-sm text-gray-600">Tel: {trip.driver?.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Cliente</p>
              <Link
                href={`/clients/${trip.client?.id}`}
                className="text-sm text-gray-600 underline"
              >
                <p className="text-sm text-gray-600">{trip.client?.name}</p>
              </Link>
              <p className="text-sm text-gray-600">Tel: {trip.client?.phone}</p>
            </div>
          </div>
        </div>

        {trip.notes && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Observações
            </h3>
            <p className="text-sm text-gray-600">{trip.notes}</p>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Despesas Detalhadas
            </h3>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">
                Total: R$ {totalExpenses.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                {(trip.expenses || []).length} despesa
                {(trip.expenses || []).length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {(trip.expenses || []).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma despesa registrada</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Observações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(trip.expenses || []).map(expense => (
                    <tr key={expense.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {expense.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {getTypeText(expense.type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(expense.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        R$ {expense.value.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {expense.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Informações do Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">
                <strong>Criado por:</strong> {trip.user?.name}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Data de Criação:</strong>{' '}
                {new Date(trip.createdAt).toLocaleDateString('pt-BR')} às{' '}
                {new Date(trip.createdAt).toLocaleTimeString('pt-BR')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                <strong>Última Atualização:</strong>{' '}
                {new Date(trip.updatedAt).toLocaleDateString('pt-BR')} às{' '}
                {new Date(trip.updatedAt).toLocaleTimeString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
