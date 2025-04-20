import React, { useState, useEffect } from 'react';
import { CiLight, CiDark } from "react-icons/ci";
import './styles.css';

const ThemeToggle = () => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const savedTheme = sessionStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            sessionStorage.setItem('theme', 'dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        sessionStorage.setItem('theme', newTheme);
    };

    return (
        <button className='button-theme' onClick={toggleTheme}>
            {theme === 'light' ? <CiDark /> : <CiLight />}
        </button>
    );
};

export default ThemeToggle;
