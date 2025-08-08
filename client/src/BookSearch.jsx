import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookSearch = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const logout=()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login');
  }
  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:3030/api/books/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(query.toLowerCase()) ||
    (book.author && book.author.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="container">
      <h2>📚 My Book List</h2>
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or author"
        />
        <button onClick={() => navigate('/add-book')}>➕ Add Book</button>
        <button onClick={logout}>LogOut</button>
      </div>

      <div className="card-grid">
        {filteredBooks.map((book, index) => {
          const coverImage = book.imageUrl
            ? book.imageUrl
            : `https://via.placeholder.com/128x180?text=No+Image`;

          return (
            <Link
              to={`/book/${book._id}`}
              key={index}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="card">
                <img src={coverImage} alt={book.title} />
                <div className="card-content">
                  <h4>{book.title}</h4>
                  <p>{book.author || 'Unknown Author'}</p>
                  <button>View</button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BookSearch;
