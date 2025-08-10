'use client'

import { Client } from '@/types'
import { useState, useEffect } from 'react'
import Modal from '@/components/modal'

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      const data = await response.json()
      setClients(data)
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este cliente?')) return

    try {
      await fetch(`/api/clients/${id}`, { method: 'DELETE' })
      fetchClients()
    } catch (error) {
      console.error('Erro ao deletar cliente:', error)
    }
  }

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setShowModal(true)
  }

  const handleNewClient = () => {
    setEditingClient(null)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingClient(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      cpf: formData.get('cpf') as string,
      cnpj: formData.get('cnpj') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      address: formData.get('address') as string,
      status: formData.get('status') as string,
    }

    try {
      const url = editingClient
        ? `/api/clients/${editingClient.id}`
        : '/api/clients'

      const method = editingClient ? 'PUT' : 'POST'

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      handleCloseModal()
      fetchClients()
    } catch (error) {
      console.error('Erro ao salvar cliente:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
        <button
          onClick={handleNewClient}
          className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors duration-200"
        >
          Novo Cliente
        </button>
      </div>

      {/* Modal */}
      <Modal
        open={showModal}
        onClose={handleCloseModal}
        title={editingClient ? 'Editar Cliente' : 'Novo Cliente'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nome/Razão Social
              </label>
              <input
                type="text"
                name="name"
                defaultValue={editingClient?.name}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                placeholder="Nome do cliente"
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
                placeholder="123.456.789-00"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                CNPJ
              </label>
              <input
                type="text"
                name="cnpj"
                defaultValue={editingClient?.cnpj}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                placeholder="12.345.678/0001-90"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Telefone
              </label>
              <input
                type="tel"
                name="phone"
                defaultValue={editingClient?.phone}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                defaultValue={editingClient?.email}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                placeholder="cliente@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Status
              </label>
              <select
                name="status"
                defaultValue={editingClient?.status || 'ACTIVE'}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
              >
                <option value="ACTIVE">Ativo</option>
                <option value="INACTIVE">Inativo</option>
                <option value="BLOCKED">Bloqueado</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Endereço
            </label>
            <input
              type="text"
              name="address"
              defaultValue={editingClient?.address}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
              placeholder="Endereço completo"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              {editingClient ? 'Atualizar' : 'Cadastrar'}
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
                  Nome
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                  CPF/CNPJ
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                  Telefone
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                  Ações
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
                        ? 'Ativo'
                        : client.status === 'INACTIVE'
                          ? 'Inativo'
                          : 'Bloqueado'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(client)}
                        className="text-purple-600 hover:text-purple-900 px-2 py-1 rounded hover:bg-purple-50"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50"
                      >
                        Deletar
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
