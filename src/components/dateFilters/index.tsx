import Input from '../form/Input'

export default function DateFilters({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  handleFilter,
}: {
  startDate: string
  endDate: string
  setStartDate: (date: string) => void
  setEndDate: (date: string) => void
  handleFilter: () => void
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Data Inicial"
          name="startDate"
          type="date"
          placeholder="Selecione a data inicial"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />
        <Input
          label="Data Final"
          name="endDate"
          type="date"
          placeholder="Selecione a data final"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />
        <div className="flex items-end">
          <button
            onClick={handleFilter}
            className="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
          >
            Filtrar
          </button>
        </div>
      </div>
    </div>
  )
}
