'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/modal'
import { Trip, Expense } from '@/types'
import Select from '@/components/form/Select'
import Input from '@/components/form/Input'
import TextArea from '@/components/form/TextArea'

interface ExpenseModalProps {
  open: boolean
  onClose: () => void
  trip: Trip | null
}

export default function ExpenseModal({
  open,
  onClose,
  trip,
}: ExpenseModalProps) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    date: '',
    type: 'OTHER' as 'MAINTENANCE' | 'TOLL' | 'FUEL' | 'FOOD' | 'OTHER',
    notes: '',
  })

  useEffect(() => {
    if (trip) {
      fetchExpenses()
    }
  }, [trip])

  const fetchExpenses = async () => {
    if (!trip) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/trips/${trip.id}/expenses`)
      if (response.ok) {
        const tripWithExpenses = await response.json()
        setExpenses(tripWithExpenses.expenses || [])
      }
    } catch (error) {
      console.error('Erro ao buscar despesas:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      value: '',
      date: '',
      type: 'OTHER',
      notes: '',
    })
  }

  const handleClose = () => {
    resetForm()
    setEditingExpense(null)
    setIsModalOpen(false)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trip) return

    try {
      const expenseData = {
        ...formData,
        value: parseFloat(formData.value),
        tripId: trip.id,
        driverId: trip.driverId,
        vehicleId: trip.vehicleId,
      }

      const url = editingExpense
        ? `/api/expenses/${editingExpense.id}`
        : '/api/expenses'

      const method = editingExpense ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      })

      if (response.ok) {
        await fetchExpenses()
        handleClose()
      } else {
        const error = await response.json()
        alert(error.message || 'Erro ao salvar despesa')
      }
    } catch (error) {
      console.error('Erro ao salvar despesa:', error)
      alert('Erro ao salvar despesa')
    }
  }

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense)
    setFormData({
      name: expense.name,
      value: expense.value.toString(),
      date: new Date(expense.date).toISOString().split('T')[0],
      type: expense.type,
      notes: expense.notes || '',
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta despesa?')) return

    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchExpenses()
      } else {
        const error = await response.json()
        alert(error.message || 'Erro ao excluir despesa')
      }
    } catch (error) {
      console.error('Erro ao excluir despesa:', error)
      alert('Erro ao excluir despesa')
    }
  }

  const openModal = () => {
    setEditingExpense(null)
    resetForm()
    setIsModalOpen(true)
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

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.value,
    0
  )

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        title={`Despesas - ${trip?.origin} → ${trip?.destination}`}
        size="xl"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                <strong>Veículo:</strong> {trip?.vehicle?.plate}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Motorista:</strong> {trip?.driver?.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">
                Total: R$ {totalExpenses.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                {expenses.length} despesa{expenses.length !== 1 ? 's' : ''}
              </p>
              {trip?.tripValue && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Valor da Viagem:</strong> R${' '}
                    {trip.tripValue.toFixed(2)}
                  </p>
                  <p className="text-sm font-semibold text-green-600">
                    <strong>Valor Final:</strong> R${' '}
                    {(trip.tripValue - totalExpenses).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={openModal}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Nova Despesa
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-4">
              <p className="text-gray-500">Carregando despesas...</p>
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma despesa registrada</p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {expenses.map(expense => (
                  <li key={expense.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {expense.name}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{getTypeText(expense.type)}</span>
                              <span>
                                {new Date(expense.date).toLocaleDateString(
                                  'pt-BR'
                                )}
                              </span>
                            </div>
                            {expense.notes && (
                              <p className="text-sm text-gray-500 mt-1">
                                {expense.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-900">
                          R$ {expense.value.toFixed(2)}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(expense)}
                            className="text-orange-600 hover:text-orange-900"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(expense.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExpense ? 'Editar Despesa' : 'Nova Despesa'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome da Despesa"
            name="name"
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Combustível, Pedágio, etc."
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Valor"
              name="value"
              type="number"
              value={formData.value}
              onChange={e =>
                setFormData({ ...formData, value: e.target.value })
              }
              placeholder="0.00"
              required
            />

            <Input
              label="Data"
              name="date"
              type="date"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              placeholder="dd/mm/aaaa"
              required
            />
          </div>

          <Select
            label="Tipo"
            name="type"
            options={[
              { id: 'MAINTENANCE', name: 'Manutenção' },
              { id: 'TOLL', name: 'Pedágio' },
              { id: 'FUEL', name: 'Combustível' },
              { id: 'FOOD', name: 'Alimentação' },
              { id: 'OTHER', name: 'Outros' },
            ]}
            value={formData.type}
            required
            onChange={e =>
              setFormData({ ...formData, type: e.target.value as any })
            }
          />

          <TextArea
            label="Observações"
            name="notes"
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            placeholder="Observações sobre a despesa"
            required={false}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              {editingExpense ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
