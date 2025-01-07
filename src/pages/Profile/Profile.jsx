import React, { useState, useEffect } from "react";
import "./styles.css";
import { IoArrowForward } from "react-icons/io5";
import { FaCog } from "react-icons/fa";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [toRead, setToRead] = useState([]);
  const [history, setHistory] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalType, setModalType] = useState(null);

  const username = sessionStorage.getItem("username");
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

  const openModal = (type) => {
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
  };

  const goToSettings = () => {
    window.location.href = "/settings";
  };

  if (loading) {
    return <div className="loading-profile">Carregando...</div>;
  }

  if (error) {
    return <div className="error-profile">Erro: {error}</div>;
  }

  return (
    <div className="profile-page">
      <header className="header-profile">
        <img
          src={profile.profilePicture}
          alt="Profile"
          className="image-profile"
        />
        <div className="info-profile">
          <h1>{profile.username}</h1>
          <p>{profile.biography}</p>
        </div>
        <button className="settings-button-profile" onClick={goToSettings}>
          <FaCog size={24} />
        </button>
      </header>
      <section className="stats-profile">
        <div className="stat-box-profile" onClick={() => openModal("followers")}>
          <h2>Seguidores</h2>
          <p>{followers.length}</p>
        </div>
        <div className="stat-box-profile" onClick={() => openModal("following")}>
          <h2>Seguindo</h2>
          <p>{following.length}</p>
        </div>
        <div className="stat-box-profile">
          <h2>Favoritos</h2>
          <p>{favorites.length}</p>
        </div>
      </section>
      <section className="lists-profile">
        <BookList title="Favoritos" books={favorites} />
        <BookList title="Ver Mais Tarde" books={toRead} />
        <BookList title="Histórico" books={history} />
      </section>
      <section className="activity-profile">
        <h2>Atividade Recente</h2>
        <ul className="activity-list-profile">
          {recentActivity.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
      </section>
      {modalType && (
        <Modal
          type={modalType}
          data={modalType === "followers" ? followers : following}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

function Modal({ type, data, onClose }) {
  return (
    <div className="modal-profile">
      <div className="modal-content-profile">
        <h2>{type === "followers" ? "Seguidores" : "Seguindo"}</h2>
        <ul>
          {data.map((user, index) => (
            <li key={index}>
              <img src={user.profilePicture} alt={user.name} className="user-image-profile" />
              <span>{user.name}</span>
            </li>
          ))}
        </ul>
        <button className="close-modal-profile" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
}

function BookList({ title, books }) {
  return (
    <div className="book-list-profile">
      <h2>{title}</h2>
      <div className="book-items-profile">
        {books.map((book) => (
          <div key={book.id} className="book-card-profile">
            <img src={book.imageUrl} alt={book.title} className="book-image-profile" />
            <p className="book-title-profile">{book.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
