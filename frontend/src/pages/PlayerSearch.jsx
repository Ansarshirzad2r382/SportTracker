import {useState} from "react"
import {LogIn, Search} from "lucide-react"
import "./PlayerSearch.css"
import OverwatchApiHandler, {ENDPOINTS} from "../tools/OverwatchApiHandler.js";
import {PlayerBox} from "./PlayerBox.jsx";

export default function PlayerSearch() {
    const [playerName, setPlayerName] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    const handleSearch = (event) => {
        event.preventDefault()
        OverwatchApiHandler.GET(ENDPOINTS.SEARCH, playerName).then(results => {
            if (!results.ok) {
                throw new Error(`Error: ${results.status} ${results.statusText}`);
            }
            return results.json()
        }).then((responsebody) => {
            if (responsebody && responsebody.data && Array.isArray(responsebody.data.results)) {
                setSearchResult(responsebody.data.results);
            } else {
                setSearchResult([]);
            }

        }).catch((error) => {
            console.error("Suchfehler", error);
        })
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

                <button className="login-link" type="button">
                    <LogIn size={20}/>
                    <span>Login</span>
                </button>
            </header>

            <section className="player-search-content">
                <h1>Player Search</h1>

                <form className="player-search-form" onSubmit={handleSearch}>
                    <label htmlFor="player-name">Player search</label>
                    <div className="search-input-row">
                        <Search size={20}/>
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
            <section className="player-search-result-container">
                <section className={"player-search-result"}>
                    {
                        searchResult.map(player => (
                            <PlayerBox
                                key={player.player_id}
                                name={player.name}
                                card={player.namecard}
                                icon={player.avatar}
                                title={player.title}>
                            </PlayerBox>
                        ))
                    }
                </section>
            </section>
        </main>
    )
}
