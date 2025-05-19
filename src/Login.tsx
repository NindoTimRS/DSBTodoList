import { useState } from 'preact/hooks';
import { route } from 'preact-router';
import {LoginService} from "./service/login-service";


const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let loginService = new LoginService();
            const body = JSON.stringify({ username, password });
            const response = await loginService.GetLogIn(body);
            onLogin(response);
            localStorage.setItem('token', response);
            route('/dashboard'); // Redirect to dashboard
        } catch (err) {
            setError('Login failed. Please check your credentials.');

        }
    };

    return (
        <div id="login-page">
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form id="credentials" onSubmit={handleSubmit}>
                <input class="credentialInput" type="text" placeholder="Username" value={username} onInput={(e) => setUsername(e.currentTarget.value)} required />
                <input class="credentialInput" type="password" placeholder="Password" value={password} onInput={(e) => setPassword(e.currentTarget.value)} required />
                <button class="credentialInput submitButton" type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;