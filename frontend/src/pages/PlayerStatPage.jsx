import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, BarChart2, Clock, Crosshair, Gamepad2, HeartPulse, Shield, Swords, Trophy } from "lucide-react"
import OverwatchApiHandler, { ENDPOINTS } from "../tools/OverwatchApiHandler.js"
import "./PlayerStatPage.css"

const roleConfig = {
    tank: { label: "Tank", icon: Shield },
    damage: { label: "Damage", icon: Crosshair },
    support: { label: "Support", icon: HeartPulse },
}

const formatRoleRank = (rank) => {
    if (!rank) return "Unranked"
    const division = rank.division
        ? rank.division.charAt(0).toUpperCase() + rank.division.slice(1)
        : "Rank"
    return `${division} ${rank.tier ?? ""}`.trim()
}

const formatTime = (seconds) => {
    if (!seconds) return "0m"
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return h > 0 ? `${h}h ${m}m` : `${m}m`
}

const getRanks = (competitive) => {
    const ranks = []
    Object.entries(competitive ?? {}).forEach(([platform, platformData]) => {
        if (!platformData) return
        Object.keys(roleConfig).forEach((role) => {
            const rank = platformData[role]
            if (rank) ranks.push({ platform, role, season: platformData.season, ...rank })
        })
    })
    return ranks
}

const normalizeHeroPlaytime = (player) => {
    const playtime =
        player?.hero_playtime ??
        player?.heroPlaytime ??
        player?.heroes?.playtime ??
        player?.heroes

    if (!playtime) return []

    if (Array.isArray(playtime)) {
        return playtime
            .map((hero) => ({ hero: hero.hero ?? hero.name ?? hero.label, time: hero.time ?? hero.playtime ?? hero.value }))
            .filter((hero) => hero.hero && hero.time)
    }

    if (typeof playtime === "object") {
        return Object.entries(playtime)
            .map(([hero, time]) => ({ hero, time }))
            .filter((hero) => hero.hero && hero.time)
    }

    return []
}

