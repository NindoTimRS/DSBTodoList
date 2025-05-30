import { render } from 'preact';
import './style.scss';
import {useState} from "preact/hooks";
import LoginForm from "./components/auth/Login";
import Dashboard from "./components/dashboard";
import {getToken} from "./components/auth/auth";

const App = () => {
    const [isTokenValid, setIsTokenValid] = useState(false);
    const validateToken = async () => {
        const res = await fetch("http://localhost:6969/api/user", {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        })
        setIsTokenValid(res.ok);
    }
    validateToken();

    return (
        <div>
            {!isTokenValid ? <LoginForm onLogin={() => validateToken()} /> : <Dashboard/>}
        </div>
    );
};

render(<App/>, document.getElementById('app'))