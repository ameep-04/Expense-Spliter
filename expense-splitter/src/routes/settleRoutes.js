const express = require('express');
const router = express.Router();
const { settlePayment, getSettleHistory } = require('../controllers/settleController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', settlePayment);
router.get('/history/:groupId', getSettleHistory);

module.exports = router;