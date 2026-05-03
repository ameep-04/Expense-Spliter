const Expense = require('../models/Expense');

const Settle = require('../models/Settle');

const calculateNetBalances = async (groupId) => {
  const expenses = await Expense.find({ group: groupId, isSettled: false })
    .populate('paidBy', 'name email')
    .populate('splits.user', 'name email');

  const balances = {};

  for (const expense of expenses) {
    if (!expense.paidBy) continue;
    
    const payerId = expense.paidBy._id.toString();

    // Credit the payer
    if (!balances[payerId]) balances[payerId] = { net: 0, name: expense.paidBy.name };
    balances[payerId].net += expense.amount;

    // Debit each participant their share
    for (const split of expense.splits) {
      if (!split.user) continue;
      const uid = split.user._id.toString();
      if (!balances[uid]) balances[uid] = { net: 0, name: split.user.name };
      balances[uid].net -= split.amount || 0;
    }
  }

  const settlements = await Settle.find({ group: groupId })
    .populate('fromUser', 'name email')
    .populate('toUser', 'name email');

  for (const settle of settlements) {
    if (!settle.fromUser || !settle.toUser) continue;
    const fromId = settle.fromUser._id.toString();
    const toId = settle.toUser._id.toString();

    if (!balances[fromId]) balances[fromId] = { net: 0, name: settle.fromUser.name };
    balances[fromId].net += settle.amount;

    if (!balances[toId]) balances[toId] = { net: 0, name: settle.toUser.name };
    balances[toId].net -= settle.amount;
  }

  return balances;
};

module.exports = { calculateNetBalances };