import { Routes, Route } from 'react-router-dom'
import TodosListPage from './pages/TodosListPage'
import TodoDetailPage from './pages/TodoDetailPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<TodosListPage />} />
      <Route path="/todo" element={<TodoDetailPage />} />
    </Routes>
  )
}

export default App
