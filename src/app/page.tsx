'use server'

import { countVehicles } from '../actions/vehicles'
import { countDrivers } from '../actions/drivers'
import { countClients } from '../actions/clients'
import { countTrips } from '../actions/trips'
import { DashboardClient } from './DashboardClient'

const modules = [
  {
    name: 'dashboard.modules.vehicles',
    href: '/vehicles',
    icon: 'TruckIcon',
    color: 'bg-blue-500',
  },
  {
    name: 'dashboard.modules.drivers',
    href: '/drivers',
    icon: 'UserGroupIcon',
    color: 'bg-green-500',
  },
  {
    name: 'dashboard.modules.clients',
    href: '/clients',
    icon: 'BuildingOfficeIcon',
    color: 'bg-purple-500',
  },
  {
    name: 'dashboard.modules.trips',
    href: '/trips',
    icon: 'MapIcon',
    color: 'bg-orange-500',
  },
  {
    name: 'dashboard.modules.users',
    href: '/users',
    icon: 'UsersIcon',
    color: 'bg-red-500',
  },
]

export default async function Dashboard() {
  const vehiclesCount = await countVehicles()
  const driversCount = await countDrivers()
  const clientsCount = await countClients()
  const tripsCount = await countTrips()

  const stats = [
    {
      name: 'dashboard.stats.totalVehicles',
      value: vehiclesCount,
      icon: 'TruckIcon',
    },
    {
      name: 'dashboard.stats.totalDrivers',
      value: driversCount,
      icon: 'UserGroupIcon',
    },
    {
      name: 'dashboard.stats.totalClients',
      value: clientsCount,
      icon: 'BuildingOfficeIcon',
    },
    { name: 'dashboard.stats.totalTrips', value: tripsCount, icon: 'MapIcon' },
  ]

  return <DashboardClient stats={stats} modules={modules} />
}
