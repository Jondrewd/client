import React, { useState, useEffect } from 'react';
import './styles.css';
import api from "../../services/api";
import Dropdown from '../../components/Dropdown/Dropdown';
import { IoArrowForward } from "react-icons/io5";
import AutoComplete from '../../components/AutoComplete/AutoComplete'; 
import Button from "../../components/Button/Button";

export default function Books() {
    const generoOptions = ['Ficção', 'Romance', 'Aventura', 'Terror']; 
    const notasOptions = ['Alta para Baixa', 'Baixa para Alta'];
    const nomeOptions = ['A-Z', 'Z-A']; 
    const autorOptions = ['A-Z', 'Z-A'];
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(0); 
    const [direction, setDirection] = useState('asc');
    const [size, setSize] = useState(8);
    const [loading, setLoading] = useState(false); 
    const [title, setTitle] = useState(''); 

    const handleSelect = (option) => {
        setDirection(option === 'A-Z' ? 'asc' : 'desc');
    };

    const fetchMoreBooks = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/books?page=${page}&size=${size}&direction=${direction}`);
            setBooks(prevBooks => {
                const newBooks = response.data.content.filter(book => 
                    !prevBooks.some(prevBook => prevBook.id === book.id)
                );
                console.log(response)
                return [...prevBooks, ...newBooks];
            });
        } catch (error) {
            console.error('Erro ao buscar os livros:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMoreBooks();
    }, [page, direction, size]); 

    const loadMoreBooks = () => {
        if (!loading) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const getBooksByTitle = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/books/title/${title}?page=${page}&size=${size}&direction=${direction}`);
            setBooks(response.data.content);
        } catch (error) {
            console.error('Erro ao buscar os livros:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (title) {
            getBooksByTitle();
        }
    }, [title]);

    return (
        <div className="book-page">
            <div className="header">
                <h1>Descubra Novos Livros</h1>
                <div className="filters">
                    <Dropdown label="Gênero" options={generoOptions} /> 
                    <Dropdown label="Notas" options={notasOptions} /> 
                    <Dropdown label="Nome" options={nomeOptions} onSelect={handleSelect}/> 
                    <Dropdown label="Autor" options={autorOptions} />
                    <AutoComplete setTitle={setTitle} placeholder="Buscar por título..." />
                </div>
            </div>
            <div className="book-grid">
                {books.map((book) => (
                    <div className="book-card" key={book.id}>
                        <div 
                            className="book-image" 
                            style={{ backgroundImage: `url(${book.imageUrl || 'https://via.placeholder.com/300'})` }}
                        ></div>
                        <div className="book-info">
                            <h2>{book.title}</h2>
                            <p className="author">{book.author}</p>
                            <p className="genre">{book.genre.join(', ')}</p>
                            <p className="rating">Nota: {book.rating}</p>
                            <Button bookTitle={book.title}/>
                        </div>
                    </div>
                ))}
            </div>
            <button className="load-more" onClick={loadMoreBooks} disabled={loading}>
                {loading ? 'Carregando...' : 'Carregar Mais'}
                <IoArrowForward />
            </button>
        </div>
    );
}
