import { useEffect, useState } from "react"
import { CalendarDays, Home, Mail, Search, User, Users } from "lucide-react"
import { useNavigate } from "react-router-dom"
import "./UserProfilePage.css"

const mockUser = {
    name: "Player",
    email: getEmailFromToken(),
    friends: ["Robin", "Moritz", "Alex"],
    events: ["Event ABC", "Event XYZ", "Event DEF"],
}

function getEmailFromToken() {
    try {
        const token = localStorage.getItem('token')
        if (!token) return null
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ?? payload.email ?? null
    } catch {
        return null
    }
}

const getLoggedInUser = async () => {
    const storedUser = localStorage.getItem("loggedInUser")

    if (!storedUser) {
        return mockUser
    }

    try {
        return { ...mockUser, ...JSON.parse(storedUser) }
    } catch {
        return { ...mockUser, name: storedUser }
    }
}

export default function UserProfilePage() {
    const navigate = useNavigate()
    const [user, setUser] = useState(mockUser)

    useEffect(() => {
        let isMounted = true

        getLoggedInUser().then((loggedInUser) => {
            if (isMounted) {
                setUser(loggedInUser)
            }
        })

        return () => {
            isMounted = false
        }
    }, [])

    return (
        <main className="user-profile-page">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="profile-bg-video"
                src="https://blz-contentstack-assets.akamaized.net/v3/assets/blt2477dcaf4ebd440c/blt2034b940dd314c20/68c0bb29c7462e7b39889792/F2P_Trailer_bug.mp4"
            />

            <header className="profile-header">
                <div className="logo">
                    <img src="https://img.icons8.com/?id=4Cs7TqA0Am41&format=png&size=512" alt="Overwatch Logo" />
                </div>
                <p><b>Profil</b></p>
            </header>

            <section className="profile-content" aria-label="User profile">
                <div className="profile-identity">
                    <div className="profile-avatar">
                        <User size={38} />
                    </div>
                    <div className="Profile-Daten">
                        <p> <b> {user.name} </b></p> 
                        <p>
                            <Mail size={17} />
                            <span>{user.email}</span>
                        </p>
                    </div>
                </div>

                <div className="profile-info-grid">
                    <section className="profile-card">
                        <div className="profile-card-header">
                            <Users size={18} />
                            <h3>Freundesliste</h3>
                        </div>
                        <div className="profile-list">
                            {user.friends.map((friend) => (
                                <div className="profile-list-item" key={friend}>
                                    {friend}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="profile-card">
                        <div className="profile-card-header">
                            <CalendarDays size={18} />
                            <h3>Events</h3>
                        </div>
                        <div className="profile-list">
                            {user.events.map((event) => (
                                <div className="profile-list-item" key={event}>
                                    {event}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </section>

            <nav className="bottom-nav">
                <button className="nav-item" type="button" onClick={() => navigate("/dashboard")}>
                    <Home size={20} />
                    <span>Home</span>
                </button>
                <button className="nav-item" type="button" onClick={() => navigate("/")}>
                    <Search size={20} />
                    <span>Suche</span>
                </button>
                <button className="nav-item" type="button">
                    <Users size={20} />
                    <span>Freunde</span>
                </button>
                <button className="nav-item active" type="button" onClick={() => navigate("/profile")}>
                    <User size={20} />
                    <span>Profil</span>
                </button>
            </nav>
        </main>
    )
}
