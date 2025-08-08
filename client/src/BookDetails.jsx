import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './App.css';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [showEmail, setShowEmail] = useState(false); // state for toggling owner's email

  useEffect(() => {
    fetch(`http://localhost:3030/api/books/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => setBook(data))
      .catch(err => console.error('Error:', err));
  }, [id]);

  if (!book) return <p style={{ color: 'white' }}>Loading...</p>;

  const ownerEmail = book.owner?.email || 'Email not available';

  return (
    <div className="book-details-container">
      <div className="left-box">
        <img
          src={book.imageUrl || 'https://via.placeholder.com/300x400?text=No+Image'}
          alt={book.title}
          className="book-image"
        />
        <div className="info-box">
          <p><strong>Book Name:</strong> {book.title}</p>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Genre:</strong> {book.genre}</p>
          <p><strong>Condition:</strong> {book.condition}</p>
          <p><strong>Page Count:</strong> {book.pageCount}</p>
          <p><strong>Owner:</strong> {book.owner?.name || 'Unknown'}</p>
          <button className="trade-button" onClick={() => setShowEmail(true)}>
          Ready to Trade
        </button>

        {showEmail && (
          <p style={{ marginTop: '10px', color: 'black' }}>
            Contact Email: <strong>{ownerEmail}</strong>
          </p>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default BookDetails;
