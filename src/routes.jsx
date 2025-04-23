import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Book from './pages/Book';
import Navbar from './components/Navbar/navbar';
import Footer from './components/Footer/footer';
import Inicio from './pages/Inicio/inicio';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import Highlights from './pages/Highlights/Highlight';
import BookDetails from './pages/BookDetails/BookDetails';

export default function AppRoutes(){
    return(
        <BrowserRouter>
        <Navbar />
            <Routes>
            <Route path='/' exact element={<Inicio/>}/>   
                <Route path='/login' exact element={<Login/>}/>  
                <Route path='/register' exact element={<Register/>}/>    
                <Route path='/books' exact element={<Book/>}/>    
                <Route path='/perfil' exact element={<Profile/>}/>    
                <Route path='/settings' exact element={<Settings/>}/>  
                <Route path='/destaques' exact element={<Highlights/>}/> 
                <Route path='/bookDetails/:title' exact element={<BookDetails/>}/> 
            </Routes>
            <Footer/>
        </BrowserRouter>
    )
}