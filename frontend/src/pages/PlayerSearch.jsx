import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { LogIn, Search } from "lucide-react"
import "./PlayerSearch.css"

export default function PlayerSearch() {
    const [playerName, setPlayerName] = useState("")
    const navigate = useNavigate()

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
                <div className="logo-placeholder">
                    <img src="https://img.icons8.com/?id=4Cs7TqA0Am41&format=png&size=512" alt="Overwatch Logo" />
                </div>

                <button className="login-link" type="button" onClick={() => navigate("/login")}>
                    <LogIn size={20} />
                    <span>Login</span>
                </button>
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
        </main>
    )
}