import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import TodosListPage from './pages/TodosListPage'
import TodoDetailPage from './pages/TodoDetailPage'
import NotFoundPage from './pages/NotFoundPage'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<TodosListPage />} />
        <Route path="/details" element={<TodoDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2500} />
    </ThemeProvider>
  )
}

export default App
