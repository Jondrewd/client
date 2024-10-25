import React, {useState, useEffect} from 'react';
import './styles.css'
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Inicio(){
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();

    const acessToken = localStorage.getItem('acessToken')

useEffect(()=>{
    api.get('/books').then(response => {
        setBooks(response.data.content)
    })
    const primaryColor = books.imageUrl;
    document.documentElement.style.setProperty('--primary-color', primaryColor);
})
 /*{
  "totalElements": 0,
  "totalPages": 0,
  "size": 0,
  "content": [
    {
      "id": 0,
      "title": "string",
      "author": "string",
      "rating": 0,
      "genre": [
        "FANTASY"
      ],*/ 

    return(
        <div className="inicio-container">
            <div className="layout-registrar">
                <div className="imagem-inicio"> </div>
                
                <div className="texto-inicio">
                    <h1>Faça login para aproveitar melhor o site.</h1>
                    <Link to={'/login'}>
                        <button className="login-button">login</button>
                        <p>Registre-se</p>
                    </Link>
                </div>
            </div>

            <h1 className='destaques'>Generos em destaque:</h1>
            <div className="session-inicio">
                
                <div className="sessions-inicio s1"><p className='p-destaques'>Fantasy</p></div>
                <div className="sessions-inicio s2"><p className='p-destaques'>Horror</p></div>
                <div className="sessions-inicio s3"><p className='p-destaques'>Sci-fi</p></div>
                <div className="sessions-inicio s4"><p className='p-destaques'>Suspense</p></div>
            </div>

            <div className="books-inicio"> 
                <div className="book-session">
                    <p>Filtrar por genero</p>
                    <p>Ordenar por notas </p>
                    <p>Ordenar por nome</p>
                    <p>Ordenar por autor</p>
                </div>

                <div className='book-container'>
                    {books.map(book => (
                        <li>
                            <div className="book-display"
                                style={{backgroundImage:`url(${book.imageUrl})`}}>
                            </div>
                            <div className='book-text'>
                                <h1 className="title">Titulo: {book.title}</h1>
                                <h2 className='author'>Autor: {book.author}</h2>
                                <h2 className='rating'>Nota: {book.rating}</h2>
                                <h2 className='genre'> Genero: {book.genre}</h2>
                            </div>
                        </li>
                        ))}
                    
                </div>
                
            </div>
        </div>

    )
}