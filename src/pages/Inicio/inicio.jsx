import React, { useState, useEffect } from "react";
import "./styles.css";
import { Link } from "react-router-dom";
import Dropdown from "../../components/Dropdown/Dropdown";
import api from "../../services/api";
import Button from "../../components/Button/Button";

export default function Inicio() {
    const generoOptions = ["Ficção", "Romance", "Aventura", "Terror"];
    const notasOptions = ["Alta para Baixa", "Baixa para Alta"];
    const nomeOptions = ["A-Z", "Z-A"];
    const [books, setBooks] = useState([]);
    const [size, setSize] = useState(6);
    const [direction, setDirection] = useState("asc");

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
                    <h1>Descubra e Compartilhe Livros</h1>
                    <p>Leia, avalie e explore livros incríveis!</p>
                    <Link to="/login" className="btn-primary">Comece agora</Link>
                </div>
            </div>

            <h2 className="section-title">Gêneros Populares</h2>
            <div className="genres">
                {["Ficção", "Fantasia", "Suspense", "Romance"].map((genre, idx) => (
                    <div key={idx} className="genre-card">
                        <p>{genre}</p>
                    </div>
                ))}
            </div>

            <h2 className="section-title">Explore Livros</h2>
            

            <div className="books-inicio">
                {books.map((book) => (
                    <div key={book.id} className="book-card-inicio">
                        <div
                            className="book-cover-inicio"
                            style={{ backgroundImage: `url(${book.imageUrl})` }}
                        ></div>
                        <div className="book-info-inicio">
                            <h3>{book.title}</h3>
                            <p>{book.author}</p>
                            <p>{book.genre.join(", ")}</p>
                            <p>Nota: {book.rating}</p>
                            <Button bookTitle={book.title} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
