import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import PlayerSearch from './pages/PlayerSearch'
import UserProfilePage from './pages/UserProfilePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PlayerSearch />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<UserProfilePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
