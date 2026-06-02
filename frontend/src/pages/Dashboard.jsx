import { useState } from "react"
import { Home, Search, Users, User, Bell, CalendarDays, Check, X } from "lucide-react"
import "./Dashboard.css"

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

  const dismiss = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id))

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
        <div className="profile-circle">P</div>
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
        <button className="nav-item active">
          <Home size={20} /><span>Home</span>
        </button>
        <button className="nav-item">
          <Search size={20} /><span>Suche</span>
        </button>
        <button className="nav-item">
          <Users size={20} /><span>Freunde</span>
        </button>
        <button className="nav-item">
          <User size={20} /><span>Profil</span>
        </button>
      </nav>

    </div>
  )
}