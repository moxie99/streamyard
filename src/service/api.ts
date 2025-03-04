import axios, { AxiosError } from 'axios'

const api = axios.create({
  baseURL: 'https://staging-api-public.streamflow.finance/v2/api/airdrops/',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.data)
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const apiService = {
  get: async <T>(path: string, params?: object): Promise<T> => {
    try {
      const response = await api.get<T>(path, { params })
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  post: async <T>(path: string, data: object): Promise<T> => {
    try {
      const response = await api.post<T>(path, data)
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  patch: async <T>(path: string, data: object): Promise<T> => {
    try {
      const response = await api.patch<T>(path, data)
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  delete: async <T>(path: string): Promise<T> => {
    try {
      const response = await api.delete<T>(path)
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },
}

// Global error handling function
const handleApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    console.error('API Error:', error.response?.data || error.message)
  } else {
    console.error('Unexpected Error:', error)
  }
}
