import { useEffect, useState } from "react"
import { Home, LogIn, Search, User, Users } from "lucide-react"
import { useNavigate } from "react-router-dom"
import "./PlayerSearch.css"

const getLoggedInUser = async () => {
  const storedUser = localStorage.getItem("loggedInUser")

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser)
  } catch {
    return { name: storedUser }
  }
}

export default function PlayerSearch() {
  const navigate = useNavigate()
  const [playerName, setPlayerName] = useState("")
  const [loggedInUser, setLoggedInUser] = useState(null)

  useEffect(() => {
    let isMounted = true

    getLoggedInUser().then((user) => {
      if (isMounted) {
        setLoggedInUser(user)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  const handleSearch = (event) => {
    event.preventDefault()
    console.log("Player search:", playerName)
  }

  return (
    <main className="player-search-page">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="player-search-video"
        src="https://blz-contentstack-assets.akamaized.net/v3/assets/blt2477dcaf4ebd440c/blt2034b940dd314c20/68c0bb29c7462e7b39889792/F2P_Trailer_bug.mp4"
      />

      <header className="player-search-header">
        <div className="logo-placeholder">Logo</div>

        {loggedInUser ? (
          <button className="player-user-link" type="button" onClick={() => navigate("/dashboard")}>
            <User size={20} />
            <span>{loggedInUser.name}</span>
          </button>
        ) : (
          <button className="login-link" type="button">
            <LogIn size={20} />
            <span>Login</span>
          </button>
        )}
      </header>

      <section className="player-search-content">
        <h1>Player Search</h1>

        <form className="player-search-form" onSubmit={handleSearch}>
          <label htmlFor="player-name">Player search</label>
          <div className="search-input-row">
            <Search size={20} />
            <input
              id="player-name"
              type="text"
              value={playerName}
              onChange={(event) => setPlayerName(event.target.value)}
              placeholder="Player name eingeben"
            />
          </div>
          <button type="submit">Suchen</button>
        </form>
      </section>

      {loggedInUser && (
        <nav className="bottom-nav">
          <button className="nav-item" type="button" onClick={() => navigate("/dashboard")}>
            <Home size={20} />
            <span>Home</span>
          </button>
          <button className="nav-item active" type="button" onClick={() => navigate("/")}>
            <Search size={20} />
            <span>Suche</span>
          </button>
          <button className="nav-item" type="button">
            <Users size={20} />
            <span>Freunde</span>
          </button>
          <button className="nav-item" type="button">
            <User size={20} />
            <span>Profil</span>
          </button>
        </nav>
      )}
    </main>
  )
}
