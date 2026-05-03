const express = require('express');
const router = express.Router();
const { addExpense, getGroupExpenses, deleteExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/add', addExpense);
router.get('/group/:groupId', getGroupExpenses);
router.delete('/:expenseId', deleteExpense);

module.exports = router;