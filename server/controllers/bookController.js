const Book = require('../models/Book');

exports.addBook = async (req, res) => {
  const { title, author, genre, condition, description, pageCount, imageUrl,email } = req.body;
  try {
    const book = new Book({
      title, author, genre, condition, description, pageCount, imageUrl,email,
      owner: req.user.id
    });
    await book.save();
    res.status(201).json(book);
  } catch {
    res.status(400).json({ message: 'Error adding book' });
  }
};

exports.getBooks = async (req, res) => {
  const { query } = req.query;
  const books = await Book.find({
    title: { $regex: query || '', $options: 'i' },
    available: true
  }).populate('owner', 'name');
  res.json(books);
};

exports.getMyBooks = async (req, res) => {
  const books = await Book.find({ owner: req.user.id });
  res.json(books);
};

exports.getBookById = async (req, res) => {
  const book = await Book.findById(req.params.id).populate('owner', 'name');
  res.json(book);
};
