const express = require('express');
const { addBook, getBooks, getMyBooks, getBookById } = require('../controllers/bookController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/add', auth, addBook);
router.get('/', getBooks);
router.get('/mine', auth, getMyBooks);
router.get('/:id', getBookById);

module.exports = router;
