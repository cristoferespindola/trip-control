import { StatusEnum, StatusText } from '../../types'

export const statusMap: Record<StatusEnum, StatusText> = {
  [StatusEnum.SCHEDULED]: 'Agendada',
  [StatusEnum.IN_PROGRESS]: 'Em Andamento',
  [StatusEnum.COMPLETED]: 'Concluída',
  [StatusEnum.CANCELLED]: 'Cancelada',
}
