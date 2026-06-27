import apiClient from './client'

export const getTodos = () => apiClient.get('/todos')

export const getTodo = (id) => apiClient.get(`/todos/${id}`)

export const createTodo = (todo) => apiClient.post('/todos', todo)

export const updateTodo = (id, updates) => apiClient.put(`/todos/${id}`, updates)

export const deleteTodo = (id) => apiClient.delete(`/todos/${id}`)
