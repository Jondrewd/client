import React from "react";
import { useNavigate } from "react-router-dom"; 
import "./button.css";

export default function Button({ bookTitle }) {
  const navigate = useNavigate(); 

  const goToBookDetails = (title) => {
    navigate(`/bookDetails/${title}`);
  };

  return (
    <button className="btn-secondary" onClick={() => goToBookDetails(bookTitle)}>
      Ver detalhes
    </button>
  );
}
