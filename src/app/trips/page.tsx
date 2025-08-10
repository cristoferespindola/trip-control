'use client'

import { useState, useEffect } from 'react'
import {
  TruckIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  MapIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'
import { Trip, Vehicle, Driver, Client, City } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import TripModal from './TripModal'
import ExpenseModal from './ExpenseModal'
import TripViewModal from './TripViewModal'
import Input from '../../components/form/Input'
import Select from '../../components/form/Select'
import CitySelect from '../../components/cities'

export default function TripsPage() {
  const { user } = useAuth()
  const [trips, setTrips] = useState<Trip[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [filters, setFilters] = useState({
    origin: '',
    destination: '',
    clientId: '',
    status: '',
    vehicleId: '',
    driverId: '',
    startDate: '',
    endDate: '',
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

  const handleSubmit = async (formData: any) => {
    if (!user) {
      alert('Usuário não autenticado')
      return
    }

    try {
      const url = editingTrip ? `/api/trips/${editingTrip.id}` : '/api/trips'
      const method = editingTrip ? 'PUT' : 'POST'

      console.log(user)

      const tripData = {
        ...formData,
        userId: user.id,
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      })

      if (response.ok) {
        setIsModalOpen(false)
        setEditingTrip(null)
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

  const openModal = () => {
    setEditingTrip(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTrip(null)
  }

  const normalizeText = (text: string) => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'Agendada'
      case 'IN_PROGRESS':
        return 'Em Andamento'
      case 'COMPLETED':
        return 'Concluída'
      case 'CANCELLED':
        return 'Cancelada'
      default:
        return status
    }
  }

  const filteredTrips = trips.filter(trip => {
    const vehicle = vehicles.find(v => v.id === trip.vehicleId)
    const driver = drivers.find(d => d.id === trip.driverId)
    const client = clients.find(c => c.id === trip.clientId)

    // Filtro por origem
    if (filters.origin) {
      const normalizedOrigin = normalizeText(trip.origin)
      const normalizedFilterOrigin = normalizeText(filters.origin)
      if (!normalizedOrigin.includes(normalizedFilterOrigin)) {
        return false
      }
    }

    // Filtro por destino
    if (filters.destination) {
      const normalizedDestination = normalizeText(trip.destination)
      const normalizedFilterDestination = normalizeText(filters.destination)
      if (!normalizedDestination.includes(normalizedFilterDestination)) {
        return false
      }
    }

    // Filtro por cliente
    if (filters.clientId && trip.clientId !== filters.clientId) {
      return false
    }

    // Filtro por status
    if (filters.status && trip.status !== filters.status) {
      return false
    }

    // Filtro por veículo
    if (filters.vehicleId && trip.vehicleId !== filters.vehicleId) {
      return false
    }

    // Filtro por motorista
    if (filters.driverId && trip.driverId !== filters.driverId) {
      return false
    }

    // Filtro por data de início
    if (filters.startDate) {
      const tripDate = new Date(trip.departureDate)
      const startDate = new Date(filters.startDate)
      if (tripDate < startDate) {
        return false
      }
    }

    // Filtro por data de fim
    if (filters.endDate) {
      const tripDate = new Date(trip.departureDate)
      const endDate = new Date(filters.endDate)
      if (tripDate > endDate) {
        return false
      }
    }

    return true
  })

  const clearFilters = () => {
    setFilters({
      origin: '',
      destination: '',
      clientId: '',
      status: '',
      vehicleId: '',
      driverId: '',
      startDate: '',
      endDate: '',
    })
  }

  const handleViewTrip = async (trip: Trip) => {
    try {
      const response = await fetch(`/api/trips/${trip.id}/expenses`)
      if (response.ok) {
        const tripWithExpenses = await response.json()
        setSelectedTrip(tripWithExpenses)
        setIsViewModalOpen(true)
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da viagem:', error)
    }
  }

  const handleExpenses = (trip: Trip) => {
    setSelectedTrip(trip)
    setIsExpenseModalOpen(true)
  }

  const closeExpenseModal = () => {
    setIsExpenseModalOpen(false)
    setSelectedTrip(null)
  }

  const closeViewModal = () => {
    setIsViewModalOpen(false)
    setSelectedTrip(null)
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
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            {showFilters ? 'Ocultar Filtros' : 'Filtros'}
          </button>
          {Object.values(filters).some(value => value !== '') && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Limpar
            </button>
          )}
        </div>
        <button
          onClick={openModal}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Nova Viagem
        </button>
      </div>

      {showFilters && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <CitySelect
              label="Origem"
              name="filterOrigin"
              value={filters.origin}
              onChange={value => setFilters({ ...filters, origin: value })}
              placeholder="Filtrar por origem"
            />

            <CitySelect
              label="Destino"
              name="filterDestination"
              value={filters.destination}
              onChange={value => setFilters({ ...filters, destination: value })}
              placeholder="Filtrar por destino"
            />

            <Select
              label="Cliente"
              name="filterClient"
              options={[
                { id: '', name: 'Todos os clientes' },
                ...clients.map(client => ({
                  id: client.id,
                  name: client.name,
                })),
              ]}
              value={filters.clientId}
              required={false}
              onChange={e =>
                setFilters({ ...filters, clientId: e.target.value })
              }
            />

            <Select
              label="Status"
              name="filterStatus"
              options={[
                { id: '', name: 'Todos os status' },
                { id: 'SCHEDULED', name: 'Agendada' },
                { id: 'IN_PROGRESS', name: 'Em Andamento' },
                { id: 'COMPLETED', name: 'Concluída' },
                { id: 'CANCELLED', name: 'Cancelada' },
              ]}
              value={filters.status}
              required={false}
              onChange={e => setFilters({ ...filters, status: e.target.value })}
            />

            <Select
              label="Veículo"
              name="filterVehicle"
              options={[
                { id: '', name: 'Todos os veículos' },
                ...vehicles.map(vehicle => ({
                  id: vehicle.id,
                  name: vehicle.plate,
                })),
              ]}
              value={filters.vehicleId}
              required={false}
              onChange={e =>
                setFilters({ ...filters, vehicleId: e.target.value })
              }
            />

            <Select
              label="Motorista"
              name="filterDriver"
              options={[
                { id: '', name: 'Todos os motoristas' },
                ...drivers.map(driver => ({
                  id: driver.id,
                  name: driver.name,
                })),
              ]}
              value={filters.driverId}
              required={false}
              onChange={e =>
                setFilters({ ...filters, driverId: e.target.value })
              }
            />

            <Input
              label="Data Início"
              name="filterStartDate"
              type="date"
              value={filters.startDate}
              onChange={e =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              placeholder=""
            />

            <Input
              label="Data Fim"
              name="filterEndDate"
              type="date"
              value={filters.endDate}
              onChange={e =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              placeholder=""
            />
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredTrips.length === 0 && (
          <div className="px-6 py-4">
            <p className="text-gray-500">
              {trips.length === 0
                ? 'Nenhuma viagem encontrada'
                : 'Nenhuma viagem corresponde aos filtros aplicados'}
            </p>
          </div>
        )}
        <ul className="divide-y divide-gray-200">
          {filteredTrips.map(trip => {
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
                          <span>
                            {vehicle?.plate} • {driver?.name} • {client?.name}
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}
                          >
                            {getStatusText(trip.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(trip.departureDate).toLocaleDateString(
                            'pt-BR'
                          )}
                          {trip.returnDate &&
                            ` - ${new Date(trip.returnDate).toLocaleDateString('pt-BR')}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewTrip(trip)}
                      className="text-gray-400 hover:text-blue-600"
                      title="Visualizar viagem"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleExpenses(trip)}
                      className="text-gray-400 hover:text-green-600"
                      title="Gerenciar despesas"
                    >
                      <CurrencyDollarIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(trip)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Editar viagem"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(trip.id)}
                      className="text-gray-400 hover:text-red-600"
                      title="Excluir viagem"
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

      <TripModal
        open={isModalOpen}
        onClose={closeModal}
        editingTrip={editingTrip}
        vehicles={vehicles}
        drivers={drivers}
        clients={clients}
        onSubmit={handleSubmit}
      />

      <ExpenseModal
        open={isExpenseModalOpen}
        onClose={closeExpenseModal}
        trip={selectedTrip}
      />

      <TripViewModal
        open={isViewModalOpen}
        onClose={closeViewModal}
        trip={selectedTrip}
      />
    </div>
  )
}
