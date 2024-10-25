import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './styles.css';

import api from '../../services/api'
export default function Register(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function register(e){
        e.preventDefault();

        const data = {
            username,
            password,
        };
        try { 
            const response = await api.post('auth/register', data);
            localStorage.setItem('username', username);
            localStorage.setItem('acessToken', response.data.acessToken);
            navigate('/')
        } catch (error) { 
            alert("Usuario ou senha incorretos.")
            
        }
    };
    
    return(
     <div className="register-container">
        <section className="form">
            <form onSubmit={register}>
                <h1>Registre-se</h1>
                <input 
                     value={username}
                     onChange={e => setUsername(e.target.value)}
                     placeholder='Username' />
                <input 
                     value={password}
                     onChange={e => setPassword(e.target.value)}
                     type="password" placeholder='Password' />
                <button className='button' type='submit'>Registrar</button>
            </form>
        </section>

     </div>
    )
}