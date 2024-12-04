import React, { useState, useEffect } from "react";
import "./styles.css";
import { IoArrowForward } from "react-icons/io5";

export default function Profile() {
  // Estados para armazenar os dados do perfil e suas listas
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [toRead, setToRead] = useState([]);
  const [history, setHistory] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const username = sessionStorage.getItem('username');
  const apiEndpoint = `http://localhost:8080/profile/username/${username}`;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error("Erro ao buscar os dados do perfil.");
        }

        const data = await response.json();
        setProfile(data);
        setFavorites(data.favoriteBooks || []);
        setToRead(data.wishList || []);
        setHistory(data.historyBooks || []);
        setFollowers(data.followers || []);
        setFollowing(data.following || []);
        setRecentActivity(data.recentActivity || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [apiEndpoint]);

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (error) {
    return <div className="error">Erro: {error}</div>;
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <img
          src={profile.profilePicture}
          alt="Profile"
          className="profile-image"
        />
        <div className="profile-info">
          <h1>{profile.profileName}</h1>
          <p>{profile.biography}</p>
        </div>
      </header>
      <section className="profile-stats">
        <div className="stat">
          <h2>Seguidores</h2>
          <p>{followers.length}</p>
        </div>
        <div className="stat">
          <h2>Seguindo</h2>
          <p>{following.length}</p>
        </div>
        <div className="stat">
          <h2>Favoritos</h2>
          <p>{favorites.length}</p>
        </div>
      </section>
      <section className="profile-lists">
        <div className="list">
          <h2>Favoritos</h2>
          <div className="list-items">
            {favorites.map((book) => (
              <div
                key={book.id}
                className="book-card"
                style={{ backgroundImage: `url(${book.imageUrl})` }}
              >
                <p>{book.title}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="list">
          <h2>Ver Mais Tarde</h2>
          <div className="list-items">
            {toRead.map((book) => (
              <div
                key={book.id}
                className="book-card"
                style={{ backgroundImage: `url(${book.imageUrl})` }}
              >
                <p>{book.title}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="list">
          <h2>Histórico</h2>
          <div className="list-items">
            {history.map((book) => (
              <div
                key={book.id}
                className="book-card"
                style={{ backgroundImage: `url(${book.imageUrl})` }}
              >
                <p>{book.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="profile-activity">
        <h2>Atividade Recente</h2>
        <ul>
          {recentActivity.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
