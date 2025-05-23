import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBookOpen, FiUser, FiLock, FiArrowRight } from 'react-icons/fi';
import api from '../../services/api';
import './styles.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLoginSuccess = () => {
        sessionStorage.setItem("isLoggedIn", "true");
    };

    async function login(e) {
        e.preventDefault();
        setIsLoading(true);

        const data = {
            username,
            password,
        };

        try {
            const response = await api.post('auth/signin', data);
            
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('accessToken', response.data.accessToken);
            if (rememberMe) {
                localStorage.setItem('username', username);
                localStorage.setItem('accessToken', response.data.accessToken);
            }

            handleLoginSuccess();
            navigate('/');
        } catch (error) {
            alert('Usuário ou senha incorretos.');
            setIsLoading(false);
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <FiBookOpen className="login-logo-icon" />
                    <h1>GonkLib</h1>
                    <p>Conecte-se para explorar o mundo dos livros</p>
                </div>

                <form onSubmit={login} className="login-form">
                    <div className="input-group">
                        <label htmlFor="username">
                            <FiUser className="input-icon" />
                            <span>Nome de usuário</span>
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">
                            <FiLock className="input-icon" />
                            <span>Senha</span>
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <div className="login-options">
                        <label className="remember-me">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <span>Lembrar de mim</span>
                        </label>
                        <button 
                            type="button" 
                            className="forgot-password"
                            onClick={() => navigate('/forgot-password')}
                        >
                            Esqueceu a senha?
                        </button>
                    </div>

                    <button 
                        type="submit" 
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="loading-spinner-login"></span>
                        ) : (
                            <>
                                Entrar <FiArrowRight className="button-icon" />
                            </>
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Não tem uma conta? <button onClick={() => navigate('/register')}>Cadastre-se</button></p>
                </div>
            </div>
        </div>
    );
}