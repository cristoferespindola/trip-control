'use client'

import { getCities } from '@/models/cities'
import { City, Client, Driver, Trip, Vehicle } from '@/types'
import { useState, useEffect } from 'react'
import Modal from '@/components/modal'

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [cities, setCities] = useState<City[]>([])
  const [filteredCities, setFilteredCities] = useState<City[]>([])
  const [showOriginDropdown, setShowOriginDropdown] = useState(false)
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false)
  const [originSearch, setOriginSearch] = useState('')
  const [destinationSearch, setDestinationSearch] = useState('')

  useEffect(() => {
    fetchData()
    getCities().then(response => {
      setCities(response.data)
    })
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.city-dropdown')) {
        setShowOriginDropdown(false)
        setShowDestinationDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s]/g, '') // Remove caracteres especiais
      .trim()
  }

  const fetchData = async () => {
    try {
      const [tripsRes, vehiclesRes, driversRes, clientsRes] = await Promise.all([
        fetch('/api/trips'),
        fetch('/api/vehicles'),
        fetch('/api/drivers'),
        fetch('/api/clients')
      ])
      
      const tripsData = await tripsRes.json()
      const vehiclesData = await vehiclesRes.json()
      const driversData = await driversRes.json()
      const clientsData = await clientsRes.json()
      
      setTrips(tripsData)
      setVehicles(vehiclesData)
      setDrivers(driversData)
      setClients(clientsData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCityName = (city: City) => {
    if (!city || !city.microrregiao || !city.microrregiao.mesorregiao || !city.microrregiao.mesorregiao.UF) {
      return city?.nome || 'Cidade desconhecida'
    }
    return `${city.nome} - ${city.microrregiao.mesorregiao.UF.sigla}`
  }

  const filterCities = (search: string, setFiltered: (cities: City[]) => void) => {
    if (search.length < 2) {
      setFiltered([])
      return
    }
    
    const normalizedSearch = normalizeText(search)
    const filtered = cities.filter(city => {
      if (!city || !city.nome) return false
      
      const cityName = normalizeText(city.nome)
      const searchTerm = normalizedSearch
      
      // Busca por nome da cidade
      if (cityName.includes(searchTerm)) return true
      
      // Busca por estado (se disponível)
      if (city.microrregiao?.mesorregiao?.UF?.nome) {
        const stateName = normalizeText(city.microrregiao.mesorregiao.UF.nome)
        if (stateName.includes(searchTerm)) return true
      }
      
      // Busca por sigla do estado (se disponível)
      if (city.microrregiao?.mesorregiao?.UF?.sigla) {
        const stateSigla = normalizeText(city.microrregiao.mesorregiao.UF.sigla)
        if (stateSigla.includes(searchTerm)) return true
      }
      
      return false
    }).slice(0, 10)
    
    setFiltered(filtered)
  }

  const handleOriginSearch = (value: string) => {
    setOriginSearch(value)
    filterCities(value, setFilteredCities)
    setShowOriginDropdown(true)
  }

  const handleDestinationSearch = (value: string) => {
    setDestinationSearch(value)
    filterCities(value, setFilteredCities)
    setShowDestinationDropdown(true)
  }

  const selectOrigin = (city: City) => {
    setOriginSearch(formatCityName(city))
    setShowOriginDropdown(false)
  }

  const selectDestination = (city: City) => {
    setDestinationSearch(formatCityName(city))
    setShowDestinationDropdown(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta viagem?')) return

    try {
      await fetch(`/api/trips/${id}`, { method: 'DELETE' })
      fetchData()
    } catch (error) {
      console.error('Erro ao deletar viagem:', error)
    }
  }

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip)
    setOriginSearch(trip.origin)
    setDestinationSearch(trip.destination)
    setShowModal(true)
  }

  const handleNewTrip = () => {
    setEditingTrip(null)
    setOriginSearch('')
    setDestinationSearch('')
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingTrip(null)
    setOriginSearch('')
    setDestinationSearch('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      origin: originSearch,
      destination: destinationSearch,
      departureDate: formData.get('departureDate') as string,
      returnDate: formData.get('returnDate') as string,
      distance: formData.get('distance') as string,
      fuelCost: formData.get('fuelCost') as string,
      tollCost: formData.get('tollCost') as string,
      otherCosts: formData.get('otherCosts') as string,
      status: formData.get('status') as string,
      notes: formData.get('notes') as string,
      vehicleId: formData.get('vehicleId') as string,
      driverId: formData.get('driverId') as string,
      clientId: formData.get('clientId') as string
    }

    try {
      const url = editingTrip 
        ? `/api/trips/${editingTrip.id}`
        : '/api/trips'
      
      const method = editingTrip ? 'PUT' : 'POST'
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      handleCloseModal()
      fetchData()
    } catch (error) {
      console.error('Erro ao salvar viagem:', error)
    }
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('pt-BR')
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
          <h1 className="text-3xl font-bold text-gray-900">Viagens</h1>
          <button
            onClick={handleNewTrip}
            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors duration-200"
          >
            Nova Viagem
          </button>
        </div>

        {/* Modal */}
        <Modal
          open={showModal}
          onClose={handleCloseModal}
          title={editingTrip ? 'Editar Viagem' : 'Nova Viagem'}
          size="xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative city-dropdown">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Origem</label>
                <input
                  type="text"
                  value={originSearch}
                  onChange={(e) => handleOriginSearch(e.target.value)}
                  onFocus={() => setShowOriginDropdown(true)}
                  placeholder="Digite para buscar cidade..."
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900 placeholder-gray-500"
                />
                {showOriginDropdown && filteredCities.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredCities.map((city) => (
                      <div
                        key={city.id}
                        onClick={() => selectOrigin(city)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-900"
                      >
                        {formatCityName(city)}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative city-dropdown">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Destino</label>
                <input
                  type="text"
                  value={destinationSearch}
                  onChange={(e) => handleDestinationSearch(e.target.value)}
                  onFocus={() => setShowDestinationDropdown(true)}
                  placeholder="Digite para buscar cidade..."
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900 placeholder-gray-500"
                />
                {showDestinationDropdown && filteredCities.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredCities.map((city) => (
                      <div
                        key={city.id}
                        onClick={() => selectDestination(city)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-900"
                      >
                        {formatCityName(city)}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Data de Partida</label>
                <input
                  type="datetime-local"
                  name="departureDate"
                  defaultValue={editingTrip?.departureDate ? new Date(editingTrip.departureDate).toISOString().slice(0, 16) : ''}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Data de Retorno</label>
                <input
                  type="datetime-local"
                  name="returnDate"
                  defaultValue={editingTrip?.returnDate ? new Date(editingTrip.returnDate).toISOString().slice(0, 16) : ''}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Veículo</label>
                <select
                  name="vehicleId"
                  defaultValue={editingTrip?.vehicleId || ''}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
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
                <label className="block text-sm font-semibold text-gray-900 mb-2">Motorista</label>
                <select
                  name="driverId"
                  defaultValue={editingTrip?.driverId || ''}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
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
                <label className="block text-sm font-semibold text-gray-900 mb-2">Cliente</label>
                <select
                  name="clientId"
                  defaultValue={editingTrip?.clientId || ''}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
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
                <label className="block text-sm font-semibold text-gray-900 mb-2">Status</label>
                <select
                  name="status"
                  defaultValue={editingTrip?.status || 'SCHEDULED'}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                >
                  <option value="SCHEDULED">Agendada</option>
                  <option value="IN_PROGRESS">Em Andamento</option>
                  <option value="COMPLETED">Concluída</option>
                  <option value="CANCELLED">Cancelada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Distância (km)</label>
                <input
                  type="number"
                  name="distance"
                  defaultValue={editingTrip?.distance || ''}
                  min="0"
                  step="0.1"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Custo Combustível (R$)</label>
                <input
                  type="number"
                  name="fuelCost"
                  defaultValue={editingTrip?.fuelCost || ''}
                  min="0"
                  step="0.01"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Custo Pedágio (R$)</label>
                <input
                  type="number"
                  name="tollCost"
                  defaultValue={editingTrip?.tollCost || ''}
                  min="0"
                  step="0.01"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Outros Custos (R$)</label>
                <input
                  type="number"
                  name="otherCosts"
                  defaultValue={editingTrip?.otherCosts || ''}
                  min="0"
                  step="0.01"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Observações</label>
              <textarea
                name="notes"
                defaultValue={editingTrip?.notes || ''}
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                placeholder="Observações sobre a viagem..."
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
                {editingTrip ? 'Atualizar' : 'Cadastrar'}
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
                  Origem → Destino
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                  Data Partida
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Veículo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                  Motorista
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Cliente
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trips.map((trip) => (
                <tr key={trip.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    <div className="max-w-xs truncate" title={`${trip.origin} → ${trip.destination}`}>
                      {trip.origin} → {trip.destination}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(trip.departureDate)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    <div className="max-w-xs truncate" title={`${trip.vehicle?.plate} - ${trip.vehicle?.brand} ${trip.vehicle?.model}`}>
                      {trip.vehicle?.plate} - {trip.vehicle?.brand} {trip.vehicle?.model}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    <div className="max-w-xs truncate" title={trip.driver?.name}>
                      {trip.driver?.name}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    <div className="max-w-xs truncate" title={trip.client?.name}>
                      {trip.client?.name}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(trip.status)}`}>
                      {getStatusText(trip.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(trip)}
                        className="text-orange-600 hover:text-orange-900 px-2 py-1 rounded hover:bg-orange-50"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(trip.id)}
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