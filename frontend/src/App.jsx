import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import PlayerSearch from './pages/PlayerSearch.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PlayerSearch />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
