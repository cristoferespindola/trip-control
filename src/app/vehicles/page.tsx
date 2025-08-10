'use client'

import { Vehicle } from '@/types'
import { useState, useEffect } from 'react'
import Modal from '@/components/modal'

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles')
      const data = await response.json()
      setVehicles(data)
    } catch (error) {
      console.error('Erro ao buscar veículos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este veículo?')) return

    try {
      await fetch(`/api/vehicles/${id}`, { method: 'DELETE' })
      fetchVehicles()
    } catch (error) {
      console.error('Erro ao deletar veículo:', error)
    }
  }

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setShowModal(true)
  }

  const handleNewVehicle = () => {
    setEditingVehicle(null)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingVehicle(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      plate: formData.get('plate') as string,
      model: formData.get('model') as string,
      brand: formData.get('brand') as string,
      year: formData.get('year') as string,
      capacity: formData.get('capacity') as string,
      status: formData.get('status') as string
    }

    try {
      const url = editingVehicle 
        ? `/api/vehicles/${editingVehicle.id}`
        : '/api/vehicles'
      
      const method = editingVehicle ? 'PUT' : 'POST'
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      handleCloseModal()
      fetchVehicles()
    } catch (error) {
      console.error('Erro ao salvar veículo:', error)
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
          <h1 className="text-3xl font-bold text-gray-900">Veículos</h1>
          <button
            onClick={handleNewVehicle}
            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors duration-200"
          >
            Novo Veículo
          </button>
        </div>

        {/* Modal */}
        <Modal
          open={showModal}
          onClose={handleCloseModal}
          title={editingVehicle ? 'Editar Veículo' : 'Novo Veículo'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Placa</label>
                <input
                  type="text"
                  name="plate"
                  defaultValue={editingVehicle?.plate}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                  placeholder="ABC-1234"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Modelo</label>
                <input
                  type="text"
                  name="model"
                  defaultValue={editingVehicle?.model}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                  placeholder="Sprinter"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Marca</label>
                <input
                  type="text"
                  name="brand"
                  defaultValue={editingVehicle?.brand}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                  placeholder="Mercedes-Benz"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Ano</label>
                <input
                  type="number"
                  name="year"
                  defaultValue={editingVehicle?.year}
                  required
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                  placeholder="2023"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Capacidade (kg)</label>
                <input
                  type="number"
                  name="capacity"
                  defaultValue={editingVehicle?.capacity}
                  required
                  min="1"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                  placeholder="1000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Status</label>
                <select
                  name="status"
                  defaultValue={editingVehicle?.status || 'ACTIVE'}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                >
                  <option value="ACTIVE">Ativo</option>
                  <option value="INACTIVE">Inativo</option>
                  <option value="MAINTENANCE">Manutenção</option>
                </select>
              </div>
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
                {editingVehicle ? 'Atualizar' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </Modal>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                    Placa
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                    Modelo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                    Marca
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                    Ano
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                    Capacidade
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
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {vehicle.plate}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <div className="max-w-xs truncate" title={vehicle.model}>
                        {vehicle.model}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <div className="max-w-xs truncate" title={vehicle.brand}>
                        {vehicle.brand}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.year}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.capacity}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        vehicle.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        vehicle.status === 'INACTIVE' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {vehicle.status === 'ACTIVE' ? 'Ativo' :
                         vehicle.status === 'INACTIVE' ? 'Inativo' : 'Manutenção'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(vehicle)}
                          className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(vehicle.id)}
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