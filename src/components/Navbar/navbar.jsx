import React, { useState, useEffect } from 'react';
import './navbar.css'
import { Link, useNavigate } from 'react-router-dom'; 
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import Dropdown from '../Dropdown/Dropdown';

export default function Navbar() {
    const [username, setUsername] = useState(sessionStorage.getItem('username'));
    const navigate = useNavigate();

    useEffect(() => {
        const handleStorageChange = () => {
            setUsername(sessionStorage.getItem('username'));
        };

        window.addEventListener('storage', handleStorageChange);

        const interval = setInterval(() => {
            const currentUsername = sessionStorage.getItem('username');
            if (currentUsername !== username) {
                setUsername(currentUsername);
            }
        }, 1000); 

        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [username]);

    const handleLogout = () => {
        sessionStorage.removeItem('username');
        setUsername(null);
        navigate('/')
    };

    const userOptions = ['Ver Perfil', 'Configurações', 'Logout'];

    const handleSelectOption = (option) => {
        switch (option) {
            case 'Ver Perfil':
                navigate('/perfil');
                break;
            case 'Configurações':
                navigate('/settings');
                break;
            case 'Logout':
                handleLogout();
                break;
            default:
                console.log('Opção não reconhecida');
        }
    };

    return (
        <div className="nav-container">
            <ThemeToggle />
            <div>
                <Link className='nav-link' to={'/'}>Inicio</Link>
            </div>
            <input className="input-navbar" type="text" placeholder="Pesquisa" />
            <div>
                <Link className='nav-link' to={'/destaques'}>Destaques</Link>
                <Link className='nav-link' to={'/Books'}>Books</Link>

                {username ? (
                    <Dropdown 
                        label={username} 
                        options={userOptions} 
                        onSelect={handleSelectOption}
                    />
                ) : (
                    <Link className='nav-link' to={'/Login'}>Login</Link>
                )}
            </div>
        </div>
    );
}
