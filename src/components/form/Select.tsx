import { useTranslation } from '@/locales'

export default function Select({
  label,
  name,
  options,
  value,
  onChange,
  required,
}: {
  label: string
  name: string
  options: { id: string; name: string }[]
  value: string
  required: boolean
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}) {
  const { t } = useTranslation()

  return (
    <div>
      <label
        className="block text-sm font-medium text-gray-700 mb-2"
        htmlFor={name}
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        required={required}
      >
        <option className="text-gray-700" value="">
          {t('forms.select')} {label}
        </option>
        {options.map(option => (
          <option className="text-gray-700" key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  )
}
