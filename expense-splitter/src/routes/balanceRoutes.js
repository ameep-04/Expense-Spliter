const express = require('express');
const router = express.Router();
const { getGroupBalance } = require('../controllers/balanceController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/:groupId', getGroupBalance);

module.exports = router;