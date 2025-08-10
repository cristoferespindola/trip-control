/**
 * Normaliza texto removendo acentos, caracteres especiais e convertendo para minúsculas
 * Útil para buscas e comparações de texto
 */
export const normalizeText = (text: string): string => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
}

/**
 * Formata nome da cidade com estado
 */
export const formatCityName = (city: {
  nome: string
  microrregiao?: { mesorregiao?: { UF?: { nome: string } } }
}): string => {
  const stateName = city.microrregiao?.mesorregiao?.UF?.nome || ''
  return `${city.nome} - ${stateName}`
}

/**
 * Filtra e ordena cidades baseado em uma query
 */
export const filterCities = (cities: any[], query: string) => {
  const normalizedQuery = normalizeText(query)

  return cities
    .filter((city: any) => {
      const cityName = normalizeText(city.nome)
      const stateName = normalizeText(
        city.microrregiao?.mesorregiao?.UF?.nome || ''
      )
      return (
        cityName.includes(normalizedQuery) ||
        stateName.includes(normalizedQuery)
      )
    })
    .sort((a: any, b: any) => {
      const aName = normalizeText(a.nome)
      const bName = normalizeText(b.nome)
      const aStartsWithQuery = aName.startsWith(normalizedQuery)
      const bStartsWithQuery = bName.startsWith(normalizedQuery)

      if (aStartsWithQuery && !bStartsWithQuery) return -1
      if (!aStartsWithQuery && bStartsWithQuery) return 1
      return aName.localeCompare(bName)
    })
}

/**
 * Busca cidades na API do IBGE
 */
export const searchCities = async (query: string): Promise<any[]> => {
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
