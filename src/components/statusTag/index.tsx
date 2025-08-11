import { StatusEnum, StatusText } from '../../types'

const getStatusText = (status: StatusEnum) => {
  const statusMap: Record<StatusEnum, StatusText> = {
    [StatusEnum.SCHEDULED]: 'Agendada',
    [StatusEnum.IN_PROGRESS]: 'Em Andamento',
    [StatusEnum.COMPLETED]: 'Concluída',
    [StatusEnum.CANCELLED]: 'Cancelada',
  }
  return statusMap[status] || status
}

const getStatusColor = (status: StatusEnum) => {
  const colorMap: { [key: string]: string } = {
    [StatusEnum.SCHEDULED]: 'bg-blue-100 text-blue-800',
    [StatusEnum.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
    [StatusEnum.COMPLETED]: 'bg-green-100 text-green-800',
    [StatusEnum.CANCELLED]: 'bg-red-100 text-red-800',
  }

  return colorMap[status] || 'bg-gray-100 text-gray-800'
}

export default function StatusTag({ status }: { status: StatusEnum }) {
  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}
    >
      {getStatusText(status)}
    </span>
  )
}
