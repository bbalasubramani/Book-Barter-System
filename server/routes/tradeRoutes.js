const express = require('express');
const { requestTrade, respondTrade, getMyTrades } = require('../controllers/tradeController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/request', auth, requestTrade);
router.post('/respond', auth, respondTrade);
router.get('/', auth, getMyTrades);

module.exports = router;