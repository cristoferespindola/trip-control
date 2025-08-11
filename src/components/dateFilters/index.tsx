import Input from '../form/Input'
import { useTranslation } from '@/locales'

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
  const { t } = useTranslation()

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {t('filters.title')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label={t('filters.startDate')}
          name="startDate"
          type="date"
          placeholder={t('filters.selectStartDate')}
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />
        <Input
          label={t('filters.endDate')}
          name="endDate"
          type="date"
          placeholder={t('filters.selectEndDate')}
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />
        <div className="flex items-end">
          <button
            onClick={handleFilter}
            className="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
          >
            {t('filters.filter')}
          </button>
        </div>
      </div>
    </div>
  )
}
