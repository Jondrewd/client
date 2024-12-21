import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import "./styles.css";
import Button from "../../components/Button/Button";

export default function Highlights() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [popularAuthors, setPopularAuthors] = useState([]);
  const [popularCategories, setPopularCategories] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksResponse = await axios.get("http://localhost:8080/books?page=0&size=5&direction=desc");
        const books = booksResponse.data.content;
        setFeaturedBooks(books);

        const authorIds = [1, 2, 3, 4];
        const authors = await Promise.all(
          authorIds.map(async (id) => {
            const response = await axios.get(`http://localhost:8080/author/${id}`);
            return response.data;
          })
        );
        setPopularAuthors(authors);

        const genres = [...new Set(books.flatMap((book) => book.genre))].slice(0, 3);
        setPopularCategories(genres.map((genre, index) => ({ id: index + 1, name: genre })));
      } catch (error) {
        console.error("Erro ao carregar os dados:", error);
      }
    };

    fetchData();
  }, []);

  const goToBookDetails = (title) => {
    navigate(`/bookDetails/${title}`); 
  };

  return (
    <div className="highlights-container">
      <header className="highlights-header">
        <h1>Destaques Literários</h1>
        <p>Descubra os livros mais populares, os autores mais aclamados e as categorias que estão em alta.</p>
      </header>

      <section className="highlights-featured">
        <h2 className="texto-h2">Livros em Destaque</h2>
        <div className="highlights-grid">
          {featuredBooks.map((book) => (
            <div key={book.id} className="highlight-card">
              <img src={book.imageUrl} alt={book.title} className="highlight-card-image" />
              <div className="highlight-card-content">
                <h3 className="highlight-card-title">{book.title}</h3>
                <p className="highlight-card-author">{book.author}</p>
                <p className="highlight-card-rating">⭐ {book.rating}</p>
                <Button bookTitle={book.title}/>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="highlights-authors">
        <h2 className="texto-h2">Autores Populares</h2>
        <div className="highlights-grid">
          {popularAuthors.map((author) => (
            <div key={author.id} className="author-card">
              <img src={author.imageUrl || "https://via.placeholder.com/150"} alt={author.name} className="author-card-image" />
              <div className="author-card-content">
                <h3 className="author-card-name">{author.name}</h3>
                <p className="author-card-bio">{author.description}</p>
                <p className="author-card-nationality">📍 {author.nationality}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="highlights-categories">
        <h2 className="texto-h2">Categorias Populares</h2>
        <div className="categories-list">
          {popularCategories.map((category) => (
            <span key={category.id} className="category-chip">{category.name}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
