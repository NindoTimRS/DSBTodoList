import { useState } from 'preact/hooks'
import { saveToken } from './auth'
import styles from './styles/loginForm.module.scss'

export default function LoginForm({ onLogin }: { onLogin: () => void }) {
    const apiPath = "http://localhost:6969/api/user";
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const login = async (e: Event) => {
        e.preventDefault()
        const res = await fetch(apiPath, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })
        if (res.ok) {
            const { token } = await res.json()
            saveToken(token)
            onLogin()
        } else {
            alert('Login fehlgeschlagen')
        }
    }

    return (
        <div className={styles.container}>
            <form onSubmit={login} className={styles.form}>
                <h2 className={styles.heading}>Login</h2>

                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.inputGroup}>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onInput={(e) => setUsername(e.currentTarget.value)}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onInput={(e) => setPassword(e.currentTarget.value)}
                        required
                    />
                </div>

                <button className={styles.button} type="submit">Login</button>
            </form>
        </div>
    )
}