export default function PlayerStatPage() {
    const { playerId } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const [player, setPlayer] = useState(location.state?.player ?? null)
    const [isLoading, setIsLoading] = useState(Boolean(playerId))
    const [error, setError] = useState("")
    const [stats, setStats] = useState(null)

    useEffect(() => {
        let isActive = true

        if (!playerId) {
            return () => { isActive = false }
        }

        OverwatchApiHandler.GET(ENDPOINTS.SUMMARY, playerId)
            .then((result) => {
                if (!result.ok) throw new Error(`Error: ${result.status} ${result.statusText}`)
                return result.json()
            })
            .then((data) => { if (isActive) setPlayer(data) })
            .catch((fetchError) => {
                console.error("Statistikfehler", fetchError)
                if (isActive) setError("Stats konnten nicht geladen werden.")
            })
            .finally(() => { if (isActive) setIsLoading(false) })

        return () => { isActive = false }
    }, [playerId])

    useEffect(() => {
        if (!playerId) return
        let isActive = true

        OverwatchApiHandler.GET(ENDPOINTS.STATS_SUMMARY, playerId)
            .then((r) => { if (!r.ok) throw new Error(`${r.status}`); return r.json() })
            .then((data) => { if (isActive) setStats(data) })
            .catch(() => {})

        return () => { isActive = false }
    }, [playerId])

    const ranks = useMemo(() => getRanks(player?.competitive), [player])
    const heroPlaytime = useMemo(() => normalizeHeroPlaytime(player), [player])
    const heroStats = useMemo(() => {
        if (!stats?.heroes) return []
        return Object.entries(stats.heroes)
            .map(([name, data]) => ({ name, ...data }))
            .filter((h) => h.games_played > 0)
            .sort((a, b) => b.games_played - a.games_played)
            .slice(0, 15)
    }, [stats])
    const statusMessage = error || (!playerId ? "Bitte waehle zuerst ein Userprofil ueber die Suche aus." : "")

    return (
        <main className="player-stat-page">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="player-stat-video"
                src="https://blz-contentstack-assets.akamaized.net/v3/assets/blt2477dcaf4ebd440c/blt2034b940dd314c20/68c0bb29c7462e7b39889792/F2P_Trailer_bug.mp4"
            />

            <header className="player-stat-header">
                <button className="stat-back-button" type="button" onClick={() => navigate("/")}>
                    <ArrowLeft size={20} />
                    <span>Zurueck</span>
                </button>
            </header>

            <section className="player-stat-profile">
                <div
                    className="player-stat-namecard"
                    style={{ "--stat-namecard": player?.namecard ? `url(${player.namecard})` : "none" }}
                >
                    <div className="player-stat-avatar-wrap">
                        {player?.avatar && <img src={player.avatar} alt="" className="player-stat-avatar" />}
                    </div>
                    <div className="player-stat-name-block">
                        <span className="player-stat-title">{player?.title ?? "Overwatch Player"}</span>
                        <h1>{player?.username ?? player?.name ?? "Player"}</h1>
                    </div>
                    {player?.endorsement?.level && (
                        <div className="player-stat-endorsement">
                            {player.endorsement.frame && <img src={player.endorsement.frame} alt="" />}
                            <span>Level {player.endorsement.level}</span>
                        </div>
                    )}
                </div>
            </section>

            {statusMessage && <p className="player-stat-message">{statusMessage}</p>}
            {isLoading && <p className="player-stat-message">Stats werden geladen...</p>}

            <section className="player-stat-grid">
                <article className="stat-panel ranks-panel">
                    <div className="stat-panel-heading">
                        <Trophy size={22} />
                        <h2>Ranks</h2>
                    </div>
                    {ranks.length > 0 ? (
                        <div className="rank-list">
                            {ranks.map((rank) => {
                                const RoleIcon = roleConfig[rank.role].icon
                                return (
                                    <div className="rank-item" key={`${rank.platform}-${rank.role}`}>
                                        <div className="rank-role">
                                            <RoleIcon size={22} />
                                            <div>
                                                <span>{roleConfig[rank.role].label}</span>
                                                <small>{rank.platform.toUpperCase()} Season {rank.season}</small>
                                            </div>
                                        </div>
                                        <div className="rank-visuals">
                                            {rank.rank_icon && <img src={rank.rank_icon} alt="" />}
                                            {rank.tier_icon && <img src={rank.tier_icon} alt="" />}
                                        </div>
                                        <strong>{formatRoleRank(rank)}</strong>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <p className="empty-state">Keine Rank-Daten vorhanden.</p>
                    )}
                </article>

                <article className="stat-panel playtime-panel">
                    <div className="stat-panel-heading">
                        <Clock size={22} />
                        <h2>Hero Playtime</h2>
                    </div>
                    {heroPlaytime.length > 0 ? (
                        <div className="hero-playtime-list">
                            {heroPlaytime.map((hero) => (
                                <div className="hero-playtime-item" key={hero.hero}>
                                    <div className="hero-playtime-icon">
                                        <Gamepad2 size={20} />
                                    </div>
                                    <span>{hero.hero}</span>
                                    <strong>{hero.time}</strong>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="empty-state">Keine Hero-Playtime vorhanden.</p>
                    )}
                </article>
            </section>

            {stats?.general && (
                <section className="player-stat-extra">
                    <article className="stat-panel">
                        <div className="stat-panel-heading">
                            <BarChart2 size={22} />
                            <h2>Allgemeine Statistiken</h2>
                        </div>
                        <div className="general-stats-grid">
                            <div className="stat-card">
                                <span>Spiele</span>
                                <strong>{stats.general.games_played}</strong>
                            </div>
                            <div className="stat-card stat-card--highlight">
                                <span>Winrate</span>
                                <strong>{stats.general.winrate}%</strong>
                            </div>
                            <div className="stat-card stat-card--highlight">
                                <span>KDA</span>
                                <strong>{stats.general.kda}</strong>
                            </div>
                            <div className="stat-card">
                                <span>Spielzeit</span>
                                <strong>{formatTime(stats.general.time_played)}</strong>
                            </div>
                            <div className="stat-card">
                                <span>Gewonnen / Verloren</span>
                                <strong>{stats.general.games_won} / {stats.general.games_lost}</strong>
                            </div>
                            <div className="stat-card">
                                <span>Eliminations</span>
                                <strong>{stats.general.total.eliminations.toLocaleString()}</strong>
                            </div>
                            <div className="stat-card">
                                <span>Damage</span>
                                <strong>{stats.general.total.damage.toLocaleString()}</strong>
                            </div>
                            <div className="stat-card">
                                <span>Healing</span>
                                <strong>{stats.general.total.healing.toLocaleString()}</strong>
                            </div>
                        </div>
                    </article>
                </section>
            )}

            {stats?.roles && (
                <section className="player-stat-extra">
                    <article className="stat-panel">
                        <div className="stat-panel-heading">
                            <Swords size={22} />
                            <h2>Role Breakdown</h2>
                        </div>
                        <div className="role-breakdown-grid">
                            {Object.entries(stats.roles).map(([roleName, roleData]) => {
                                const cfg = roleConfig[roleName]
                                if (!cfg) return null
                                const RoleIcon = cfg.icon
                                return (
                                    <div className="role-card" key={roleName}>
                                        <div className="role-card-header">
                                            <RoleIcon size={20} />
                                            <span>{cfg.label}</span>
                                        </div>
                                        <div className="role-card-stats">
                                            <div className="role-stat">
                                                <span>Spiele</span>
                                                <strong>{roleData.games_played}</strong>
                                            </div>
                                            <div className="role-stat role-stat--highlight">
                                                <span>Winrate</span>
                                                <strong>{roleData.winrate}%</strong>
                                            </div>
                                            <div className="role-stat role-stat--highlight">
                                                <span>KDA</span>
                                                <strong>{roleData.kda}</strong>
                                            </div>
                                            <div className="role-stat">
                                                <span>Spielzeit</span>
                                                <strong>{formatTime(roleData.time_played)}</strong>
                                            </div>
                                            <div className="role-stat">
                                                <span>Ø Eliminations</span>
                                                <strong>{roleData.average.eliminations}</strong>
                                            </div>
                                            <div className="role-stat">
                                                <span>Ø Damage</span>
                                                <strong>{roleData.average.damage.toLocaleString()}</strong>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </article>
                </section>
            )}

            {heroStats.length > 0 && (
                <section className="player-stat-extra">
                    <article className="stat-panel">
                        <div className="stat-panel-heading">
                            <Gamepad2 size={22} />
                            <h2>Top Heroes</h2>
                        </div>
                        <div className="hero-stats-list">
                            <div className="hero-stats-header">
                                <span>Hero</span>
                                <span>Spiele</span>
                                <span>Winrate</span>
                                <span>KDA</span>
                                <span>Ø Damage</span>
                            </div>
                            {heroStats.map((hero) => (
                                <div className="hero-stats-row" key={hero.name}>
                                    <span className="hero-name">{hero.name.replace(/-/g, " ")}</span>
                                    <span>{hero.games_played}</span>
                                    <span className={hero.winrate >= 50 ? "stat-positive" : "stat-negative"}>
                                        {hero.winrate}%
                                    </span>
                                    <span>{hero.kda}</span>
                                    <span>{hero.average.damage.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </article>
                </section>
            )}
        </main>
    )
}
