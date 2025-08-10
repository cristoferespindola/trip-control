'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/modal'
import { Trip, Vehicle, Driver, Client } from '@/types'
import Select from '@/components/form/Select'
import Input from '@/components/form/Input'
import TextArea from '@/components/form/TextArea'
import CitySelect from '@/components/cities'

interface TripModalProps {
  open: boolean
  onClose: () => void
  editingTrip: Trip | null
  vehicles: Vehicle[]
  drivers: Driver[]
  clients: Client[]
  onSubmit: (formData: any) => Promise<void>
}

export default function TripModal({
  open,
  onClose,
  editingTrip,
  vehicles,
  drivers,
  clients,
  onSubmit,
}: TripModalProps) {
  const [formData, setFormData] = useState({
    vehicleId: '',
    driverId: '',
    clientId: '',
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    initialKilometer: '',
    finalKilometer: '',
    status: 'SCHEDULED' as
      | 'SCHEDULED'
      | 'IN_PROGRESS'
      | 'COMPLETED'
      | 'CANCELLED',
    notes: '',
  })

  useEffect(() => {
    const formatDate = (date: string | Date) => {
      try {
        return new Date(date).toISOString().split('T')[0]
      } catch (error) {
        console.error('Error formatting date:', error)
        return ''
      }
    }

    if (editingTrip) {
      setFormData({
        vehicleId: editingTrip.vehicleId,
        driverId: editingTrip.driverId,
        clientId: editingTrip.clientId,
        origin: editingTrip.origin,
        destination: editingTrip.destination,
        departureDate: formatDate(editingTrip.departureDate),
        returnDate: editingTrip.returnDate
          ? formatDate(editingTrip.returnDate)
          : '',
        initialKilometer: editingTrip.initialKilometer?.toString() || '',
        finalKilometer: editingTrip.finalKilometer?.toString() || '',
        status: editingTrip.status,
        notes: editingTrip.notes || '',
      })
    } else {
      resetForm()
    }
  }, [editingTrip?.id])

  const resetForm = () => {
    setFormData({
      vehicleId: '',
      driverId: '',
      clientId: '',
      origin: '',
      destination: '',
      departureDate: '',
      returnDate: '',
      initialKilometer: '',
      finalKilometer: '',
      status: 'SCHEDULED',
      notes: '',
    })
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
    handleClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
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
          <CitySelect
            label="Origem"
            name="origin"
            value={formData.origin}
            onChange={value => setFormData({ ...formData, origin: value })}
            placeholder="Digite a cidade de origem"
            required
          />
        </div>

        <div>
          <CitySelect
            label="Destino"
            name="destination"
            value={formData.destination}
            onChange={value => setFormData({ ...formData, destination: value })}
            placeholder="Digite a cidade de destino"
            required
          />
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
            required
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
            required={false}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Kilometragem Inicial"
            name="initialKilometer"
            type="number"
            value={formData.initialKilometer}
            onChange={e =>
              setFormData({ ...formData, initialKilometer: e.target.value })
            }
            placeholder="0"
            required={false}
          />

          <Input
            label="Kilometragem Final"
            name="finalKilometer"
            type="number"
            value={formData.finalKilometer}
            onChange={e =>
              setFormData({ ...formData, finalKilometer: e.target.value })
            }
            placeholder="0"
            required={false}
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
            onClick={handleClose}
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
  )
}
