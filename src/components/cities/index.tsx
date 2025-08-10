'use client'

import { useState, useEffect, useRef } from 'react'
import Input from '@/components/form/Input'
import { filterCities, formatCityName } from '../../utils/strings.utils'

const searchCities = async (query: string): Promise<any[]> => {
  if (query.length < 2) {
    return []
  }

  try {
    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/municipios?nome=${encodeURIComponent(query)}`
    )

    if (response.ok) {
      const data = await response.json()
      const filteredCities = filterCities(data, query)
      return filteredCities.slice(0, 10)
    } else {
      return []
    }
  } catch (error) {
    console.error('Erro ao buscar cidades:', error)
    return []
  }
}

interface City {
  nome: string
  microrregiao?: {
    mesorregiao?: {
      UF?: {
        nome: string
      }
    }
  }
}

interface CitySelectProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
}

export default function CitySelect({
  label,
  name,
  value,
  onChange,
  placeholder = 'Digite o nome da cidade',
  required = false,
  disabled = false,
}: CitySelectProps) {
  const [cities, setCities] = useState<City[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange(newValue)

    if (newValue.length >= 2) {
      setIsLoading(true)
      setShowDropdown(true)

      try {
        const citiesData = await searchCities(newValue)
        setCities(citiesData)
      } catch (error) {
        console.error('Erro ao buscar cidades:', error)
        setCities([])
      } finally {
        setIsLoading(false)
      }
    } else {
      setCities([])
      setShowDropdown(false)
    }
  }

  const handleCitySelect = (city: City) => {
    const cityName = formatCityName(city)
    setInputValue(cityName)
    onChange(cityName)
    setShowDropdown(false)
    setCities([])
  }

  const handleInputFocus = () => {
    if (inputValue.length >= 2 && cities.length > 0) {
      setShowDropdown(true)
    }
  }

  return (
    <div className="relative">
      <Input
        label={label}
        ref={inputRef}
        type="text"
        name={name}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {isLoading ? (
            <div className="px-3 py-2 text-sm text-gray-500">Carregando...</div>
          ) : cities.length > 0 ? (
            cities.map((city, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleCitySelect(city)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm text-gray-700 border-b border-gray-100 last:border-b-0"
              >
                {formatCityName(city)}
              </button>
            ))
          ) : inputValue.length >= 2 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              Nenhuma cidade encontrada
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
