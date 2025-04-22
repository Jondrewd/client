import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const Dropdown = ({ options, onSelect, onClose, isLoggedIn }) => {
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleOptionClick = (option) => {
        if (!isLoggedIn && option !== 'Login') {
            navigate('/login');
            onClose();
            return;
        }
        onSelect(option);
        onClose();
    };

    return (
        <div ref={dropdownRef} className="dropdown-custom-container">
            <ul className="dropdown-custom-options">
                {options.map((option, index) => (
                    <li 
                        key={index} 
                        className="dropdown-custom-item"
                        onClick={() => handleOptionClick(option)}
                    >
                        {option}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dropdown;