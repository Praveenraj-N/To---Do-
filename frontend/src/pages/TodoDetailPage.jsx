import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { getTodo, updateTodo, deleteTodo } from '../api'

export default function TodoDetailPage() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const navigate = useNavigate()

  const [todo, setTodo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (!id) {
      setError('No todo id provided in the URL.')
      setLoading(false)
      return
    }
    loadTodo()
  }, [id])

  async function loadTodo() {
    try {
      setLoading(true)
      const data = await getTodo(id)
      setTodo(data)
      setTitle(data.title)
      setDescription(data.description || '')
      setPriority(data.priority)
      setDueDate(data.dueDate || '')
      setCompleted(data.completed)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    try {
      setSaving(true)
      const updated = await updateTodo(id, {
        title,
        description,
        priority,
        dueDate: dueDate || null,
        completed,
      })
      setTodo(updated)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    try {
      await deleteTodo(id)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="app">
      <Link to="/" className="back-link">&larr; Back to all todos</Link>
      <h1>Todo detail</h1>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : todo ? (
        <div className="detail-card">
          <form onSubmit={handleSave}>
            <div className="detail-field">
              <label htmlFor="title">Title</label>
              <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="detail-field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="detail-field">
              <label htmlFor="priority">Priority</label>
              <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="detail-field">
              <label htmlFor="dueDate">Due date</label>
              <input
                id="dueDate"
                type="date"
                value={dueDate || ''}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="detail-field">
              <label>
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                />
                {' '}Completed
              </label>
            </div>

            <div className="detail-actions">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save changes'}
              </button>
              <button type="button" className="btn-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </form>

          <div className="meta-row">
            <span>Created: {new Date(todo.createdAt).toLocaleString()}</span>
            <span>Updated: {new Date(todo.updatedAt).toLocaleString()}</span>
            <span>ID: {todo.id}</span>
          </div>
        </div>
      ) : null}
    </div>
  )
}
