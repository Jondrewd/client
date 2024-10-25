import React from "react";
import './navbar.css'
import { Link } from 'react-router-dom';

export default function Navbar(){
    const username = localStorage.getItem('username');
    return(
        <div className="nav-container">
          <div>
              <Link className= 'nav-link'to={'/'}>Inicio</Link>
          </div>
          <input className="input-navbar" type="text" placeholder="Pesquisa"  />
          <div>
              <Link className= 'nav-link'to={'/'}>Destaques</Link>
              <Link className= 'nav-link'to={'/'}>Books</Link>
              <Link className= 'nav-link'to={'/'}>Profile</Link>
              <Link className= 'nav-link'to={username ? '/' : '/Login'}>{username ? username : 'Login'}</Link>
          </div>
            
        </div>
    )
}