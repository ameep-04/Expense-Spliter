const Settle = require('../models/Settle');

// SETTLE PAYMENT
async function settlePayment(req, res, next) {
  try {
    const { groupId, toUser, amount } = req.body;

    const settlement = await Settle.create({
      group: groupId,
      fromUser: req.user._id,
      toUser,
      amount
    });

    res.status(201).json({ success: true, settlement });
  } catch (error) {
    next(error);
  }
}

// GET HISTORY
async function getSettleHistory(req, res, next) {
  try {
    const history = await Settle.find({ group: req.params.groupId });
    res.json({ success: true, history });
  } catch (error) {
    next(error);
  }
}

module.exports = { settlePayment, getSettleHistory };