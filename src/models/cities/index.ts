import { City } from "@/types"
import { Response } from "../types"

export async function getCities(): Promise<Response<City[]>> {
    try {
      console.log('Carregando cidades da API do IBGE...')
      const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const citiesData = await response.json()
      console.log(citiesData)
      console.log(`Cidades carregadas: ${citiesData.length}`)
      
      return {
        data: citiesData,
        status: 200,
        message: 'Cidades carregadas com sucesso',
        error: null
      }
    } catch (error) {
      console.error('Erro ao carregar cidades da API do IBGE:', error)
      
      // Fallback: cidades principais do Brasil
      const fallbackCities = [
        { id: 1, nome: 'São Paulo', microrregiao: { mesorregiao: { UF: { sigla: 'SP', nome: 'São Paulo' } } } },
        { id: 2, nome: 'Rio de Janeiro', microrregiao: { mesorregiao: { UF: { sigla: 'RJ', nome: 'Rio de Janeiro' } } } },
        { id: 3, nome: 'Brasília', microrregiao: { mesorregiao: { UF: { sigla: 'DF', nome: 'Distrito Federal' } } } },
        { id: 4, nome: 'Salvador', microrregiao: { mesorregiao: { UF: { sigla: 'BA', nome: 'Bahia' } } } },
        { id: 5, nome: 'Fortaleza', microrregiao: { mesorregiao: { UF: { sigla: 'CE', nome: 'Ceará' } } } },
        { id: 6, nome: 'Belo Horizonte', microrregiao: { mesorregiao: { UF: { sigla: 'MG', nome: 'Minas Gerais' } } } },
        { id: 7, nome: 'Manaus', microrregiao: { mesorregiao: { UF: { sigla: 'AM', nome: 'Amazonas' } } } },
        { id: 8, nome: 'Curitiba', microrregiao: { mesorregiao: { UF: { sigla: 'PR', nome: 'Paraná' } } } },
        { id: 9, nome: 'Recife', microrregiao: { mesorregiao: { UF: { sigla: 'PE', nome: 'Pernambuco' } } } },
        { id: 10, nome: 'Porto Alegre', microrregiao: { mesorregiao: { UF: { sigla: 'RS', nome: 'Rio Grande do Sul' } } } }
      ]
      
      console.log('Usando lista de cidades alternativa...')
      return {
        data: fallbackCities as unknown as City[],
        status: 200,
        message: 'Cidades alternativas carregadas com sucesso',
        error: error as string
      }
    }
  }