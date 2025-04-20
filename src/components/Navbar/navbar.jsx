import React, { useState, useEffect } from 'react';
import './navbar.css';
import { Link, useNavigate } from 'react-router-dom'; 
import { FiSearch, FiBookOpen, FiHeart, FiBookmark, FiUser } from 'react-icons/fi';
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import Dropdown from '../Dropdown/Dropdown';

export default function Navbar({ onSearch }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [username, setUsername] = useState(sessionStorage.getItem('username'));
    const [menuOpen, setMenuOpen] = useState(false); 
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
        sessionStorage.removeItem('isLoggedIn'); 
        sessionStorage.removeItem('accessToken'); 
        setUsername(null); 
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchQuery);
        }
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
        setMenuOpen(false);
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen); 
    };

    return (
        <header className="GonkLib-header">
            <div className="header-content">
                <Link to="/" className="logo-wrapper">
                    <FiBookOpen className="logo-icon" />
                    <h1 className="logo-text">GonkLib</h1>
                </Link>
                
                <form onSubmit={handleSearch} className="search-container">
                    <div className="search-input-wrapper">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Pesquisar livros..."
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </form>
                
                <nav className="nav-icons">
                    <button className="nav-icon-button">
                        <FiHeart className="nav-icon" />
                    </button>
                    <button className="nav-icon-button">
                        <FiBookmark className="nav-icon" />
                    </button>
                    
                    <div className="user-avatar-container nav-icons">
                        <div 
                            className="user-avatar nav-icon-button"  
                            onClick={toggleMenu}
                            style={{ backgroundImage: username ? 'var(--gradient-primary)' : 'none' }}
                        >
                            {username ? username.charAt(0).toUpperCase() : <FiUser className="guest-icon" />}
                        </div>
                        
                        {menuOpen && (
                            <Dropdown 
                                options={username ? ['Perfil', 'Configurações', 'Sair'] : ['Login']}
                                onSelect={(option) => {
                                    if (option === 'Login') {
                                        navigate('/login');
                                    } else {
                                        handleSelectOption(option);
                                    }
                                }}
                                onClose={() => setMenuOpen(false)}
                                isLoggedIn={!!username}
                            />
                        )}
                    </div>
                    
                    <ThemeToggle />
                </nav>
            </div>
        </header>
    );
}