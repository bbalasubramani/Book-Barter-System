const mongoose = require('mongoose');
const tradeSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bookOffered: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  bookRequested: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
});
module.exports = mongoose.model('Trade', tradeSchema);
