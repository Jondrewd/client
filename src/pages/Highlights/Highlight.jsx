import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

export default function Highlights() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [popularAuthors, setPopularAuthors] = useState([]);
  const [popularCategories, setPopularCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksResponse = await axios.get("http://localhost:8080/books?page=0&size=5&direction=desc");
        const books = booksResponse.data.content;

        setFeaturedBooks(books);

        const authors = [
          ...new Set(books.map((book) => book.author)), 
        ].slice(0, 5); 
        setPopularAuthors(
          authors.map((author, index) => ({
            id: index + 1,
            name: author,
            imageUrl: `https://via.placeholder.com/150?text=${author.replace(
              " ",
              "+"
            )}`,
            bio: `Autor(a) conhecido(a) por obras notáveis, como "${books.find(
              (book) => book.author === author
            ).title}".`,
          }))
        );

        const genres = [
          ...new Set(books.flatMap((book) => book.genre)),
        ].slice(0, 3);
        setPopularCategories(
          genres.map((genre, index) => ({
            id: index + 1,
            name: genre,
          }))
        );
      } catch (error) {
        console.error("Erro ao carregar os dados:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="highlights-page">
      <h1>Destaques</h1>

      <section className="highlight-section">
        <h2>Livros em Destaque</h2>
        <div className="highlight-grid">
          {featuredBooks.map((book) => (
            <div key={book.id} className="highlight-card">
              <img src={book.imageUrl} alt={book.title} />
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <p className="rating">⭐ {book.rating}</p>
              <p className="description">{book.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="highlight-section">
        <h2>Autores do Momento</h2>
        <div className="highlight-grid">
          {popularAuthors.map((author) => (
            <div key={author.id} className="highlight-card">
              <img src={author.imageUrl} alt={author.name} />
              <h3>{author.name}</h3>
              <p>{author.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="highlight-section">
        <h2>Categorias Populares</h2>
        <div className="category-list">
          {popularCategories.map((category) => (
            <div key={category.id} className="category-item">
              <p>{category.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
