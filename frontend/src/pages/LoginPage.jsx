import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import "./LoginPage.css"

export default function LoginPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const token = searchParams.get('token')
        if (token) {
            localStorage.setItem('token', token)
            navigate('/dashboard')
        }
    }, [searchParams, navigate])

    function HandleLogin(e) {
        e.preventDefault()
        // Username/Password Login noch nicht implementiert
    }

    return (
        <div className="login-page">
            <video
                className="bg-video"
                autoPlay
                loop
                muted
                playsInline
                src="https://blz-contentstack-assets.akamaized.net/v3/assets/blt2477dcaf4ebd440c/blt2034b940dd314c20/68c0bb29c7462e7b39889792/F2P_Trailer_bug.mp4"
            />
            <div className="logo"><img
        src="https://img.icons8.com/?id=4Cs7TqA0Am41&format=png&size=512"
        alt="Overwatch Logo"
    /></div>
            <div>
                <main className="login-form">
                    <h2>Login</h2>
                    <form onSubmit={HandleLogin}>
                        <input type="text" name="username" placeholder="Username" />
                        <input type="password" name="password" placeholder="Password" />
                        <div><button type="submit">Login</button></div>
                        <div className="google-login">
                            <button type="button" onClick={() => {
                                window.location.href = "http://localhost:5000/auth/google/login";
                            }}> 
                                <img
                                src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
                                alt="Google"
                            />
                            Mit Google anmelden
                        </button>
                    </div>
                    </form>
                </main>
            </div>
        </div>
    )
}