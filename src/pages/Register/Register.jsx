import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBookOpen, FiUser, FiLock, FiArrowRight } from 'react-icons/fi';
import api from '../../services/api';


export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    function validatePassword(password) {
        const regex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,}$/;
        return regex.test(password);
    }

    async function register(e) {
        e.preventDefault();
        setIsLoading(true);
        setPasswordError('');

        if (password !== confirmPassword) {
            setPasswordError("As senhas não coincidem.");
            setIsLoading(false);
            return;
        }

        if (!validatePassword(password)) {
            setPasswordError("A senha deve ter pelo menos 8 caracteres, incluindo 1 letra maiúscula e 1 caractere especial.");
            setIsLoading(false);
            return;
        }

        const data = {
            username,
            password,
        };

        try {
            const response = await api.post('auth/register', data);
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('accessToken', response.data.accessToken);
            navigate('/');
        } catch (error) {
            alert("Erro ao registrar. Tente novamente.");
            setIsLoading(false);
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <FiBookOpen className="login-logo-icon" />
                    <h1>GonkLib</h1>
                    <p>Crie sua conta para explorar o mundo dos livros</p>
                </div>

                <form onSubmit={register} className="login-form">
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
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="confirmPassword">
                            <FiLock className="input-icon" />
                            <span>Confirme sua senha</span>
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    {passwordError && (
                        <div className="error-message">
                            {passwordError}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="loading-spinner-login"></span>
                        ) : (
                            <>
                                Registrar <FiArrowRight className="button-icon" />
                            </>
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Já tem uma conta? <button onClick={() => navigate('/login')}>Faça login</button></p>
                </div>
            </div>
        </div>
    );
}