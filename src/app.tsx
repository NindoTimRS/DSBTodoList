import { useState, useEffect  } from 'preact/hooks';
import Login from './Login';
import {render} from "preact";
import Dashboard from './dashboard';

const App = () => {
    const [token, setToken] = useState(null);


    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    const handleLogin = (newToken: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    return (
        <div>
            {!token ? <Login onLogin={handleLogin} /> : <Dashboard token={token} />}
        </div>
    );
};

render(<App/>, document.getElementById('app'))