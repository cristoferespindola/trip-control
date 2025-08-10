export interface Vehicle {
  id: string
  plate: string
  model: string
  brand: string
  year: number
  capacity: number
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE'
  createdAt: Date
  updatedAt: Date
}

export interface Driver {
  id: string
  name: string
  cpf: string
  cnh: string
  phone: string
  email?: string
  address?: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  createdAt: Date
  updatedAt: Date
}

export interface Client {
  id: string
  name: string
  cpf?: string
  cnpj?: string
  phone: string
  email?: string
  address?: string
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED'
  createdAt: Date
  updatedAt: Date
}

export interface Trip {
  id: string
  origin: string
  destination: string
  departureDate: Date
  returnDate?: Date
  distance?: number
  fuelCost?: number
  tollCost?: number
  otherCosts?: number
  totalCost?: number
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  notes?: string
  createdAt: Date
  updatedAt: Date
  vehicleId: string
  driverId: string
  clientId: string
  vehicle?: Vehicle
  driver?: Driver
  client?: Client
} 

export interface City {
  id: number
  nome: string
  microrregiao?: {
    id: number
    nome: string
    mesorregiao?: {
      id: number
      nome: string
      UF?: {
        id: number
        sigla: string
        nome: string
        regiao?: {
          id: number
          sigla: string
          nome: string
        }
      }
    }
  }
  'regiao-imediata'?: {
    id: number
    nome: string
    'regiao-intermediaria'?: {
      id: number
      nome: string
    }
  }
}