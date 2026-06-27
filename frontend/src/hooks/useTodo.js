import { useCallback, useEffect, useState } from 'react'
import { getTodo, updateTodo, deleteTodo } from '../api/todos.api'

export default function useTodo(id) {
  const [todo, setTodo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTodo = useCallback(async () => {
    if (!id) {
      setError('No todo id provided in the URL.')
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const data = await getTodo(id)
      setTodo(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadTodo()
  }, [loadTodo])

  const saveTodo = useCallback(async (updates) => {
    const updated = await updateTodo(id, updates)
    setTodo(updated)
    return updated
  }, [id])

  const removeTodo = useCallback(async () => {
    await deleteTodo(id)
  }, [id])

  return { todo, loading, error, reload: loadTodo, saveTodo, removeTodo }
}
