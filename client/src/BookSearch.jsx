import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from './config';

const BookSearch = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const logout=()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login');
  }
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/books`, {
        params: {
          _t: Date.now(),
        },
      });
      const booksPayload = Array.isArray(response.data)
        ? response.data
        : response.data?.books;
      setBooks(Array.isArray(booksPayload) ? booksPayload : []);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Unable to load books right now. Please try again.');
    } finally {
      setLoading(false);
    }
 }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

 const normalizedQuery = query.toLowerCase();
  const filteredBooks = books.filter((book) => {
    const title = (book.title || '').toLowerCase();
    const author = (book.author || '').toLowerCase();
    return title.includes(normalizedQuery) || author.includes(normalizedQuery);
  });

  return (
    <div className="container">
      <h2>📚 Book List</h2>
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
        {loading && <p>Loading books...</p>}
        {!loading && error && <p>{error}</p>}
        {!loading && !error && filteredBooks.length === 0 && (
          <p>No books found.</p>
        )}
       {filteredBooks.map((book) => {
          const coverImage = book.imageUrl
            ? book.imageUrl
            : `https://via.placeholder.com/128x180?text=No+Image`;

          return (
            <Link
              to={`/book/${book._id}`}
             key={book._id}
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
