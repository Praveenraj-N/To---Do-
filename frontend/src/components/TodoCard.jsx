import { Link } from 'react-router-dom'
import { formatDate } from '../utils/date'

export default function TodoCard({ todo, onToggle, onDeleteRequest }) {
  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo)}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? 'active' : 'completed'}`}
      />
      <Link to={`/details?id=${todo.id}`} className="todo-title">
        {todo.title}
      </Link>
      <span className={`priority-badge priority-${todo.priority}`}>{todo.priority}</span>
      <span className="category-badge">{todo.category}</span>
      {todo.dueDate && <span className="due-date">{formatDate(todo.dueDate)}</span>}
      <button className="btn-danger" onClick={() => onDeleteRequest(todo)}>
        Delete
      </button>
    </li>
  )
}
