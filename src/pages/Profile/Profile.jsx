import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiBookOpen, FiBookmark, FiStar, FiUsers, FiHeart } from 'react-icons/fi';
import api from '../../services/api';
import './styles.css';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('reviews');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const username = sessionStorage.getItem('username');
        
        if (!username) {
          throw new Error('Nenhum usuário logado');
        }

        const response = await api.get(`/profile/username/${username}`);
        setProfile(response.data);
        
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Perfil não encontrado</h2>
        <p>{error}</p>
        <button 
          className="action-button"
          onClick={() => navigate('/login')}
        >
          Ir para Login
        </button>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.urlIcon ? (
            <img src={profile.urlIcon} alt={profile.username} />
          ) : (
            <FiUser size={48} />
          )}
        </div>
        <div className="profile-info">
          <h1>@{profile.username}</h1>
          {profile.biography && (
            <p className="profile-bio">{profile.biography}</p>
          )}
          
          <div className="profile-stats">
            <div className="stat">
              <FiUsers className="icon" />
              <span>seguidores {profile.followers.length} </span>
            </div>
            <div className="stat">
              <FiUser className="icon" />
              <span>Seguindo {profile.following.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          <FiStar /> Avaliações ({profile.reviews.length})
        </button>
        <button 
          className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          <FiHeart /> Favoritos ({profile.favoriteBooks.length})
        </button>
        <button 
          className={`tab ${activeTab === 'wishlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('wishlist')}
        >
          <FiBookmark /> Quero Ler ({profile.wishList.length})
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'reviews' && (
          <div className="reviews-list">
            {profile.reviews.length > 0 ? (
              profile.reviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="book-info">
                    <h3>{review.bookTitle}</h3>
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <FiStar 
                          key={i} 
                          className={i < review.rating ? 'filled' : ''} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="review-text">{review.content}</p>
                </div>
              ))
            ) : (
              <p className="empty-message">Nenhuma avaliação encontrada</p>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="books-grid">
            {profile.favoriteBooks.length > 0 ? (
              profile.favoriteBooks.map(book => (
                <div 
                  key={book.id} 
                  className="book-card"
                  onClick={() => navigate(`/bookDetails/${encodeURIComponent(book.title)}`)}
                >
                  <div className="book-cover">
                    {book.imageUrl ? (
                      <img src={book.imageUrl} alt={book.title} />
                    ) : (
                      <FiBookOpen size={32} />
                    )}
                  </div>
                  <h3>{book.title}</h3>
                  <p className="author">{book.author}</p>
                </div>
              ))
            ) : (
              <p className="empty-message">Nenhum livro favorito</p>
            )}
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="books-grid">
            {profile.wishList.length > 0 ? (
              profile.wishList.map(book => (
                <div 
                  key={book.id} 
                  className="book-card"
                  onClick={() => navigate(`/bookDetails/${encodeURIComponent(book.title)}`)}
                >
                  <div className="book-cover">
                    {book.imageUrl ? (
                      <img src={book.imageUrl} alt={book.title} />
                    ) : (
                      <FiBookOpen size={32} />
                    )}
                  </div>
                  <h3>{book.title}</h3>
                  <p className="author">{book.author}</p>
                </div>
              ))
            ) : (
              <p className="empty-message">Lista de desejos vazia</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;