// Equal split: divide amount by number of members
const equalSplit = (amount, members) => {
  const base = Math.floor((amount / members.length) * 100) / 100;
  const remainder = Math.round((amount - base * members.length) * 100) / 100;
  return members.map((m, i) => ({
    user: m.userId,
    amount: i === 0 ? base + remainder : base
  }));
};

// Exact split: each person's amount is manually given
const exactSplit = (amount, members) => {
  const sum = members.reduce((s, m) => s + m.amount, 0);
  if (Math.abs(sum - amount) > 0.01)
    throw new Error('Amounts do not add up to total');
  return members.map(m => ({ user: m.userId, amount: m.amount }));
};
// Percentage split: amount × percentage / 100
const percentageSplit = (amount, members) => {
  const total = members.reduce((s, m) => s + m.percentage, 0);
  if (Math.abs(total - 100) > 0.01)
    throw new Error('Percentages must sum to 100');
  return members.map(m => ({
    user: m.userId,
    amount: Math.round(amount * m.percentage) / 100
  }));
};

const calculateSplits = (amount, type, members) => {
  if (type === 'equal')      return equalSplit(amount, members);
  if (type === 'exact')      return exactSplit(amount, members);
  if (type === 'percentage') return percentageSplit(amount, members);
  throw new Error('Invalid split type');
};

module.exports = { calculateSplits };