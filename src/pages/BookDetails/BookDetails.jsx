import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiStar, FiBookOpen, FiBookmark, FiShare2 } from 'react-icons/fi';
import api from '../../services/api';
import './styles.css';

const BookDetails = () => {
  const { title } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleGoBack = () => {
    navigate(-1);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const shareBook = () => {
    if (navigator.share) {
      navigator.share({
        title: `Recomendo o livro: ${book.title}`,
        text: `Estou lendo ${book.title} por ${book.author} e recomendo!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        
        const bookResponse = await api.get(`/books/title/${decodeURIComponent(title)}`);
        
        if (bookResponse.data.content && bookResponse.data.content.length > 0) {
          const foundBook = bookResponse.data.content[0];
          setBook(foundBook);
          
          if (foundBook.genre && foundBook.genre.length > 0) {
            const relatedResponse = await api.get(
              `/books?genre=${foundBook.genre[0]}&size=4&exclude=${title}`
            );
            setRelatedBooks(relatedResponse.data.content || []);
          }
        } else {
          setError("Livro não encontrado");
        }
        
      } catch (err) {
        setError("Erro ao carregar detalhes do livro");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [title]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner-bookdetails"></div>
        <p>Carregando livro...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={handleGoBack} className="back-button">
          Voltar
        </button>
      </div>
    );
  }

  if (!book) {
    return null;
  }

  return (
    <div className="book-details-container">
      <button onClick={handleGoBack} className="back-button">
        <FiArrowLeft /> Voltar
      </button>
      
      <div className="book-main-content">
        <div className="book-cover-container">
          {book.imageUrl ? (
            <img src={book.imageUrl} alt={book.title} className="book-details-cover" />
          ) : (
            <div className="book-cover-placeholder">
              <FiBookOpen size={48} />
            </div>
          )}
          <div className="book-actions">
            <button 
              onClick={toggleBookmark} 
              className={`action-button ${isBookmarked ? 'bookmarked' : ''}`}
            >
              <FiBookmark /> {isBookmarked ? 'Salvo' : 'Salvar'}
            </button>
            <button onClick={shareBook} className="action-button">
              <FiShare2 /> Compartilhar
            </button>
          </div>
        </div>
        
        <div className="book-info">
          <h1>{book.title}</h1>
          <h2>por {book.author}</h2>
          
          <div className="rating-container">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <FiStar 
                  key={i} 
                  className={i < Math.floor(book.rating) ? 'filled' : ''} 
                />
              ))}
            </div>
            <span>{book.rating.toFixed(1)}</span>
          </div>
          
          <div className="genre-container">
            {book.genre && book.genre.map((g, index) => (
              <span key={index} className="genre-tag">{g}</span>
            ))}
          </div>
          
          <div className="book-description">
            <h3>Sinopse</h3>
            <p>{book.description || 'Sinopse não disponível.'}</p>
          </div>
        </div>
      </div>
      
      {relatedBooks.length > 0 && (
        <div className="related-books">
          <h2>
            <FiBookOpen /> Livros do mesmo gênero
          </h2>
          <div className="related-books-grid">
            {relatedBooks.map((relatedBook, index) => (
              <div 
                key={index} 
                className="related-book-card"
                onClick={() => navigate(`/bookDetails/${encodeURIComponent(relatedBook.title)}`)}
              >
                {relatedBook.imageUrl ? (
                  <img src={relatedBook.imageUrl} alt={relatedBook.title} className="related-book-cover" />
                ) : (
                  <div className="related-book-cover-placeholder">
                    <FiBookOpen size={24} />
                  </div>
                )}
                <h3>{relatedBook.title}</h3>
                <p className="related-book-author">{relatedBook.author}</p>
                <div className="related-book-rating">
                  <FiStar className="filled" /> {relatedBook.rating.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;