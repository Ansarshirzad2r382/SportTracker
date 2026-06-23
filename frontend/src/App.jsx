import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import PlayerSearch from './pages/PlayerSearch.jsx'
import PlayerStatPage from './pages/PlayerStatPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import UserProfilePage from './pages/UserProfilePage.jsx'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Nur wenn jemand angemeldet ist */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />

                <Route path="/profile" element={
                    <ProtectedRoute>
                        <UserProfilePage />
                    </ProtectedRoute>
                } />

                {/* Öffentliche Routen für alle */}
                <Route path="/" element={<PlayerSearch />} />
                <Route path="/PlayerStatPage" element={<PlayerStatPage />} />
                <Route path="/PlayerStatPage/:playerId" element={<PlayerStatPage />} />
                <Route path="/players/:playerId" element={<PlayerStatPage />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
