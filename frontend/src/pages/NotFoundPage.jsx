import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="app">
      <div className="not-found">
        <h1>404</h1>
        <p>This page doesn't exist.</p>
        <Link to="/" className="btn-primary">Back to Todos</Link>
      </div>
    </div>
  )
}
