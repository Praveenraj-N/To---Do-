import axios from 'axios'
import { API_BASE_URL } from '../constants'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const data = error.response?.data
    const message = data?.errors ? data.errors.join(', ') : data?.error || error.message || 'Request failed'
    return Promise.reject(new Error(message))
  },
)

export default apiClient
