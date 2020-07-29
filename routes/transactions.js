const validators = require('../validators');
const controller = require('../controllers/transactions');
const isAuthorized = require('../middlewares/isAuthorized');

module.exports = (router) => {
  router.use(isAuthorized);

  router.get('/', validators('transactions.getAll'), controller.getTransactions);
  router.get('/statistic', controller.getTransactionsSums);
  router.get('/statistic-worker', controller.getTransactionsSumsWithWorker);
  router.post('/', validators('transactions.createTransaction'), controller.createTransaction);
};
