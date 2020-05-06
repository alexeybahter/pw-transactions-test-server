const validators = require('../validators');
const controller = require('../controllers/auth');

module.exports = (router) => {
  router.post('/sign-in', validators('auth.signIn'), controller.singIn);
  router.post('/sign-up', validators('auth.signUp'), controller.singUp);
};
