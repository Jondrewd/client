import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Book from './pages/Book';
import Navbar from './components/Navbar/navbar';
import Inicio from './pages/Inicio/inicio';
import Register from './pages/login/index2';

//UseHistory == useNavigate
export default function AppRoutes(){
    return(
        <BrowserRouter>
        <Navbar />
            <Routes>
            <Route path='/' exact element={<Inicio/>}/>   
                <Route path='/login' exact element={<Login/>}/>  
                <Route path='/register' exact element={<Register/>}/>    
                <Route path='/books' exact element={<Book/>}/>    
                
            </Routes>
        </BrowserRouter>
    )
}