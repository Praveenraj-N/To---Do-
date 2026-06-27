import { useCallback, useEffect, useState } from 'react'
import { getTodos, createTodo, updateTodo, deleteTodo } from '../api/todos.api'

export default function useTodos() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTodos = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getTodos()
      setTodos(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTodos()
  }, [loadTodos])

  const addTodo = useCallback(async (payload) => {
    const todo = await createTodo(payload)
    setTodos((prev) => [...prev, todo])
    return todo
  }, [])

  const editTodo = useCallback(async (id, updates) => {
    const updated = await updateTodo(id, updates)
    setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
    return updated
  }, [])

  const removeTodo = useCallback(async (id) => {
    await deleteTodo(id)
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { todos, loading, error, reload: loadTodos, addTodo, editTodo, removeTodo }
}
