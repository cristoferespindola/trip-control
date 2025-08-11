'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/modal'
import Input from '@/components/form/Input'
import { Trip, Expense } from '@/types'
import { useTranslation } from '@/locales'

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
  const { t } = useTranslation()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    value: '',
    date: '',
    notes: '',
  })

  const fetchExpenses = async () => {
    if (!trip) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/trips/${trip.id}/expenses`)
      const result = await response.json()

      if (result.success) {
        setExpenses(result.data)
      }
    } catch (error) {
      console.error('Erro ao buscar despesas:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (open && trip) {
      fetchExpenses()
    }
  }, [open, trip])

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      value: '',
      date: '',
      notes: '',
    })
    setEditingExpense(null)
  }

  const handleClose = () => {
    resetForm()
    setIsModalOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trip) return

    try {
      const url = editingExpense
        ? `/api/expenses/${editingExpense.id}`
        : `/api/trips/${trip.id}/expenses`
      const method = editingExpense ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          value: parseFloat(formData.value),
        }),
      })

      const result = await response.json()

      if (result.success) {
        fetchExpenses()
        handleClose()
      } else {
        alert(result.error || 'Erro ao salvar despesa')
      }
    } catch (error) {
      console.error('Erro ao salvar despesa:', error)
      alert('Erro interno do servidor')
    }
  }

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense)
    setFormData({
      name: expense.name,
      type: expense.type,
      value: expense.value.toString(),
      date: new Date(expense.date).toISOString().split('T')[0],
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

      const result = await response.json()

      if (result.success) {
        fetchExpenses()
      } else {
        alert(result.error || 'Erro ao excluir despesa')
      }
    } catch (error) {
      console.error('Erro ao excluir despesa:', error)
      alert('Erro interno do servidor')
    }
  }

  const openModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const getTypeText = (type: string) => {
    const types: { [key: string]: string } = {
      FUEL: 'Combustível',
      MAINTENANCE: 'Manutenção',
      TOLL: 'Pedágio',
      PARKING: 'Estacionamento',
      FOOD: 'Alimentação',
      OTHER: 'Outros',
    }
    return types[type] || type
  }

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.value,
    0
  )

  return (
    <>
      <Modal open={open} onClose={onClose} title="Gerenciar Despesas" size="xl">
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {trip?.origin} → {trip?.destination}
                </h3>
                <p className="text-sm text-gray-600">
                  {expenses.length}{' '}
                  {expenses.length !== 1 ? 'despesas' : 'despesa'}
                </p>
                {trip?.tripValue && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <strong>{t('trips.fields.tripValue')}:</strong> R${' '}
                      {trip.tripValue.toFixed(2)}
                    </p>
                    <p className="text-sm font-semibold text-green-600">
                      <strong>{t('reports.finalValue')}:</strong> R${' '}
                      {(trip.tripValue - totalExpenses).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={openModal}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              {t('forms.add')} Despesa
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-4">
              <p className="text-gray-500">{t('reports.loadingExpenses')}</p>
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
                            {t('forms.edit')}
                          </button>
                          <button
                            onClick={() => handleDelete(expense.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            {t('forms.delete')}
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
        title={
          editingExpense
            ? `${t('forms.edit')} Despesa`
            : `${t('forms.add')} Despesa`
        }
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome da Despesa"
            name="name"
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nome da despesa"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
              className="block w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              required
            >
              <option value="">Selecione o tipo</option>
              <option value="FUEL">Combustível</option>
              <option value="MAINTENANCE">Manutenção</option>
              <option value="TOLL">Pedágio</option>
              <option value="PARKING">Estacionamento</option>
              <option value="FOOD">Alimentação</option>
              <option value="OTHER">Outros</option>
            </select>
          </div>

          <Input
            label="Valor"
            name="value"
            type="number"
            value={formData.value}
            onChange={e => setFormData({ ...formData, value: e.target.value })}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={e =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className="block w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              {t('forms.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              {editingExpense ? t('forms.update') : t('forms.create')}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
