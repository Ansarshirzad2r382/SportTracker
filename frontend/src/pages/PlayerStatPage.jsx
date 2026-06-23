import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, BarChart3, Clock, Crosshair, Gamepad2, HeartPulse, Shield, Trophy } from "lucide-react"
import OverwatchApiHandler, { ENDPOINTS } from "../tools/OverwatchApiHandler.js"
import "./PlayerStatPage.css"

const roleConfig = {
    tank: {label: "Tank", icon: Shield},
    damage: {label: "Damage", icon: Crosshair},
    support: {label: "Support", icon: HeartPulse},
}

const formatRoleRank = (rank) => {
    if (!rank) {
        return "Unranked"
    }

    const division = rank.division
        ? rank.division.charAt(0).toUpperCase() + rank.division.slice(1)
        : "Rank"

    return `${division} ${rank.tier ?? ""}`.trim()
}

const getRanks = (competitive) => {
    const ranks = []

    Object.entries(competitive ?? {}).forEach(([platform, platformData]) => {
        if (!platformData) {
            return
        }

        Object.keys(roleConfig).forEach((role) => {
            const rank = platformData[role]
            if (rank) {
                ranks.push({
                    platform,
                    role,
                    season: platformData.season,
                    ...rank,
                })
            }
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

    if (!playtime) {
        return []
    }

    if (Array.isArray(playtime)) {
        return playtime
            .map((hero) => ({
                hero: hero.hero ?? hero.name ?? hero.label,
                time: hero.time ?? hero.playtime ?? hero.value,
            }))
            .filter((hero) => hero.hero && hero.time)
    }

    if (typeof playtime === "object") {
        return Object.entries(playtime)
            .map(([hero, time]) => ({hero, time}))
            .filter((hero) => hero.hero && hero.time)
    }

    return []
}

const statLabels = {
    eliminations: "Eliminations",
    assists: "Assists",
    deaths: "Deaths",
    damage: "Damage",
    healing: "Healing",
}

const formatNumber = (value, fractionDigits = 0) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return "-"
    }

    return new Intl.NumberFormat("de-DE", {
        maximumFractionDigits: fractionDigits,
        minimumFractionDigits: fractionDigits,
    }).format(Number(value))
}

const formatPercent = (value) => `${formatNumber(value, 2)}%`

const formatDuration = (seconds) => {
    if (seconds === null || seconds === undefined || Number.isNaN(Number(seconds))) {
        return "-"
    }

    const totalMinutes = Math.round(Number(seconds) / 60)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    if (hours <= 0) {
        return `${minutes}m`
    }

    return `${hours}h ${minutes}m`
}

const formatHeroName = (hero) => hero
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")

const getStatEntries = (stats) => Object.entries(stats ?? {}).map(([key, value]) => ({
    key,
    label: statLabels[key] ?? key,
    value,
}))

const getRoleStats = (roles) => Object.keys(roleConfig)
    .filter((role) => roles?.[role])
    .map((role) => ({
        role,
        ...roles[role],
    }))

const getHeroStats = (heroes) => Object.entries(heroes ?? {})
    .map(([hero, stats]) => ({
        hero,
        ...stats,
    }))
    .sort((firstHero, secondHero) => (secondHero.time_played ?? 0) - (firstHero.time_played ?? 0))

export default function PlayerStatPage() {
    const {playerId} = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const [player, setPlayer] = useState(location.state?.player ?? null)
    const [statsSummary, setStatsSummary] = useState(null)
    const [isLoading, setIsLoading] = useState(Boolean(playerId))
    const [isStatsLoading, setIsStatsLoading] = useState(Boolean(playerId))
    const [error, setError] = useState("")
    const [statsError, setStatsError] = useState("")

    useEffect(() => {
        let isActive = true

        if (!playerId) {
            return () => {
                isActive = false
            }
        }

        OverwatchApiHandler.GET(ENDPOINTS.SUMMARY, playerId)
            .then((result) => {
                if (!result.ok) {
                    throw new Error(`Error: ${result.status} ${result.statusText}`)
                }
                return result.json()
            })
            .then((data) => {
                if (isActive) {
                    setPlayer(data)
                }
            })
            .catch((fetchError) => {
                console.error("Statistikfehler", fetchError)
                if (isActive) {
                    setError("Stats konnten nicht geladen werden.")
                }
            })
            .finally(() => {
                if (isActive) {
                    setIsLoading(false)
                }
            })

        return () => {
            isActive = false
        }
    }, [playerId])

    useEffect(() => {
        let isActive = true

        if (!playerId) {
            setStatsSummary(null)
            setIsStatsLoading(false)
            return () => {
                isActive = false
            }
        }

        setIsStatsLoading(true)
        setStatsError("")
        setStatsSummary(null)

        OverwatchApiHandler.GET(ENDPOINTS.STATS_SUMMARY, playerId)
            .then((result) => {
                if (!result.ok) {
                    throw new Error(`Error: ${result.status} ${result.statusText}`)
                }
                return result.json()
            })
            .then((data) => {
                if (isActive) {
                    setStatsSummary(data)
                }
            })
            .catch((fetchError) => {
                console.error("Summary-Statistikfehler", fetchError)
                if (isActive) {
                    setStatsError("Erweiterte Stats konnten nicht geladen werden.")
                }
            })
            .finally(() => {
                if (isActive) {
                    setIsStatsLoading(false)
                }
            })

        return () => {
            isActive = false
        }
    }, [playerId])

    const ranks = useMemo(() => getRanks(player?.competitive), [player])
    const heroPlaytime = useMemo(() => normalizeHeroPlaytime(player), [player])
    const roleStats = useMemo(() => getRoleStats(statsSummary?.roles), [statsSummary])
    const heroStats = useMemo(() => getHeroStats(statsSummary?.heroes), [statsSummary])
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
                    style={{"--stat-namecard": player?.namecard ? `url(${player.namecard})` : "none"}}
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
            {isStatsLoading && <p className="player-stat-message">Erweiterte Stats werden geladen...</p>}
            {statsError && <p className="player-stat-message">{statsError}</p>}

            {statsSummary?.general && (
                <section className="stats-summary-section">
                    <article className="stat-panel general-stats-panel">
                        <div className="stat-panel-heading">
                            <BarChart3 size={22} />
                            <h2>General Stats</h2>
                        </div>

                        <div className="stat-card-grid">
                            <div className="stat-card">
                                <span>Games</span>
                                <strong>{formatNumber(statsSummary.general.games_played)}</strong>
                            </div>
                            <div className="stat-card">
                                <span>Wins</span>
                                <strong>{formatNumber(statsSummary.general.games_won)}</strong>
                            </div>
                            <div className="stat-card">
                                <span>Losses</span>
                                <strong>{formatNumber(statsSummary.general.games_lost)}</strong>
                            </div>
                            <div className="stat-card">
                                <span>Winrate</span>
                                <strong>{formatPercent(statsSummary.general.winrate)}</strong>
                            </div>
                            <div className="stat-card">
                                <span>KDA</span>
                                <strong>{formatNumber(statsSummary.general.kda, 2)}</strong>
                            </div>
                            <div className="stat-card">
                                <span>Time Played</span>
                                <strong>{formatDuration(statsSummary.general.time_played)}</strong>
                            </div>
                        </div>

                        <div className="stat-breakdown-grid">
                            <div className="stat-breakdown">
                                <h3>Total</h3>
                                {getStatEntries(statsSummary.general.total).map((stat) => (
                                    <div className="stat-line" key={stat.key}>
                                        <span>{stat.label}</span>
                                        <strong>{formatNumber(stat.value)}</strong>
                                    </div>
                                ))}
                            </div>

                            <div className="stat-breakdown">
                                <h3>Average</h3>
                                {getStatEntries(statsSummary.general.average).map((stat) => (
                                    <div className="stat-line" key={stat.key}>
                                        <span>{stat.label}</span>
                                        <strong>{formatNumber(stat.value, 2)}</strong>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </article>

                    <article className="stat-panel role-stats-panel">
                        <div className="stat-panel-heading">
                            <Shield size={22} />
                            <h2>Role Stats</h2>
                        </div>

                        {roleStats.length > 0 ? (
                            <div className="role-stat-list">
                                {roleStats.map((roleStat) => {
                                    const RoleIcon = roleConfig[roleStat.role].icon

                                    return (
                                        <div className="role-stat-card" key={roleStat.role}>
                                            <div className="role-stat-heading">
                                                <RoleIcon size={22} />
                                                <strong>{roleConfig[roleStat.role].label}</strong>
                                            </div>

                                            <div className="role-stat-metrics">
                                                <span>{formatNumber(roleStat.games_played)} Games</span>
                                                <span>{formatNumber(roleStat.games_won)}W / {formatNumber(roleStat.games_lost)}L</span>
                                                <span>{formatPercent(roleStat.winrate)} WR</span>
                                                <span>{formatNumber(roleStat.kda, 2)} KDA</span>
                                                <span>{formatDuration(roleStat.time_played)}</span>
                                            </div>

                                            <div className="role-stat-breakdown">
                                                <div>
                                                    <small>Total Damage</small>
                                                    <strong>{formatNumber(roleStat.total?.damage)}</strong>
                                                </div>
                                                <div>
                                                    <small>Total Healing</small>
                                                    <strong>{formatNumber(roleStat.total?.healing)}</strong>
                                                </div>
                                                <div>
                                                    <small>Avg Eliminations</small>
                                                    <strong>{formatNumber(roleStat.average?.eliminations, 2)}</strong>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <p className="empty-state">Keine Rollen-Stats vorhanden.</p>
                        )}
                    </article>

                    <article className="stat-panel hero-stats-panel">
                        <div className="stat-panel-heading">
                            <Gamepad2 size={22} />
                            <h2>Hero Stats</h2>
                        </div>

                        {heroStats.length > 0 ? (
                            <div className="hero-stats-table-wrap">
                                <table className="hero-stats-table">
                                    <thead>
                                        <tr>
                                            <th>Hero</th>
                                            <th>Games</th>
                                            <th>W/L</th>
                                            <th>Winrate</th>
                                            <th>KDA</th>
                                            <th>Time</th>
                                            <th>Avg Elims</th>
                                            <th>Avg Damage</th>
                                            <th>Avg Healing</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {heroStats.map((hero) => (
                                            <tr key={hero.hero}>
                                                <td>{formatHeroName(hero.hero)}</td>
                                                <td>{formatNumber(hero.games_played)}</td>
                                                <td>{formatNumber(hero.games_won)} / {formatNumber(hero.games_lost)}</td>
                                                <td>{formatPercent(hero.winrate)}</td>
                                                <td>{formatNumber(hero.kda, 2)}</td>
                                                <td>{formatDuration(hero.time_played)}</td>
                                                <td>{formatNumber(hero.average?.eliminations, 2)}</td>
                                                <td>{formatNumber(hero.average?.damage, 2)}</td>
                                                <td>{formatNumber(hero.average?.healing, 2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="empty-state">Keine Hero-Stats vorhanden.</p>
                        )}
                    </article>
                </section>
            )}

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
        </main>
    )
}
