import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import useTodos from '../hooks/useTodos'
import TodoCard from '../components/TodoCard'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import ConfirmDialog from '../components/ConfirmDialog'
import Pagination from '../components/Pagination'
import { FILTERS, SORT_OPTIONS, PRIORITIES, CATEGORIES, PAGE_SIZE } from '../constants'

function sortTodos(todos, sortBy) {
  const [field, direction] = sortBy.split('_')
  const priorityWeight = { low: 0, medium: 1, high: 2 }

  return [...todos].sort((a, b) => {
    let cmp = 0
    if (field === 'title') cmp = a.title.localeCompare(b.title)
    else if (field === 'priority') cmp = priorityWeight[a.priority] - priorityWeight[b.priority]
    else cmp = new Date(a.createdAt) - new Date(b.createdAt)
    return direction === 'desc' ? -cmp : cmp
  })
}

export default function TodosListPage() {
  const { todos, loading, error, addTodo, editTodo, removeTodo } = useTodos()

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt_desc')
  const [page, setPage] = useState(1)
  const [pendingDelete, setPendingDelete] = useState(null)

  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('general')
  const [dueDate, setDueDate] = useState('')

  async function handleAdd(e) {
    e.preventDefault()
    if (!title.trim()) return
    try {
      await addTodo({ title, priority, category, dueDate: dueDate || null })
      setTitle('')
      setPriority('medium')
      setCategory('general')
      setDueDate('')
      toast.success('Todo added')
    } catch (err) {
      toast.error(err.message)
    }
  }

  async function toggleCompleted(todo) {
    try {
      await editTodo(todo.id, { completed: !todo.completed })
    } catch (err) {
      toast.error(err.message)
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    try {
      await removeTodo(pendingDelete.id)
      toast.success('Todo deleted')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setPendingDelete(null)
    }
  }

  const filteredTodos = useMemo(() => {
    let result = todos
    if (filter === 'active') result = result.filter((t) => !t.completed)
    if (filter === 'completed') result = result.filter((t) => t.completed)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(
        (t) => t.title.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q),
      )
    }
    return sortTodos(result, sortBy)
  }, [todos, filter, search, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredTodos.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageTodos = filteredTodos.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div className="app">
      <h1>Todos</h1>
      <p className="subtitle">
        {todos.length} total &middot; {todos.filter((t) => !t.completed).length} remaining
      </p>

      {error && <div className="error-banner">{error}</div>}

      <form className="add-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
          ))}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <button type="submit" className="btn-primary">Add</button>
      </form>

      <div className="toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search todos..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={filter === f ? 'active' : ''}
            onClick={() => {
              setFilter(f)
              setPage(1)
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner label="Loading todos…" />
      ) : pageTodos.length === 0 ? (
        <EmptyState message={todos.length === 0 ? 'No todos yet. Add your first one above.' : 'No todos match your filters.'} />
      ) : (
        <ul className="todo-list">
          {pageTodos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onToggle={toggleCompleted}
              onDeleteRequest={setPendingDelete}
            />
          ))}
        </ul>
      )}

      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete todo?"
        message={pendingDelete ? `"${pendingDelete.title}" will be permanently deleted.` : ''}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
