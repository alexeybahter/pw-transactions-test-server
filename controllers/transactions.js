const moment = require('moment');
const transactionService = require('../db/services/transactions');
const userService = require('../db/services/users');

const getTransactions = async (req, res, next) => {
  try {
    const { page = 1, per_page = 3, sort_item = 'id', sort_method = 'desc' } = req.query;

    const transactions = await transactionService.findAllTransactionsAndPagination({
      id: req.user.id,
      page,
      per_page,
      ...(sort_item && { sort_item }),
      ...(sort_method && { sort_method })
    });

    const total = transactions.count;
    const response = {
      pagination:
        {
          page: Number(page),
          per_page: Number(per_page),
          total
        },
      transactions: transactions.rows
    };

    return res.json({ status: 200, message: 'success', ...response });
  } catch (error) {
    next(error);
  }
};

const createTransaction = async (req, res, next) => {
  try {
    const {
      quantity,
      recipient_id
    } = req.body;

    const sender = await userService.findOneUser({
      where: { id: req.user.id },
    });

    const recipient = await userService.findOneUser({
      where: { id: recipient_id },
    });

    if (!recipient) throw { status: 400, message: 'recipient_id doesn\'t exist.' };

    const createdTransaction = await transactionService.createTransaction({
      count: quantity,
      sender_id: req.user.id,
      recipient_id,
      pw_count_resulted: sender.pw_count - quantity,
      date: moment().format('MMMM Do YYYY, h:mm:ss a'),
    });

    if (createdTransaction) {
      await sender.update({ pw_count: sender.pw_count - quantity });
      await recipient.update({ pw_count: recipient.pw_count + quantity });
    }

    return res.status(201).json({
      status: 201,
      msg: 'success',
      transaction: { ...createdTransaction.toJSON() }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  createTransaction,
};
