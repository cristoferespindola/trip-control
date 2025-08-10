'use client'

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useState, forwardRef } from 'react'

interface InputProps {
  label: string
  name: string
  type: 'text' | 'password' | 'date' | 'number' | 'email' | 'tel' | 'url'
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  required?: boolean
  disabled?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      name,
      type,
      placeholder,
      value,
      onChange,
      onFocus,
      required = false,
      disabled = false,
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <div>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
        <div className="mt-1 relative">
          <input
            id={name}
            name={name}
            type={type}
            required={required}
            disabled={disabled}
            onFocus={onFocus}
            ref={ref}
            value={value}
            onChange={onChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 placeholder-gray-700 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm pr-10"
            placeholder={placeholder}
          />
          {type === 'password' && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          )}
        </div>
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
