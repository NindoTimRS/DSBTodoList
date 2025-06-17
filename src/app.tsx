import { render } from 'preact';
import './style.scss';
import {useEffect, useState} from "preact/hooks";
import LoginForm from "./components/auth/Login";
import Dashboard from "./components/dashboard";
import {getToken} from "./components/auth/auth";
import LoadingSpinner from "./components/auth/LoadingSpinner";

const App = () => {
    const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
    const validateToken = async () => {
        try {
            const res = await fetch("http://localhost:6969/api/user", {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            })
            setIsTokenValid(res.ok);
        }
        catch {
            setIsTokenValid(false);
        }

    }
    useEffect(() => {
        validateToken();
    }, []);

    if (isTokenValid === null) {
        return <LoadingSpinner/>;
    }


    return (
        <div>
            {!isTokenValid ? <LoginForm onLogin={() => validateToken()} /> : <Dashboard/>}
        </div>
    );
};

render(<App/>, document.getElementById('app'))