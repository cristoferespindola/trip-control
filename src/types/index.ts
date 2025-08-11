export enum StatusEnum {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
export type Status = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
export type StatusText = 'Agendada' | 'Em Andamento' | 'Concluída' | 'Cancelada'

export interface User {
  id: string
  username: string
  email: string
  name: string
  role: 'ADMIN' | 'MANAGER' | 'USER'
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  createdAt: Date
  updatedAt: Date
}

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
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'ON_TRIP'
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
  initialKilometer?: number
  finalKilometer?: number
  tripValue?: number
  status: StatusEnum
  notes?: string
  vehicleId: string
  driverId: string
  clientId: string
  userId: string
  vehicle?: Vehicle
  driver?: Driver
  client?: Client
  user?: User
  expenses?: Expense[]
  createdAt: Date
  updatedAt: Date
}

export interface Expense {
  id: string
  name: string
  value: number
  date: Date
  type: 'MAINTENANCE' | 'TOLL' | 'FUEL' | 'FOOD' | 'OTHER'
  notes?: string
  tripId: string
  driverId: string
  vehicleId: string
  trip?: Trip
  driver?: Driver
  vehicle?: Vehicle
  createdAt: Date
  updatedAt: Date
}

export interface City {
  id: number
  nome: string
  microrregiao?: {
    nome: string
    mesorregiao?: {
      nome: string
      UF?: {
        nome: string
        sigla: string
      }
    }
  }
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthContextType {
  user: User | null
  login: (credentials: LoginCredentials) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}
