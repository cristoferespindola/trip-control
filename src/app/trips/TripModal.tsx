'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/modal'
import Input from '@/components/form/Input'
import Select from '@/components/form/Select'
import TextArea from '@/components/form/TextArea'
import { Trip, Vehicle, Driver, Client } from '@/types'
import { useTranslation } from '@/locales'
import CitySelect from '@/components/cities'
import { useAuth } from '../../contexts/AuthContext'

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
  const { t } = useTranslation()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    vehicleId: '',
    driverId: '',
    clientId: '',
    userId: user?.id || '',
    departureDate: '',
    returnDate: '',
    initialKilometer: '',
    finalKilometer: '',
    tripValue: '',
    notes: '',
  })

  useEffect(() => {
    if (editingTrip) {
      const formatDate = (date: string | Date) => {
        if (!date) return ''
        const d = new Date(date)
        return d.toISOString().split('T')[0]
      }

      setFormData({
        origin: editingTrip.origin || '',
        destination: editingTrip.destination || '',
        vehicleId: editingTrip.vehicleId || '',
        driverId: editingTrip.driverId || '',
        clientId: editingTrip.clientId || '',
        userId: user?.id || '',
        departureDate: formatDate(editingTrip.departureDate),
        returnDate: editingTrip.returnDate
          ? formatDate(editingTrip.returnDate)
          : '',
        initialKilometer: editingTrip.initialKilometer?.toString() || '',
        finalKilometer: editingTrip.finalKilometer?.toString() || '',
        tripValue: editingTrip.tripValue?.toString() || '',
        notes: editingTrip.notes || '',
      })
    } else {
      resetForm()
    }
  }, [editingTrip])

  const resetForm = () => {
    setFormData({
      origin: '',
      destination: '',
      vehicleId: '',
      driverId: '',
      clientId: '',
      userId: user?.id || '',
      departureDate: '',
      returnDate: '',
      initialKilometer: '',
      finalKilometer: '',
      tripValue: '',
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
      title={editingTrip ? t('trips.editTrip') : t('trips.addTrip')}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CitySelect
            label={t('trips.fields.origin')}
            name="origin"
            value={formData.origin}
            onChange={e => setFormData({ ...formData, origin: e })}
            placeholder=""
            required
          />

          <CitySelect
            label={t('trips.fields.destination')}
            name="destination"
            value={formData.destination}
            onChange={e => setFormData({ ...formData, destination: e })}
            placeholder=""
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label={t('trips.fields.vehicle')}
            name="vehicleId"
            options={vehicles.map(vehicle => ({
              id: vehicle.id,
              name: `${vehicle.plate} - ${vehicle.model}`,
            }))}
            value={formData.vehicleId}
            onChange={e =>
              setFormData({ ...formData, vehicleId: e.target.value })
            }
            required
          />

          <Select
            label={t('trips.fields.driver')}
            name="driverId"
            options={drivers.map(driver => ({
              id: driver.id,
              name: driver.name,
            }))}
            value={formData.driverId}
            onChange={e =>
              setFormData({ ...formData, driverId: e.target.value })
            }
            required
          />

          <Select
            label={t('trips.fields.client')}
            name="clientId"
            options={clients.map(client => ({
              id: client.id,
              name: client.name,
            }))}
            value={formData.clientId}
            onChange={e =>
              setFormData({ ...formData, clientId: e.target.value })
            }
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t('trips.fields.departureDate')}
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
            label={t('trips.fields.returnDate')}
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
            label={t('trips.fields.initialKilometer')}
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
            label={t('trips.fields.finalKilometer')}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t('trips.fields.tripValue')}
            name="tripValue"
            type="number"
            value={formData.tripValue}
            onChange={e =>
              setFormData({ ...formData, tripValue: e.target.value })
            }
            placeholder="0"
            required={false}
          />
        </div>

        <TextArea
          label={t('trips.fields.notes')}
          name="notes"
          value={formData.notes}
          onChange={e => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          placeholder={t('trips.fields.notes')}
          required={false}
        />

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
            {editingTrip ? t('forms.update') : t('forms.create')}
          </button>
        </div>
      </form>
    </Modal>
  )
}
