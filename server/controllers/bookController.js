const Book = require('../models/Book');

exports.addBook = async (req, res) => {
  const { title, author, genre, condition, description, pageCount, imageUrl, email } = req.body;
  try {
    if (!title || !author) {
      return res.status(400).json({ message: 'Title and author are required' });
    }

    const normalizedPageCount = Number(pageCount);
    if (!Number.isFinite(normalizedPageCount) || normalizedPageCount <= 0) {
      return res.status(400).json({ message: 'Page count must be a positive number' });
    }
    
    const book = new Book({
      title: title.trim(),
      author: author.trim(),
      genre,
      condition,
      description,
      pageCount: normalizedPageCount,
      imageUrl,
      email,
      owner: req.user.id
    });
    await book.save();
    return res.status(201).json(book);
  } catch {
    res.status(400).json({ message: 'Error adding book' });
  }
};

exports.getBooks = async (req, res) => {
  const { query } = req.query;
  const books = await Book.find({
    title: { $regex: query || '', $options: 'i' },
    // Treat legacy records with a missing `available` field as available.
    available: { $ne: false }
  }).populate('owner', 'name');
  res.json(books);
};

exports.getMyBooks = async (req, res) => {
  const books = await Book.find({ owner: req.user.id });
  res.json(books);
};

exports.getBookById = async (req, res) => {
  const book = await Book.findById(req.params.id).populate('owner', 'name email');
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  res.json(book);
};
