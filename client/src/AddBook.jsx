import React, { useState } from 'react';
import axios from 'axios';

const AddBook = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const token = localStorage.getItem('token');

  const searchBooks = async () => {
    try {
      const res = await axios.get(`https://openlibrary.org/search.json?q=${search}`);
      setResults(res.data.docs.slice(0, 5));
    } catch (error) {
      console.error('OpenLibrary search failed:', error);
    }
  };

  const handleAddBook = async (book) => {
    try {
      await axios.post('http://localhost:3030/api/books/add', {
        title: book.title,
        author: book.author_name ? book.author_name.join(', ') : 'Unknown',
        genre: book.subject ? book.subject[0] : 'General',
        condition: 'Good',
        description: book.first_sentence ? book.first_sentence[0] : 'No description available',
        pageCount: book.number_of_pages_median || 100,
        imageUrl: `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`,
        email: localStorage.getItem('userEmail') || 'No email available',
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      alert('Book added!');
    } catch (err) {
      console.error('Error adding book:', err);
    }
  };

  return (
    <div className="add-book-container">
      <h2>🔍 Search & Add Book</h2>
      <div className="add-book-searchbar">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search book from OpenLibrary"
        />
        <button onClick={searchBooks}>Search</button>
        
      </div>

      <div className="add-book-grid">
        {results.map((book, index) => (
          <div key={index} className="add-book-card">
            <img
              src={book.cover_i
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                : 'https://via.placeholder.com/128x180?text=No+Image'}
              alt={book.title}
            />
            <div className="add-book-content">
              <h4>{book.title}</h4>
              <p>{book.author_name ? book.author_name.join(', ') : 'Unknown Author'}</p>
              <button onClick={() => handleAddBook(book)}>Add</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddBook;
