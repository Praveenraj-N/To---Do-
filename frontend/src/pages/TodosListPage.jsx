import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTodos, createTodo, updateTodo, deleteTodo } from '../api'

const FILTERS = ['all', 'active', 'completed']

export default function TodosListPage() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')

  useEffect(() => {
    loadTodos()
  }, [])

  async function loadTodos() {
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
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!title.trim()) return
    try {
      const todo = await createTodo({ title, priority, dueDate: dueDate || null })
      setTodos((prev) => [...prev, todo])
      setTitle('')
      setPriority('medium')
      setDueDate('')
    } catch (err) {
      setError(err.message)
    }
  }

  async function toggleCompleted(todo) {
    try {
      const updated = await updateTodo(todo.id, { completed: !todo.completed })
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)))
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTodo(id)
      setTodos((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  const visibleTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  return (
    <div className="app">
      <h1>Todos</h1>
      <p className="subtitle">{todos.length} total &middot; {todos.filter((t) => !t.completed).length} remaining</p>

      {error && <div className="error-banner">{error}</div>}

      <form className="add-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <button type="submit" className="btn-primary">Add</button>
      </form>

      <div className="filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={filter === f ? 'active' : ''}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : visibleTodos.length === 0 ? (
        <p className="empty-state">No todos here.</p>
      ) : (
        <ul className="todo-list">
          {visibleTodos.map((todo) => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleCompleted(todo)}
              />
              <Link to={`/todo?id=${todo.id}`} className="todo-title">
                {todo.title}
              </Link>
              <span className={`priority-badge priority-${todo.priority}`}>{todo.priority}</span>
              {todo.dueDate && <span className="due-date">{todo.dueDate}</span>}
              <button className="btn-danger" onClick={() => handleDelete(todo.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
