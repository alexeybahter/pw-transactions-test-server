const moment = require('moment');
const { Worker } = require('worker_threads');
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

const getTransactionsSums = async (req, res, next) => {
  try {
    console.time('sum');
    const transactions = await transactionService.findAllTransactions();

    const transactions_sums = transactions.reduce((acc, transaction) => {
      acc.countSums += transaction.count;
      return acc;
    }, {countSums: 0});
    console.timeEnd('sum');

    return res.json({ status: 200, message: 'success', transactions_sums });
  } catch (error) {
    next(error);
  }
};

const getTransactionsSumsWithWorker = async (req, res, next) => {
  try {
    const transactions = await transactionService.findAllTransactions();
    console.time('sumWorker');

    let myWorker;

    initiateWorker();

    function initiateWorker () {
      let cb = (err, result) => {
        if(err) { return console.error(err); }

        console.timeEnd('sumWorker');
        return res.json({ status: 200, message: 'success', countSum: result });
      };
      myWorker = startWorker(__dirname.slice(0, -12) + '/workers/transactionWorker.js', cb);

      myWorker.postMessage({ multipleFactor: 2 });
    }

    function startWorker(path, cb) {
      let w = new Worker(path, { workerData: {transactions, sum: 0} });

      w.on('message', (msg) => {
        cb(null, msg);
      });

      w.on('error', cb);

      w.on('exit', (code) => {
        if(code !== 0) {
          console.error(new Error(`Worker stopped Code ${code}`))
        }
      });
      return w;
    }
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
  getTransactionsSums,
  getTransactionsSumsWithWorker,
  createTransaction,
};
