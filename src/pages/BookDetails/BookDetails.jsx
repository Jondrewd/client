import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./styles.css";
import Button from "../../components/Button/Button";

export default function BookDetails() {
  const { title } = useParams(); 
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [isFavorite, setIsFavorite] = useState(false);
  const [isReadLater, setIsReadLater] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const bookResponse = await axios.get(
          `http://localhost:8080/books/title/${title}?page=0&size=1&direction=asc`
        );
        const bookData = bookResponse.data.content[0]; 
        setBook(bookData);

        const relatedResponse = await axios.get(
          `http://localhost:8080/books?genre=${bookData.genre}&page=0&size=4&direction=asc`
        );
        setRelatedBooks(relatedResponse.data.content);

        const reviewsResponse = await axios.get(
          `http://localhost:8080/books/${bookData.id}/reviews`
        );
        setReviews(reviewsResponse.data.content);
      } catch (error) {
        console.error("Erro ao carregar os detalhes do livro:", error);
      }
    };

    fetchBookDetails();
  }, [title]);

  const handleAddToFavorites = () => {
    setIsFavorite(true);
    alert("Livro adicionado aos favoritos!");
  };

  const handleAddToReadLater = () => {
    setIsReadLater(true);
    alert("Livro adicionado à lista para ler mais tarde!");
  };

  if (!book) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="book-details-container">
      <div className="book-details-main">
        <img src={book.imageUrl} alt={book.title} className="book-details-image" />
        <div className="book-details-info">
          <h1 className="book-title">{book.title}</h1>
          <p className="book-author">
            Por: <a href={`/author/${book.author.id}`}>{book.author}</a>
          </p>
          <p className="book-description">{book.description}</p>
          <div className="book-details-extra">
            <p><strong>Gênero:</strong> {book.genre}</p>
            <p><strong>Páginas:</strong> {book.pageCount}</p>
            <p><strong>Publicado em:</strong> {new Date(book.publishedDate).toLocaleDateString()}</p>
            <p><strong>Avaliação:</strong> ⭐ {book.rating} / 5</p>
          </div>
          <a href={book.purchaseLink} target="_blank" rel="noopener noreferrer" className="buy-button">Comprar Agora</a>

          <div className="action-buttons">
            <button
              className={`action-button ${isFavorite ? "added" : ""}`}
              onClick={handleAddToFavorites}
              disabled={isFavorite}
            >
              {isFavorite ? "Adicionado aos Favoritos" : "Adicionar aos Favoritos"}
            </button>
            <button
              className={`action-button ${isReadLater ? "added" : ""}`}
              onClick={handleAddToReadLater}
              disabled={isReadLater}
            >
              {isReadLater ? "Adicionado para Ler Mais Tarde" : "Adicionar para Ler Mais Tarde"}
            </button>
          </div>
        </div>
      </div>

      <section className="book-reviews">
        <h2>Avaliações</h2>
        {reviews.length > 0 ? (
          <div className="review-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <p><strong>{review.user.username}:</strong> ⭐ {review.rating}</p>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Sem avaliações para este livro.</p>
        )}
      </section>

      <section className="related-books">
        <h2>Mais livros em {book.genre}</h2>
        <div className="related-books-grid">
          {relatedBooks.map((relatedBook) => (
            <div key={relatedBook.id} className="related-book-card">
              <img src={relatedBook.imageUrl} alt={relatedBook.title} />
              <h3>{relatedBook.title}</h3>
              <p>{relatedBook.author}</p>
              <Button bookTitle={relatedBook.title} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
