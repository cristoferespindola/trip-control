export default function TextArea({
  label,
  name,
  value,
  onChange,
  rows,
  placeholder,
  required,
}: {
  label: string
  name: string
  value: string
  rows: number
  placeholder: string
  required: boolean
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}) {
  return (
    <div>
      <label
        className="block text-sm font-medium text-gray-700 mb-2"
        htmlFor={name}
      >
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
