import React, { useState } from 'react';
import { IoChevronDownSharp } from 'react-icons/io5';
import './styles.css';

const Dropdown = ({ label, options, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div 
            className="dropdown-container"
            onMouseEnter={() => setIsOpen(true)} 
            onMouseLeave={() => setIsOpen(false)}
        >
            <p>{label} <IoChevronDownSharp /></p>
            {isOpen && (
                <ul className="dropdown-options">
                    {options.map((option, index) => (
                        <li key={index} onClick={() => onSelect(option)}>
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;
