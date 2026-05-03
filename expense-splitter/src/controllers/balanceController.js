const Expense = require('../models/Expense');

const { calculateNetBalances } = require('../services/balanceService');

// SIMPLE BALANCE (basic version) -> Updated to use service
async function getGroupBalance(req, res, next) {
  try {
    const balances = await calculateNetBalances(req.params.groupId);

    res.json({ success: true, balances });
  } catch (error) {
    next(error);
  }
}

module.exports = { getGroupBalance };