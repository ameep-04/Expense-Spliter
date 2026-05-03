const Expense = require("../models/Expense");

// ADD EXPENSE
async function addExpense(req, res, next) {
  try {
    const { groupId, amount, description, splits, splitType, category } =
      req.body;

    const expense = await Expense.create({
      group: groupId,
      paidBy: req.user._id,
      amount,
      description,
      splits: splits || [],
      splitType: splitType || "equal",
      category: category || "other",
    });

    res.status(201).json({ success: true, expense });
  } catch (error) {
    next(error);
  }
}

// GET GROUP EXPENSES
async function getGroupExpenses(req, res, next) {
  try {
    const expenses = await Expense.find({ group: req.params.groupId })
      .populate("paidBy", "name email")
      .populate("splits.user", "name email");
    res.json({ success: true, expenses });
  } catch (error) {
    next(error);
  }
}

// DELETE EXPENSE
async function deleteExpense(req, res, next) {
  try {
    await Expense.findByIdAndDelete(req.params.expenseId);
    res.json({ success: true, message: "Expense deleted" });
  } catch (error) {
    next(error);
  }
}

module.exports = { addExpense, getGroupExpenses, deleteExpense };
