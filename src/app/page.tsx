import Link from 'next/link'
import { TruckIcon, UserGroupIcon, BuildingOfficeIcon, MapIcon, ChartBarIcon, CogIcon } from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Veículos',
    description: 'Gerencie sua frota de veículos, controle status e capacidade',
    href: '/vehicles',
    icon: TruckIcon,
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600'
  },
  {
    name: 'Motoristas',
    description: 'Cadastre e gerencie motoristas, controle licenças e status',
    href: '/drivers',
    icon: UserGroupIcon,
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600'
  },
  {
    name: 'Clientes',
    description: 'Mantenha cadastro de clientes e informações de contato',
    href: '/clients',
    icon: BuildingOfficeIcon,
    color: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600'
  },
  {
    name: 'Viagens',
    description: 'Registre e acompanhe viagens, rotas e status de entrega',
    href: '/trips',
    icon: MapIcon,
    color: 'bg-orange-500',
    hoverColor: 'hover:bg-orange-600'
  }
]

const stats = [
  { name: 'Total de Veículos', value: '12', icon: TruckIcon },
  { name: 'Motoristas Ativos', value: '8', icon: UserGroupIcon },
  { name: 'Clientes Cadastrados', value: '45', icon: BuildingOfficeIcon },
  { name: 'Viagens este Mês', value: '156', icon: MapIcon },
]

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bem-vindo ao TripControl
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Sistema completo para gerenciamento de frota, motoristas, clientes e viagens. 
          Controle total do seu negócio de transporte.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
          >
            <dt>
              <div className="absolute rounded-md bg-orange-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
            </dd>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Módulos do Sistema</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Link
              key={feature.name}
              href={feature.href}
              className="group relative bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300"
            >
              <div className="flex items-center space-x-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${feature.color} ${feature.hoverColor} transition-colors duration-200 flex items-center justify-center group-hover:scale-110`}>
                  <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-200">
                    {feature.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {feature.description}
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 rounded-lg ring-2 ring-transparent group-hover:ring-orange-200 transition-all duration-200" />
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/vehicles"
            className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
          >
            <TruckIcon className="h-5 w-5 text-orange-500 mr-3" />
            <span className="text-sm font-medium text-gray-900">Adicionar Veículo</span>
          </Link>
          <Link
            href="/drivers"
            className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
          >
            <UserGroupIcon className="h-5 w-5 text-orange-500 mr-3" />
            <span className="text-sm font-medium text-gray-900">Cadastrar Motorista</span>
          </Link>
          <Link
            href="/clients"
            className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
          >
            <BuildingOfficeIcon className="h-5 w-5 text-orange-500 mr-3" />
            <span className="text-sm font-medium text-gray-900">Novo Cliente</span>
          </Link>
          <Link
            href="/trips"
            className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
          >
            <MapIcon className="h-5 w-5 text-orange-500 mr-3" />
            <span className="text-sm font-medium text-gray-900">Nova Viagem</span>
          </Link>
        </div>
      </div>
    </div>
  )
} 