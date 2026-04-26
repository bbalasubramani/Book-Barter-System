const Trade = require('../models/Trade');
const Book = require('../models/Book');

exports.requestTrade = async (req, res) => {
  const { bookRequested, bookOffered } = req.body;
  try {
    if (!bookRequested || !bookOffered) {
      return res.status(400).json({ message: 'Both requested and offered books are required' });
    }
    
    const requestedBook = await Book.findById(bookRequested).select('owner');
    if (!requestedBook) {
      return res.status(404).json({ message: 'Requested book not found' });
    }

    if (requestedBook.owner.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot trade for your own book' });
    }

    const offeredBook = await Book.findById(bookOffered).select('owner available');
    if (!offeredBook) {
      return res.status(404).json({ message: 'Offered book not found' });
    }

    if (offeredBook.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only offer books you own' });
    }

    if (offeredBook.available === false) {
      return res.status(400).json({ message: 'Offered book is not available for trade' });
    }
    
    const trade = new Trade({
      requester: req.user.id,
      owner: requestedBook.owner,
      bookRequested,
      bookOffered
    });
    await trade.save();
    res.status(201).json(trade);
  } catch {
    res.status(400).json({ message: 'Error requesting trade' });
  }
};

exports.respondTrade = async (req, res) => {
  const { tradeId, status } = req.body;
  try {
    if (!tradeId || !status) {
      return res.status(400).json({ message: 'Trade id and status are required' });
    }

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be accepted or rejected' });
    }

    const trade = await Trade.findById(tradeId);
    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }
    if (trade.owner.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    if (trade.status !== 'pending') {
      return res.status(400).json({ message: `Trade is already ${trade.status}` });
    }
    
    if (status === 'accepted') {
      const [requestedBook, offeredBook] = await Promise.all([
        Book.findById(trade.bookRequested).select('available'),
        Book.findById(trade.bookOffered).select('available')
      ]);

      if (!requestedBook || !offeredBook) {
        return res.status(404).json({ message: 'One or more books in this trade no longer exist' });
      }

      if (requestedBook.available === false || offeredBook.available === false) {
        return res.status(400).json({ message: 'One or more books are no longer available' });
      }

      await Promise.all([
        Book.findByIdAndUpdate(trade.bookRequested, { available: false }),
        Book.findByIdAndUpdate(trade.bookOffered, { available: false })
      ]);
    }
    
    trade.status = status;
    await trade.save();

    return res.json(trade);
  } catch {
    res.status(400).json({ message: 'Error responding to trade' });
  }
};

exports.getMyTrades = async (req, res) => {
  const trades = await Trade.find({
    $or: [
      { requester: req.user.id },
      { owner: req.user.id }
    ]
  }).populate('bookRequested bookOffered requester owner', 'title name');
  res.json(trades);
};
