import React, { useState, useEffect } from "react";
import "./styles.css";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from "../../components/Dropdown/Dropdown";
import api from "../../services/api";

export default function Inicio() {
    const generoOptions = ["Ficção", "Romance", "Aventura", "Terror"];
    const notasOptions = ["Alta para Baixa", "Baixa para Alta"];
    const nomeOptions = ["A-Z", "Z-A"];
    const autorOptions = ["A-Z", "Z-A"];
    const [books, setBooks] = useState([]);
    const [size, setSize] = useState(6);
    const [direction, setDirection] = useState("asc");
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/books?page=0&size=${size}&direction=${direction}`)
            .then((response) => setBooks(response.data.content))
            .catch((error) => console.error("Erro ao buscar os livros:", error));
    }, [size, direction]);

    const handleSelect = (option) => {
        setDirection(option === "A-Z" ? "asc" : "desc");
    };

    return (
        <div className="inicio-container">
            <div className="hero">
                <div className="hero-text">
                    <h1>Bem-vindo ao BookLovers</h1>
                    <p>Descubra, avalie e compartilhe seus livros favoritos.</p>
                    <Link to="/login" className="btn-primary">Comece agora</Link>
                </div>
            </div>

            <h2 className="section-title">Gêneros em Destaque</h2>
            <div className="genres">
                {["Fantasy", "Horror", "Sci-fi", "Suspense"].map((genre, idx) => (
                    <div key={idx} className="genre-card">
                        <p>{genre}</p>
                    </div>
                ))}
            </div>

            <h2 className="section-title">Explore Livros</h2>
            <div className="filters">
                <Dropdown label="Filtrar por Gênero" options={generoOptions} />
                <Dropdown label="Ordenar por Notas" options={notasOptions} />
                <Dropdown label="Ordenar por Nome" options={nomeOptions} onSelect={handleSelect} />
                <Dropdown label="Ordenar por Autor" options={autorOptions} />
            </div>

            <div className="books">
                {books.map((book) => (
                    <div key={book.id} className="book-card">
                        <div
                            className="book-cover"
                            style={{ backgroundImage: `url(${book.imageUrl})` }}
                        ></div>
                        <div className="book-info">
                            <h3>{book.title}</h3>
                            <p>{book.author}</p>
                            <p>{book.genre.join(", ")}</p>
                            <p>Nota: {book.rating}</p>
                            <button onClick={() => navigate(`/books/${book.id}`)} className="btn-secondary">
                                Ver Detalhes
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
