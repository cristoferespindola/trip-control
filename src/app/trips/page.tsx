'use client'

import { useState, useEffect } from 'react'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CurrencyDollarIcon,
  MapIcon,
} from '@heroicons/react/24/outline'
import Modal from '@/components/modal'
import Input from '@/components/form/Input'
import StatusTag from '@/components/statusTag'
import TripModal from './TripModal'
import TripViewModal from './TripViewModal'
import ExpenseModal from './ExpenseModal'
import { Trip, Vehicle, Driver, Client } from '@/types'
import { useTranslation } from '@/locales'

export default function TripsPage() {
  const { t } = useTranslation()
  const [trips, setTrips] = useState<Trip[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    startDate: '',
    endDate: '',
  })
  const [showFilters, setShowFilters] = useState(false)

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
        await fetchTrips()
        closeModal()
      } else {
        console.error('Erro ao salvar viagem')
      }
    } catch (error) {
      console.error('Erro ao salvar viagem:', error)
    }
  }

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip)
    openModal()
  }

  const handleDelete = async (id: string) => {
    if (confirm(t('trips.messages.confirmDelete'))) {
      try {
        const response = await fetch(`/api/trips/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await fetchTrips()
        } else {
          console.error('Erro ao excluir viagem')
        }
      } catch (error) {
        console.error('Erro ao excluir viagem:', error)
      }
    }
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTrip(null)
  }

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  }

  const filteredTrips = trips.filter(trip => {
    const matchesSearch =
      filters.search === '' ||
      normalizeText(trip.origin).includes(normalizeText(filters.search)) ||
      normalizeText(trip.destination).includes(normalizeText(filters.search))

    const matchesDateRange =
      filters.startDate === '' ||
      filters.endDate === '' ||
      (trip.departureDate &&
        new Date(trip.departureDate) >= new Date(filters.startDate) &&
        new Date(trip.departureDate) <= new Date(filters.endDate))

    return matchesSearch && matchesDateRange
  })

  const clearFilters = () => {
    setFilters({
      search: '',
      startDate: '',
      endDate: '',
    })
  }

  const handleViewTrip = async (trip: Trip) => {
    setSelectedTrip(trip)
    setIsViewModalOpen(true)
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{t('trips.title')}</h1>
        <button
          onClick={openModal}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          {t('trips.addTrip')}
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder={t('forms.search')}
                  value={filters.search}
                  onChange={e =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  showFilters
                    ? 'bg-orange-50 text-orange-700 border-orange-300'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
              >
                <FunnelIcon className="-ml-1 mr-2 h-5 w-5" />
                {t('forms.filter')}
              </button>
              {showFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  {t('forms.clear')}
                </button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t('filters.startDate')}
                name="filterStartDate"
                type="date"
                value={filters.startDate}
                onChange={e =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
                placeholder=""
              />

              <Input
                label={t('filters.endDate')}
                name="filterEndDate"
                type="date"
                value={filters.endDate}
                onChange={e =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
                placeholder=""
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredTrips.length === 0 && (
          <div className="px-6 py-4">
            <p className="text-gray-500">
              {trips.length === 0
                ? t('trips.messages.noTripsFound')
                : t('trips.messages.noTripsMatchFilters')}
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
                          <StatusTag status={trip.status} />
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
                      title={t('trips.actions.viewTrip')}
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleExpenses(trip)}
                      className="text-gray-400 hover:text-green-600"
                      title={t('trips.actions.manageExpenses')}
                    >
                      <CurrencyDollarIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(trip)}
                      className="text-gray-400 hover:text-gray-600"
                      title={t('trips.actions.editTrip')}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(trip.id)}
                      className="text-gray-400 hover:text-red-600"
                      title={t('trips.actions.deleteTrip')}
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

      {selectedTrip && (
        <>
          <TripViewModal
            open={isViewModalOpen}
            onClose={closeViewModal}
            trip={selectedTrip}
          />

          <ExpenseModal
            open={isExpenseModalOpen}
            onClose={closeExpenseModal}
            trip={selectedTrip}
          />
        </>
      )}
    </div>
  )
}
