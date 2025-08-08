const Trade = require('../models/Trade');

exports.requestTrade = async (req, res) => {
  const { bookRequested, bookOffered } = req.body;
  try {
    const trade = new Trade({
      requester: req.user.id,
      owner: (await Book.findById(bookRequested)).owner,
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
    const trade = await Trade.findById(tradeId);
    if (trade.owner.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    trade.status = status;
    await trade.save();
    if (status === 'accepted') {
      await Book.findByIdAndUpdate(trade.bookRequested, { available: false });
      await Book.findByIdAndUpdate(trade.bookOffered, { available: false });
    }
    res.json(trade);
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
