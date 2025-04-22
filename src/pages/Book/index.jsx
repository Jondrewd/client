import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFilter, FiStar, FiBookOpen, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './styles.css';
import api from '../../services/api';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  // Gêneros como enum numérico (1-7) com labels
  const [genres] = useState([
    { id: 0, name: 'Todos' },
    { id: 1, name: 'Romance' },
    { id: 2, name: 'Ficção Científica' },
    { id: 3, name: 'Terror' },
    { id: 4, name: 'Fantasia' },
    { id: 5, name: 'Suspense' },
    { id: 6, name: 'Biografia' },
    { id: 7, name: 'História' }
  ]);
  const [selectedGenre, setSelectedGenre] = useState(0); // 0 = Todos
  const [minRating, setMinRating] = useState(0);
  const [sortOption, setSortOption] = useState('title-asc');
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 1,
    totalElements: 0,
    pageSize: 15
  });
  const navigate = useNavigate();

  // Função para construir a URL correta
  const buildApiUrl = () => {
    const { currentPage, pageSize } = pagination;
    const [sortField, sortDirection] = sortOption.split('-');
    
    if (selectedGenre !== 0) {
      return `/books/genre/${selectedGenre}?page=${currentPage}&size=${pageSize}&direction=${sortDirection}`;
    }
    
    if (minRating > 0) {
      return `/books/rating/${minRating}?page=${currentPage}&size=${pageSize}&direction=${sortDirection}`;
    }
    
    return `/books?page=${currentPage}&size=${pageSize}&sort=${sortField},${sortDirection}`;
  };

  // Buscar livros
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const url = buildApiUrl();
      const response = await api.get(url);
      
      setBooks(response.data.content);
      setPagination({
        ...pagination,
        currentPage: response.data.page.number,
        totalPages: response.data.page.totalPages,
        totalElements: response.data.page.totalElements
      });
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar quando filtros ou página mudam
  useEffect(() => {
    fetchBooks();
  }, [selectedGenre, minRating, sortOption, pagination.currentPage]);

  // Função auxiliar para aplicar filtros
  const applyFilter = (filterUpdater) => (value) => {
    filterUpdater(value);
    setPagination(prev => ({ ...prev, currentPage: 0 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  const handleBookClick = (bookTitle) => {
    navigate(`/bookDetails/${encodeURIComponent(bookTitle)}`);
  };

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    const { currentPage, totalPages } = pagination;
    
    if (currentPage > Math.floor(maxVisiblePages / 2)) {
      pages.push(0);
      if (currentPage > Math.floor(maxVisiblePages / 2) + 1) {
        pages.push('...');
      }
    }
    
    const startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    if (currentPage < totalPages - Math.floor(maxVisiblePages / 2) - 1) {
      if (currentPage < totalPages - Math.floor(maxVisiblePages / 2) - 2) {
        pages.push('...');
      }
      pages.push(totalPages - 1);
    }
    
    return (
      <div className="pagination">
        <button 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          <FiChevronLeft />
        </button>
        
        {pages.map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="ellipsis">...</span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={currentPage === page ? 'active' : ''}
            >
              {page + 1}
            </button>
          )
        ))}
        
        <button 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          <FiChevronRight />
        </button>
      </div>
    );
  };

  if (loading && pagination.currentPage === 0) {
    return <div className="loading-spinner">Carregando...</div>;
  }

  return (
    <div className="books-page">
      <div className="books-header">
        <h1><FiBookOpen /> Catálogo de Livros</h1>
      </div>

      <div className="books-controls">
        <div className="filter-group">
          <label><FiFilter /> Gênero:</label>
          <select 
            value={selectedGenre} 
            onChange={(e) => applyFilter(setSelectedGenre)(Number(e.target.value))}
          >
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label><FiStar /> Nota mínima:</label>
          <select 
            value={minRating} 
            onChange={(e) => applyFilter(setMinRating)(Number(e.target.value))}
          >
            <option value={0}>Todas</option>
            <option value={1}>1+ estrela</option>
            <option value={2}>2+ estrelas</option>
            <option value={3}>3+ estrelas</option>
            <option value={4}>4+ estrelas</option>
            <option value={5}>5 estrelas</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Ordenar por:</label>
          <select 
            value={sortOption} 
            onChange={(e) => applyFilter(setSortOption)(e.target.value)}
          >
            <option value="title-asc">Título (A-Z)</option>
            <option value="title-desc">Título (Z-A)</option>
            <option value="rating-asc">Nota (crescente)</option>
            <option value="rating-desc">Nota (decrescente)</option>
          </select>
        </div>
      </div>

      <div className="books-grid">
        {books.length > 0 ? (
          books.map(book => (
            <div 
              key={book.id} 
              className="book-card"
              onClick={() => handleBookClick(book.title)}
            >
              <div className="book-cover">
                <img src={book.imageUrl} alt={book.title} />
              </div>
              <div className="book-info">
                <h3>{book.title}</h3>
                <p className="author">{book.author}</p>
                <div className="rating">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i} 
                      className={i < Math.floor(book.rating) ? 'filled' : ''} 
                    />
                  ))}
                  <span>({book.reviews?.length || 0})</span>
                </div>
                <div className="genres">
                  {book.genre?.slice(0, 3).map((genre, index) => (
                    <span key={index} className="genre-tag">
                      {genres.find(g => g.id === genre)?.name || genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : !loading && (
          <div className="no-results">
            <p>Nenhum livro encontrado com os filtros selecionados.</p>
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && books.length > 0 && (
        <div className="pagination-container">
          {renderPagination()}
          <div className="pagination-info">
            Página {pagination.currentPage + 1} de {pagination.totalPages} | 
            Total de {pagination.totalElements} livros
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;