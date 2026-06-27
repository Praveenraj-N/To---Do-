import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import useTodo from '../hooks/useTodo'
import Spinner from '../components/Spinner'
import ConfirmDialog from '../components/ConfirmDialog'
import { PRIORITIES, CATEGORIES } from '../constants'
import { formatDateTime } from '../utils/date'

export default function TodoDetailPage() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const navigate = useNavigate()

  const { todo, loading, error, saveTodo, removeTodo } = useTodo(id)
  const [saving, setSaving] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('general')
  const [dueDate, setDueDate] = useState('')
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (!todo) return
    setTitle(todo.title)
    setDescription(todo.description || '')
    setPriority(todo.priority)
    setCategory(todo.category || 'general')
    setDueDate(todo.dueDate || '')
    setCompleted(todo.completed)
  }, [todo])

  async function handleSave(e) {
    e.preventDefault()
    try {
      setSaving(true)
      await saveTodo({ title, description, priority, category, dueDate: dueDate || null, completed })
      toast.success('Todo updated')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    try {
      await removeTodo()
      toast.success('Todo deleted')
      navigate('/')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setConfirmOpen(false)
    }
  }

  return (
    <div className="app">
      <Link to="/" className="back-link">&larr; Back to all todos</Link>
      <h1>Todo detail</h1>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <Spinner label="Loading todo…" />
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

            <div className="detail-row">
              <div className="detail-field">
                <label htmlFor="priority">Priority</label>
                <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div className="detail-field">
                <label htmlFor="category">Category</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
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
              <button type="button" className="btn-danger" onClick={() => setConfirmOpen(true)}>
                Delete
              </button>
            </div>
          </form>

          <div className="meta-row">
            <span>Created: {formatDateTime(todo.createdAt)}</span>
            <span>Updated: {formatDateTime(todo.updatedAt)}</span>
            <span>ID: {todo.id}</span>
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete todo?"
        message={todo ? `"${todo.title}" will be permanently deleted.` : ''}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
