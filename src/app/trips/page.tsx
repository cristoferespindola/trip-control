'use client'

import { useState, useEffect } from 'react'
import { TruckIcon, UserGroupIcon, BuildingOfficeIcon, MapIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import Modal from '@/components/modal'
import { Trip, Vehicle, Driver, Client, City } from '@/types'

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [cities, setCities] = useState<City[]>([])
  const [isLoadingCities, setIsLoadingCities] = useState(false)

  const [formData, setFormData] = useState({
    vehicleId: '',
    driverId: '',
    clientId: '',
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    status: 'SCHEDULED' as const,
    notes: ''
  })

  useEffect(() => {
    fetchTrips()
    fetchVehicles()
    fetchDrivers()
    fetchClients()
  }, [])

  const fetchTrips = async () => {
    try {
      const response = await fetch('/api/trips')
      if (response.ok) {
        const data = await response.json()
        setTrips(data)
      }
    } catch (error) {
      console.error('Erro ao buscar viagens:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles')
      if (response.ok) {
        const data = await response.json()
        setVehicles(data)
      }
    } catch (error) {
      console.error('Erro ao buscar veículos:', error)
    }
  }

  const fetchDrivers = async () => {
    try {
      const response = await fetch('/api/drivers')
      if (response.ok) {
        const data = await response.json()
        setDrivers(data)
      }
    } catch (error) {
      console.error('Erro ao buscar motoristas:', error)
    }
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingTrip ? `/api/trips/${editingTrip.id}` : '/api/trips'
      const method = editingTrip ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsModalOpen(false)
        setEditingTrip(null)
        resetForm()
        fetchTrips()
      } else {
        const error = await response.json()
        alert(`Erro: ${error.message}`)
      }
    } catch (error) {
      console.error('Erro ao salvar viagem:', error)
      alert('Erro ao salvar viagem')
    }
  }

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip)
    setFormData({
      vehicleId: trip.vehicleId,
      driverId: trip.driverId,
      clientId: trip.clientId,
      origin: trip.origin,
      destination: trip.destination,
      departureDate: trip.departureDate.split('T')[0],
      returnDate: trip.returnDate ? trip.returnDate.split('T')[0] : '',
      status: trip.status,
      notes: trip.notes || ''
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta viagem?')) return

    try {
      const response = await fetch(`/api/trips/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchTrips()
      } else {
        const error = await response.json()
        alert(`Erro: ${error.message}`)
      }
    } catch (error) {
      console.error('Erro ao excluir viagem:', error)
      alert('Erro ao excluir viagem')
    }
  }

  const resetForm = () => {
    setFormData({
      vehicleId: '',
      driverId: '',
      clientId: '',
      origin: '',
      destination: '',
      departureDate: '',
      returnDate: '',
      status: 'SCHEDULED',
      notes: ''
    })
  }

  const openModal = () => {
    setEditingTrip(null)
    resetForm()
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTrip(null)
    resetForm()
  }

  const normalizeText = (text: string) => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
  }

  const searchCities = async (query: string) => {
    if (query.length < 2) {
      setCities([])
      return
    }

    setIsLoadingCities(true)
    try {
      const response = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/municipios?nome=${encodeURIComponent(query)}`
      )
      
      if (response.ok) {
        const data = await response.json()
        const filteredCities = filterCities(data, query)
        setCities(filteredCities.slice(0, 10))
      } else {
        setCities([])
      }
    } catch (error) {
      console.error('Erro ao buscar cidades:', error)
      setCities([])
    } finally {
      setIsLoadingCities(false)
    }
  }

  const filterCities = (cities: any[], query: string) => {
    const normalizedQuery = normalizeText(query)
    
    return cities
      .filter((city: any) => {
        const cityName = normalizeText(city.nome)
        const stateName = normalizeText(city.microrregiao?.mesorregiao?.UF?.nome || '')
        return cityName.includes(normalizedQuery) || stateName.includes(normalizedQuery)
      })
      .sort((a: any, b: any) => {
        const aName = normalizeText(a.nome)
        const bName = normalizeText(b.nome)
        const aStartsWithQuery = aName.startsWith(normalizedQuery)
        const bStartsWithQuery = bName.startsWith(normalizedQuery)
        
        if (aStartsWithQuery && !bStartsWithQuery) return -1
        if (!aStartsWithQuery && bStartsWithQuery) return 1
        return aName.localeCompare(bName)
      })
  }

  const formatCityName = (city: City) => {
    const stateName = city.microrregiao?.mesorregiao?.UF?.nome || ''
    return `${city.nome} - ${stateName}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800'
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'Agendada'
      case 'IN_PROGRESS': return 'Em Andamento'
      case 'COMPLETED': return 'Concluída'
      case 'CANCELLED': return 'Cancelada'
      default: return status
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Viagens</h1>
          <p className="text-gray-600">Gerencie as viagens da sua frota</p>
        </div>
        <button
          onClick={openModal}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Nova Viagem
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {trips.map((trip) => {
            const vehicle = vehicles.find(v => v.id === trip.vehicleId)
            const driver = drivers.find(d => d.id === trip.driverId)
            const client = clients.find(c => c.id === trip.clientId)
            
            return (
              <li key={trip.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <MapIcon className="h-5 w-5 text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {trip.origin} → {trip.destination}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{vehicle?.plate} • {driver?.name} • {client?.name}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                            {getStatusText(trip.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(trip.departureDate).toLocaleDateString('pt-BR')}
                          {trip.returnDate && ` - ${new Date(trip.returnDate).toLocaleDateString('pt-BR')}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(trip)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(trip.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={editingTrip ? 'Editar Viagem' : 'Nova Viagem'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Veículo
              </label>
              <select
                value={formData.vehicleId}
                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                required
              >
                <option value="">Selecione um veículo</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.plate} - {vehicle.brand} {vehicle.model}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motorista
              </label>
              <select
                value={formData.driverId}
                onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                required
              >
                <option value="">Selecione um motorista</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente
              </label>
              <select
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                required
              >
                <option value="">Selecione um cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                required
              >
                <option value="SCHEDULED">Agendada</option>
                <option value="IN_PROGRESS">Em Andamento</option>
                <option value="COMPLETED">Concluída</option>
                <option value="CANCELLED">Cancelada</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Origem
            </label>
            <input
              type="text"
              value={formData.origin}
              onChange={(e) => {
                setFormData({ ...formData, origin: e.target.value })
                searchCities(e.target.value)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Digite a cidade de origem"
              required
            />
            {cities.length > 0 && (
              <div className="mt-1 border border-gray-300 rounded-md max-h-40 overflow-y-auto">
                {cities.map((city, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, origin: formatCityName(city) })
                      setCities([])
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                  >
                    {formatCityName(city)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destino
            </label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => {
                setFormData({ ...formData, destination: e.target.value })
                searchCities(e.target.value)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Digite a cidade de destino"
              required
            />
            {cities.length > 0 && (
              <div className="mt-1 border border-gray-300 rounded-md max-h-40 overflow-y-auto">
                {cities.map((city, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, destination: formatCityName(city) })
                      setCities([])
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                  >
                    {formatCityName(city)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Partida
              </label>
              <input
                type="date"
                value={formData.departureDate}
                onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Retorno
              </label>
              <input
                type="date"
                value={formData.returnDate}
                onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Observações sobre a viagem"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              {editingTrip ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
} 