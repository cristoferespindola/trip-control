'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import Modal from '@/components/modal'
import { Client } from '@/types'
import { useTranslation } from '@/locales'

export default function ClientsPage() {
  const { t } = useTranslation()
  const [clients, setClients] = useState<Client[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm(t('clients.messages.confirmDelete'))) {
      try {
        const response = await fetch(`/api/clients/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await fetchClients()
        } else {
          console.error('Erro ao excluir cliente')
        }
      } catch (error) {
        console.error('Erro ao excluir cliente:', error)
      }
    }
  }

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setIsModalOpen(true)
  }

  const handleNewClient = () => {
    setEditingClient(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingClient(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const clientData = {
      name: formData.get('name') as string,
      cpf: formData.get('cpf') as string,
      cnpj: formData.get('cnpj') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      status: formData.get('status') as string,
      address: formData.get('address') as string,
    }

    try {
      const url = editingClient
        ? `/api/clients/${editingClient.id}`
        : '/api/clients'
      const method = editingClient ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      })

      if (response.ok) {
        await fetchClients()
        handleCloseModal()
      } else {
        console.error('Erro ao salvar cliente')
      }
    } catch (error) {
      console.error('Erro ao salvar cliente:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('clients.title')}
        </h1>
        <button
          onClick={handleNewClient}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          {t('clients.addClient')}
        </button>
      </div>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={editingClient ? t('clients.editClient') : t('clients.addClient')}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {t('clients.fields.name')}
              </label>
              <input
                type="text"
                name="name"
                defaultValue={editingClient?.name}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                placeholder={t('clients.fields.name')}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                CPF
              </label>
              <input
                type="text"
                name="cpf"
                defaultValue={editingClient?.cpf}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                placeholder="000.000.000-00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {t('clients.fields.cnpj')}
              </label>
              <input
                type="text"
                name="cnpj"
                defaultValue={editingClient?.cnpj}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                placeholder="00.000.000/0000-00"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {t('clients.fields.phone')}
              </label>
              <input
                type="tel"
                name="phone"
                defaultValue={editingClient?.phone}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                placeholder="(00) 00000-0000"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {t('clients.fields.email')}
              </label>
              <input
                type="email"
                name="email"
                defaultValue={editingClient?.email}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                placeholder="email@exemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {t('clients.fields.status')}
              </label>
              <select
                name="status"
                defaultValue={editingClient?.status || 'ACTIVE'}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
              >
                <option value="ACTIVE">{t('clients.status.active')}</option>
                <option value="INACTIVE">{t('clients.status.inactive')}</option>
                <option value="BLOCKED">{t('clients.status.blocked')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t('table.address')}
            </label>
            <input
              type="text"
              name="address"
              defaultValue={editingClient?.address}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
              placeholder={t('table.completeAddress')}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              {t('forms.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              {editingClient ? t('forms.update') : t('forms.register')}
            </button>
          </div>
        </form>
      </Modal>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  {t('table.name')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                  {t('table.cpfCnpj')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                  {t('table.phone')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  {t('table.email')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                  {t('table.status')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                  {t('table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map(client => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    <div className="max-w-xs truncate" title={client.name}>
                      {client.name}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.cpf || client.cnpj || '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.phone}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    <div
                      className="max-w-xs truncate"
                      title={client.email || '-'}
                    >
                      {client.email || '-'}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        client.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : client.status === 'INACTIVE'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {client.status === 'ACTIVE'
                        ? t('clients.status.active')
                        : client.status === 'INACTIVE'
                          ? t('clients.status.inactive')
                          : t('clients.status.blocked')}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(client)}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
