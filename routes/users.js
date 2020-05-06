const controller = require('../controllers/users');
const isAuthorized = require('../middlewares/isAuthorized');

module.exports = (router) => {
  router.use(isAuthorized);

  router.get('/', controller.getUsers);
  router.get('/:id', controller.getUser);
};
