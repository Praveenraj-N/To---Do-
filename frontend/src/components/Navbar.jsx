import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import './Navbar.css'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={() => setOpen(false)}>
          ✅ Todo App
        </Link>

        <button
          className="navbar-toggle"
          aria-label="Toggle navigation"
          onClick={() => setOpen((o) => !o)}
        >
          ☰
        </button>

        <nav className={`navbar-links ${open ? 'open' : ''}`}>
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </nav>
      </div>
    </header>
  )
}
