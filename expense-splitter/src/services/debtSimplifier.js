const { calculateNetBalances } = require('./balanceService');

const simplifyDebts = async (groupId) => {
  const balances = await calculateNetBalances(groupId);

  // Separate into who is owed money vs who owes money
  const creditors = [];  // net > 0 (will receive money)
  const debtors = [];    // net < 0 (must pay money)

  for (const [userId, data] of Object.entries(balances)) {
    if (data.net > 0.01)  creditors.push({ userId, amount: data.net, name: data.name });
    if (data.net < -0.01) debtors.push({ userId, amount: Math.abs(data.net), name: data.name });
  }
   // Sort largest first — greedy picks biggest each round
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const transactions = [];
  let i = 0, j = 0;

  while (i < creditors.length && j < debtors.length) {
    const pay = Math.min(creditors[i].amount, debtors[j].amount);

    transactions.push({
      from: debtors[j].userId, fromName: debtors[j].name,
      to: creditors[i].userId, toName: creditors[i].name,
      amount: Math.round(pay * 100) / 100
    });

    creditors[i].amount -= pay;
    debtors[j].amount -= pay;

    if (creditors[i].amount < 0.01) i++;
    if (debtors[j].amount < 0.01) j++;
     }

  return transactions;
};

module.exports = { simplifyDebts };