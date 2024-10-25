import React from 'react';
import './styles.css';
import { Link } from 'react-router-dom';
import { FiPower } from 'react-icons/fi';

export default function Book(){
    return (
        <div className="book-container">
            <header>
                <span>Welcome</span>
                <Link className='button' to="book/new">Add new Book</Link>
                <button type='button'>
                    <FiPower size={18} color='#251fc5'/>
                </button>
            </header>
        </div>
    )
}