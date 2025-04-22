import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBookOpen, FiHeart, FiTrendingUp, FiChevronLeft, FiChevronRight, FiCompass } from 'react-icons/fi';
import './styles.css';
import api from '../../services/api';

const Inicio = () => {
  const [books, setBooks] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('explore');
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroRef = useRef(null);
  const [booksByCategory, setBooksByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [trendingData, setTrendingData] = useState([]);
  const [discoverData, setDiscoverData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        const exploreResponse = await api.get('/books?size=10&sort=releaseDate,desc');
        setBooks(exploreResponse.data.content);
        
        const topRatedResponse = await api.get('/books?sort=rating,desc&size=5');
        setFeaturedBooks(topRatedResponse.data.content);
        
        const trendingResponse = await api.get('/books?size=10&minRating=4&sort=reviewCount,desc');
        setTrendingData(trendingResponse.data.content);
        
        const discoverResponse = await api.get('/books?size=10');
        setDiscoverData(shuffleArray(discoverResponse.data.content));
        
      } catch (error) {
        console.error("Erro ao buscar os livros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    api.get(`/books?title=${searchQuery}`)
      .then((response) => {
        if (activeTab === 'explore') setBooks(response.data.content);
        if (activeTab === 'trending') setTrendingData(response.data.content);
        if (activeTab === 'discover') setDiscoverData(response.data.content);
      })
      .catch((error) => console.error("Erro ao buscar os livros:", error));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === featuredBooks.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? featuredBooks.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredBooks.length]);

  const handleBookClick = (bookTitle) => {
    navigate(`/bookDetails/${encodeURIComponent(bookTitle)}`);
  };

  const getActiveTabData = () => {
    switch(activeTab) {
      case 'trending':
        return trendingData;
      case 'discover':
        return discoverData;
      default:
        return books;
    }
  };

  const getActiveTabTitle = () => {
    switch(activeTab) {
      case 'explore':
        return <><FiBookOpen className="title-icon" /> Lançamentos Recentes</>;
      case 'trending':
        return <><FiTrendingUp className="title-icon" /> Tendências da Semana</>;
      case 'discover':
        return <><FiCompass className="title-icon" /> Descubra Para Você</>;
      default:
        return <><FiBookOpen className="title-icon" /> Explorar</>;
    }
  };

  if (loading) {
    return <div className="loading-spinner">Carregando...</div>;
  }

  return (
    <div className="GonkLib-container">
      <main className="main-content">
        <div className="tab-navigation">
          {[
            { id: 'explore', icon: <FiBookOpen />, label: 'Explorar' },
            { id: 'trending', icon: <FiTrendingUp />, label: 'Tendências' },
            { id: 'discover', icon: <FiCompass />, label: 'Descobrir' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active-tab' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <section className="hero-section" ref={heroRef}>
          {featuredBooks.length > 0 && (
            <>
              <div className="hero-overlay"></div>
              <img 
                src={featuredBooks[currentSlide].imageUrl} 
                alt={featuredBooks[currentSlide].title}
                className="hero-image"
              />
              <div className="hero-content">
                <span className="hero-badge">Livro em Destaque</span>
                <h2 className="hero-title">{featuredBooks[currentSlide].title}</h2>
                <p className="hero-description">{featuredBooks[currentSlide].description || 'Descrição não disponível'}</p>
                <div className="hero-buttons">
                  <button 
                    className="secondary-button"
                    onClick={() => handleBookClick(featuredBooks[currentSlide].title)}
                  >
                    Ver detalhes
                  </button>
                  <button className="primary-button">Adicionar à lista</button>
                </div>
              </div>
              
              <button className="carousel-control prev" onClick={prevSlide}>
                <FiChevronLeft size={24} />
              </button>
              <button className="carousel-control next" onClick={nextSlide}>
                <FiChevronRight size={24} />
              </button>
              
              <div className="carousel-indicators">
                {featuredBooks.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        <section className="books-section">
          <h3 className="section-title">
            {getActiveTabTitle()}
          </h3>
          
          <div className="books-grid">
            {getActiveTabData().map((book) => (
              <div 
                key={book.id} 
                className="book-card"
                onClick={() => handleBookClick(book.title)}
              >
                <div className="book-cover">
                  <img 
                    src={book.imageUrl} 
                    alt={book.title}
                    className="book-image"
                  />
                </div>
                <div className="book-info">
                  <h4 className="book-title">{book.title}</h4>
                  <p className="book-author">{book.author}</p>
                  <div className="book-rating">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className="star-icon" 
                        viewBox="0 0 20 20"
                        fill={i < Math.round(book.rating) ? "#FFD700" : "#C4C4C4"}
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="rating-count">({book.reviewCount || 0})</span>
                  </div>
                </div>
                <button 
                  className="favorite-button"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiHeart className="favorite-icon" />
                </button>
              </div>
            ))}
          </div>
        </section>
        <button 
          className="view-all-button"
          onClick={() => navigate('/books')}
        >
          Ver Mais
      </button>

        {activeTab === 'explore' && Object.entries(booksByCategory).map(([category, books]) => (
          <section key={category} className="category-section">
            <h3 className="section-title">{category}</h3>
            <div className="books-grid">
              {books.map((book) => (
                <div 
                  key={book.id} 
                  className="book-card"
                  onClick={() => handleBookClick(book.title)}
                >
                  <div className="book-cover">
                    <img 
                      src={book.imageUrl} 
                      alt={book.title}
                      className="book-image"
                    />
                  </div>
                  <div className="book-info">
                    <h4 className="book-title">{book.title}</h4>
                    <p className="book-author">{book.author}</p>
                    <div className="book-rating">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className="star-icon" 
                          viewBox="0 0 20 20"
                          fill={i < Math.round(book.rating) ? "#FFD700" : "#C4C4C4"}
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="rating-count">({book.reviewCount || 0})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="see-more-button">Ver mais em {category}</button>
          </section>
        ))}
      </main>
    </div>
  );
};

export default Inicio;