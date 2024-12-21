import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

import api from '../../services/api';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    function validatePassword(password) {
        const regex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,}$/;
        return regex.test(password);
    }

    async function register(e) {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("As senhas não coincidem.");
            return;
        }

        if (!validatePassword(password)) {
            setPasswordError("A senha deve ter pelo menos 8 caracteres, incluindo 1 letra maiúscula e 1 caractere especial.");
            return;
        }

        const data = {
            username,
            password,
        };
        try {
            const response = await api.post('auth/register', data);
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('acessToken', response.data.acessToken);
            navigate('/');
        } catch (error) {
            alert("Erro ao registrar. Tente novamente.");
        }
    }

    return (
        <div className="register-container">
            <section className="form">
                <form onSubmit={register}>
                    <h1>Registre-se</h1>
                    <input
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder='Username'
                    />
                    <input
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                        placeholder='Password'
                    />
                    <input
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        type="password"
                        placeholder='Confirm Password'
                    />
                    {passwordError && <p className="error">{passwordError}</p>}
                    <button className='button' type='submit'>Registrar</button>
                    <p className="password-requirements">A senha deve ter pelo menos 8 caracteres, incluindo 1 letra maiúscula e 1 caractere especial.</p>
                </form>
            </section>
        </div>
    );
}
