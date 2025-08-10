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
} from '@heroicons/react/24/outline'
import Modal from '@/components/modal'
import { Trip, Vehicle, Driver, Client, City } from '@/types'
import Select from '@/components/form/Select'
import Input from '@/components/form/Input'
import TextArea from '../../components/form/TextArea'
import { useAuth } from '@/contexts/AuthContext'

export default function TripsPage() {
  const { user } = useAuth()
  const [trips, setTrips] = useState<Trip[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [originCities, setOriginCities] = useState<City[]>([])
  const [destinationCities, setDestinationCities] = useState<City[]>([])
  const [isLoadingCities, setIsLoadingCities] = useState(false)

  const [formData, setFormData] = useState({
    vehicleId: '',
    driverId: '',
    clientId: '',
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    status: 'SCHEDULED' as
      | 'SCHEDULED'
      | 'IN_PROGRESS'
      | 'COMPLETED'
      | 'CANCELLED',
    notes: '',
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

    if (!user) {
      alert('Usuário não autenticado')
      return
    }

    try {
      const url = editingTrip ? `/api/trips/${editingTrip.id}` : '/api/trips'
      const method = editingTrip ? 'PUT' : 'POST'

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
      departureDate: trip.departureDate.toISOString().split('T')[0],
      returnDate: trip.returnDate
        ? trip.returnDate.toISOString().split('T')[0]
        : '',
      status: trip.status,
      notes: trip.notes || '',
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
      notes: '',
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

  const searchCities = async (
    query: string,
    field: 'origin' | 'destination'
  ) => {
    if (query.length < 2) {
      if (field === 'origin') {
        setOriginCities([])
      } else {
        setDestinationCities([])
      }
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
        const citiesToSet = filteredCities.slice(0, 10)

        if (field === 'origin') {
          setOriginCities(citiesToSet)
        } else {
          setDestinationCities(citiesToSet)
        }
      } else {
        if (field === 'origin') {
          setOriginCities([])
        } else {
          setDestinationCities([])
        }
      }
    } catch (error) {
      console.error('Erro ao buscar cidades:', error)
      if (field === 'origin') {
        setOriginCities([])
      } else {
        setDestinationCities([])
      }
    } finally {
      setIsLoadingCities(false)
    }
  }

  const filterCities = (cities: any[], query: string) => {
    const normalizedQuery = normalizeText(query)

    return cities
      .filter((city: any) => {
        const cityName = normalizeText(city.nome)
        const stateName = normalizeText(
          city.microrregiao?.mesorregiao?.UF?.nome || ''
        )
        return (
          cityName.includes(normalizedQuery) ||
          stateName.includes(normalizedQuery)
        )
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
        {trips.length === 0 && (
          <div className="px-6 py-4">
            <p className="text-gray-500">Nenhuma viagem encontrada</p>
          </div>
        )}
        <ul className="divide-y divide-gray-200">
          {trips.map(trip => {
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
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Veículo"
              name="vehicleId"
              options={vehicles.map(vehicle => ({
                id: vehicle.id,
                name: vehicle.plate,
              }))}
              value={formData.vehicleId}
              required
              onChange={e =>
                setFormData({ ...formData, vehicleId: e.target.value })
              }
            />

            <Select
              label="Motorista"
              name="driverId"
              options={drivers.map(driver => ({
                id: driver.id,
                name: driver.name,
              }))}
              value={formData.driverId}
              required
              onChange={e =>
                setFormData({ ...formData, driverId: e.target.value })
              }
            />

            <Select
              label="Cliente"
              name="clientId"
              options={clients.map(client => ({
                id: client.id,
                name: client.name,
              }))}
              value={formData.clientId}
              required
              onChange={e =>
                setFormData({ ...formData, clientId: e.target.value })
              }
            />

            <Select
              label="Status"
              name="status"
              options={[
                { id: 'SCHEDULED', name: 'Agendada' },
                { id: 'IN_PROGRESS', name: 'Em Andamento' },
                { id: 'COMPLETED', name: 'Concluída' },
                { id: 'CANCELLED', name: 'Cancelada' },
              ]}
              value={formData.status}
              required
              onChange={e =>
                setFormData({ ...formData, status: e.target.value as any })
              }
            />
          </div>

          <div>
            <Input
              label="Origem"
              name="origin"
              type="text"
              value={formData.origin}
              onChange={e => {
                setFormData({ ...formData, origin: e.target.value })
                searchCities(e.target.value, 'origin')
              }}
              placeholder="Digite a cidade de origem"
            />
            {originCities.length > 0 && (
              <div className="mt-1 border border-gray-300 text-gray-700 rounded-md max-h-40 overflow-y-auto">
                {originCities.map((city, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, origin: formatCityName(city) })
                      setOriginCities([])
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
            <Input
              label="Destino"
              name="destination"
              type="text"
              value={formData.destination}
              onChange={e => {
                setFormData({ ...formData, destination: e.target.value })
                searchCities(e.target.value, 'destination')
              }}
              placeholder="Digite a cidade de destino"
            />
            {destinationCities.length > 0 && (
              <div className="mt-1 border border-gray-300 text-gray-700 rounded-md max-h-40 overflow-y-auto">
                {destinationCities.map((city, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        destination: formatCityName(city),
                      })
                      setDestinationCities([])
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
            <Input
              label="Data de Partida"
              name="departureDate"
              type="date"
              value={formData.departureDate}
              onChange={e =>
                setFormData({ ...formData, departureDate: e.target.value })
              }
              placeholder=""
            />

            <Input
              label="Data de Retorno"
              name="returnDate"
              type="date"
              value={formData.returnDate}
              onChange={e =>
                setFormData({ ...formData, returnDate: e.target.value })
              }
              placeholder=""
            />
          </div>

          <TextArea
            label="Observações"
            name="notes"
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            placeholder="Observações sobre a viagem"
            required={false}
          />

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
