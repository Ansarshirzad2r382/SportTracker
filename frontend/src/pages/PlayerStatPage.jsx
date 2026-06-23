import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Clock, Crosshair, Gamepad2, HeartPulse, Shield, Trophy } from "lucide-react"
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

export default function PlayerStatPage() {
    const {playerId} = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const [player, setPlayer] = useState(location.state?.player ?? null)
    const [isLoading, setIsLoading] = useState(Boolean(playerId))
    const [error, setError] = useState("")

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

    const ranks = useMemo(() => getRanks(player?.competitive), [player])
    const heroPlaytime = useMemo(() => normalizeHeroPlaytime(player), [player])
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
