import { useState } from "react"
import { Home, Search, Users, User, Bell, CalendarDays, Check, X } from "lucide-react"
import "./Dashboard.css"
import { useNavigate } from 'react-router-dom'

const mockEvents = [
  { id: 1, name: "Event ABC" },
  { id: 2, name: "Event XYZ" },
  { id: 3, name: "Event DEF" },
]

export default function Dashboard() {
  const [notifications, setNotifications] = useState([
    { id: 1, from: "Robin" },
    { id: 2, from: "Moritz" },
  ])
 
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)

  const dismiss = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id))

  const handleLogout = () => {
    console.log("Spaeter mehr dazu...")
    // ...
  }

  return (
    <div className="dashboard">

      <video
        autoPlay
        loop
        muted
        playsInline
        className="bg-video"
        src="https://blz-contentstack-assets.akamaized.net/v3/assets/blt2477dcaf4ebd440c/blt2034b940dd314c20/68c0bb29c7462e7b39889792/F2P_Trailer_bug.mp4"
      />

      <header className="topbar">
        <div>
          <h1 className="greeting">Hi, Player</h1> {/* Spaeter kommt hier den Name der eingeloggten Person */}
        </div>

        <div className="custom-select-container">
          
          <div className="custom-select-trigger" onClick={() => setShowDropdown(!showDropdown)}>
            <span>Mikey124@myyahoo.com</span>
            <span className={`arrow ${showDropdown ? 'open' : ''}`}>▼</span>
          </div>

          {showDropdown && (
            <div className="custom-select-options">
              <div className="option-wrapper">
                <button className="logout-button" onClick={handleLogout}>
                  ausloggen
                </button>
              </div>
            </div>
          )}

        </div>
      </header>

      <div className="cards">

        <div className="card">
          <div className="card-header">
            <CalendarDays size={18} />
            <h2>Events</h2>
          </div>
          {mockEvents.map((e) => (
            <div key={e.id} className="event-item">{e.name}</div>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <Bell size={18} />
            <h2>Benachrichtigungen</h2>
          </div>
          {notifications.map((n) => (
            <div key={n.id} className="notif-item">
              <p>Invite von {n.from}</p>
              <div className="notif-actions">
                <button className="accept-btn" onClick={() => dismiss(n.id)}>
                  <Check size={16} />
                </button>
                <button className="decline-btn" onClick={() => dismiss(n.id)}>
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      <nav className="bottom-nav">
        <button className="nav-item active" onClick={() => navigate('/dashboard')}>
          <Home size={20} /><span>Home</span>
        </button>
        <button className="nav-item" onClick={() => navigate('/')}>
          <Search size={20} /><span>Suche</span>
        </button>
        <button className="nav-item">
          <Users size={20} /><span>Freunde</span>
        </button>
        <button className="nav-item" onClick={() => navigate('/profile')}>
          <User size={20} /><span>Profil</span>
        </button>
      </nav>

    </div>
  )
}
