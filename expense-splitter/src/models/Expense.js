const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  category: { type: String, enum: ['food', 'travel', 'rent', 'entertainment', 'utilities', 'shopping', 'other'], default: 'other' },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  splitType: { type: String, enum: ['equal', 'exact', 'percentage'], default: 'equal' },
  splits: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number }
  }],
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
  isSettled: { type: Boolean, default: false },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);