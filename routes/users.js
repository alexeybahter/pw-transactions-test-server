const controller = require('../controllers/users');
const isAuthorized = require('../middlewares/isAuthorized');

module.exports = (router) => {
  // router.use(isAuthorized);

  router.get('/', controller.getUsers);
  router.get('/test', controller.getTest);
  router.get('/:id', controller.getUser);
};
