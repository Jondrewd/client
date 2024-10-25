import React, {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import './styles.css';

import api from '../../services/api'
export default function Login(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function login(e){
        e.preventDefault();

        const data = {
            username,
            password,
        };
        try { 
            const response = await api.post('auth/signin', data);
            localStorage.setItem('username', username);
            localStorage.setItem('acessToken', response.data.acessToken);
            navigate('/')
        } catch (error) { 
            alert("Usuario ou senha incorretos.")
            
        }
    };
    
    return(
     <div className="login-container">
        <section className="form">
            <form onSubmit={login}>
                <h1>Acess your Account</h1>
                <input 
                     value={username}
                     onChange={e => setUsername(e.target.value)}
                     placeholder='Username' />
                <input 
                     value={password}
                     onChange={e => setPassword(e.target.value)}
                     type="password" placeholder='Password' />
                <button className='button' type='submit'>Login</button>
                <Link to={'/register'}>Registrar-se</Link>
            </form>
        </section>

     </div>
    )
}